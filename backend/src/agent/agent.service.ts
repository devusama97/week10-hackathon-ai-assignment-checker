import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Agent, run, setDefaultOpenAIClient, setOpenAIAPI } from '@openai/agents';

@Injectable()
export class AgentService {
    private readonly logger = new Logger(AgentService.name);
    private client: OpenAI;

    constructor(private configService: ConfigService) {
        this.client = new OpenAI({
            apiKey: this.configService.get<string>('OPENROUTER_API_KEY'),
            baseURL: this.configService.get<string>('BASE_URL'),
        });

        // Configure @openai/agents
        setDefaultOpenAIClient(this.client as any);
        setOpenAIAPI('chat_completions');
    }

    private extractContent(result: any): string {
        const assistantMessages = result.output.filter(
            (m: any) => m.type === 'message' && m.role === 'assistant'
        );
        const lastMessage = assistantMessages[assistantMessages.length - 1];
        if (!lastMessage) return '';

        return typeof lastMessage.content === 'string'
            ? lastMessage.content
            : Array.isArray(lastMessage.content)
                ? lastMessage.content.map((c: any) => c.text || JSON.stringify(c)).join('')
                : JSON.stringify(lastMessage.content);
    }

    async evaluateSubmission(
        assignmentTitle: string,
        instructions: string,
        markingMode: string,
        submissionText: string,
    ) {
        const model = this.configService.get<string>('AI_MODEL');

        // 1. Extractor Agent: Identify student details
        const extractor = new Agent({
            name: 'Extractor',
            instructions: `Extract Student Name and Roll Number from the provided text. 
            Return ONLY the name and roll number in a clear format. If not found, use "Unknown".`,
            model: model,
        });

        // 2. Grader Agent: Evaluation logic
        const grader = new Agent({
            name: 'Grader',
            instructions: `Evaluate the student submission based on these instructions: "${instructions}".
            Assignment Title: "${assignmentTitle}"
            Marking Mode: ${markingMode.toUpperCase()}.
            - If STRICT: Be very critical. Penalize for word count, formatting, and relevance.
            - If LOOSE: Be encouraging. Focus on the core message and effort.
            Provide a clear evaluation and a score out of 100.`,
            model: model,
        });

        // 3. Reviewer Agent: Final JSON Generator
        const reviewer = new Agent({
            name: 'Reviewer',
            instructions: `You are the final reviewer for an AI Assignment Checker.
            You will receive extraction details and grader feedback.
            Your task is to produce a FINAL JSON OBJECT ONLY.
            
            JSON FORMAT:
            {
                "studentName": "Extracted Name",
                "rollNumber": "Extracted Roll",
                "score": 85,
                "remarks": "Summary of feedback"
            }
            
            IMPORTANT: DO NOT add any other text. ONLY valid JSON.`,
            model: model,
        });

        try {
            this.logger.log(`[AI] Starting sequential evaluation for: ${assignmentTitle}`);

            // Step 1: Extract Name & Roll
            this.logger.log(`[AI] Running Extractor...`);
            const extractionResult = await run(extractor, `Text: ${submissionText}`);
            const extractionContent = this.extractContent(extractionResult);

            // Step 2: Grade the submission
            this.logger.log(`[AI] Running Grader...`);
            const gradingResult = await run(grader, `Submission: ${submissionText}\n\nExtraction Info: ${extractionContent}`);
            const gradingContent = this.extractContent(gradingResult);

            // Step 3: Final Review and JSON generation
            this.logger.log(`[AI] Running Reviewer...`);
            const finalQuery = `
                Extraction Info: ${extractionContent}
                Grading Info: ${gradingContent}
                
                Generate the final JSON based on these details.`;
            const finalResult = await run(reviewer, finalQuery);
            const finalContent = this.extractContent(finalResult);

            this.logger.log(`[AI] Final Reviewer Output: ${finalContent}`);

            // Improved JSON Parsing
            const jsonMatch = finalContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const parsed = JSON.parse(jsonMatch[0]);
                    // Validation
                    if (parsed.score !== undefined) {
                        this.logger.log(`[AI] Successfully parsed marksheet for ${parsed.studentName}`);
                        return {
                            studentName: parsed.studentName || 'Unknown',
                            rollNumber: parsed.rollNumber || 'Unknown',
                            score: Number(parsed.score) || 0,
                            remarks: parsed.remarks || 'No remarks provided'
                        };
                    }
                } catch (e) {
                    this.logger.error('JSON Parse Error in Reviewer response', e);
                }
            }

            // Fallback: If JSON parsing fails, try to extract fields manually or return error
            this.logger.warn('Reviewer failed to provide valid JSON. Attempting manual field extraction...');

            return {
                studentName: extractionContent.match(/Name:\s*([^\n,]+)/i)?.[1]?.trim() || 'Unknown',
                rollNumber: extractionContent.match(/Roll:\s*([^\n,]+)/i)?.[1]?.trim() || 'Unknown',
                score: 0,
                remarks: "AI error: The final reviewer did not provide a valid JSON report. Please re-run."
            };

        } catch (error) {
            this.logger.error('AI sequence failed', error);
            throw error;
        }
    }
}

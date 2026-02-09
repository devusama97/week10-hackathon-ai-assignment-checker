import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AgentService {
    private readonly logger = new Logger(AgentService.name);
    private client: OpenAI;

    constructor(private configService: ConfigService) {
        this.client = new OpenAI({
            apiKey: this.configService.get<string>('OPENROUTER_API_KEY'),
            baseURL: this.configService.get<string>('BASE_URL'),
        });
    }

    async evaluateSubmission(
        assignmentTitle: string,
        instructions: string,
        markingMode: string,
        submissionText: string,
    ) {
        const model = this.configService.get<string>('AI_MODEL') || 'google/gemini-2.0-flash-exp:free';
        console.log(`[AgentService] Evaluating with model: ${model}`);

        const prompt = `
You are an expert academic evaluator. Your task is to evaluate a student's submission based on specific instructions.

### Assignment Details:
- **Title**: ${assignmentTitle}
- **Instructions**: ${instructions}
- **Marking Mode**: ${markingMode.toUpperCase()}

### Markings Rules:
- If **STRICT**: Be very critical. Penalize heavily for missing requirements, word count issues, and poor relevance.
- If **LOOSE**: Be encouraging. Reward effort and core ideas even if the structure isn't perfect.

### Student Submission Text:
---
${submissionText}
---

### Your Tasks:
1. **Extract Identity**: Find the Student Name and Roll Number from the text.
2. **Evaluate Content**: Assess how well the submission follows the instructions.
3. **Assign Score**: Provide a numerical score from 0 to 100.
4. **Provide Feedback**: Write helpful, concise remarks.

### Output Format:
Return ONLY a valid JSON object. Do not include any markdown formatting like \`\`\`json.
{
  "studentName": "Extracted Name (or 'Unknown')",
  "rollNumber": "Extracted Roll (or 'Unknown')",
  "score": number,
  "remarks": "Your detailed feedback here"
}
`;

        try {
            console.log(`[AI] Sending request to ${model}...`);
            const completion = await this.client.chat.completions.create({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.1,
            });

            const content = completion.choices[0]?.message?.content || '';
            console.log(`[AI] Raw Response: ${content}`);

            // Clean response (remove markdown if any)
            const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                try {
                    const parsed = JSON.parse(jsonMatch[0]);
                    console.log(`[AI] Successfully parsed result for ${parsed.studentName}`);
                    return {
                        studentName: parsed.studentName || 'Unknown',
                        rollNumber: parsed.rollNumber || 'Unknown',
                        score: Number(parsed.score) || 0,
                        remarks: parsed.remarks || 'No remarks provided'
                    };
                } catch (e) {
                    console.error('[AI] JSON Parse Error:', e);
                }
            }

            throw new Error('Could not parse AI response as JSON');
        } catch (error) {
            console.error('[AI] Request failed:', error);
            throw error;
        }
    }
}

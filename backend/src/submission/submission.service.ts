import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Submission, SubmissionDocument } from '../schemas/submission.schema';
import { AssignmentService } from '../assignment/assignment.service';
import { AgentService } from '../agent/agent.service';
import { PDFParse } from 'pdf-parse';
import { Express } from 'express';

@Injectable()
export class SubmissionService {
    private readonly logger = new Logger(SubmissionService.name);

    constructor(
        @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>,
        private assignmentService: AssignmentService,
        private agentService: AgentService,
    ) { }

    async processSubmissions(assignmentId: string, files: Express.Multer.File[]) {
        const assignment = await this.assignmentService.findOne(assignmentId);
        if (!assignment) throw new Error('Assignment not found');

        const results = [];

        for (const file of files) {
            try {
                // 1. Extract Text using v2 syntax for Buffer
                const parser = new PDFParse({ data: file.buffer });
                const pdfData = await parser.getText();
                const text = pdfData.text;

                // 2. Initialize Submission in DB
                const submission = new this.submissionModel({
                    assignmentId: new Types.ObjectId(assignmentId),
                    studentName: 'Extracting...', // Will be updated by AI or filename
                    rollNumber: 'Extracting...',
                    extractedText: text,
                    status: 'processing',
                });
                await submission.save();

                // 3. Evaluate using Agents
                const evaluation = await this.agentService.evaluateSubmission(
                    assignment.title,
                    assignment.instructions,
                    assignment.markingMode,
                    text
                );

                // Update with AI results
                submission.score = evaluation.score || 0;
                submission.remarks = evaluation.remarks || 'No remarks provided';

                // Use AI-extracted details if they seem valid (not "Unknown" or empty)
                if (evaluation.studentName && evaluation.studentName !== 'Unknown') {
                    submission.studentName = evaluation.studentName;
                }
                if (evaluation.rollNumber && evaluation.rollNumber !== 'Unknown') {
                    submission.rollNumber = evaluation.rollNumber;
                }

                // Only fallback to filename if AI couldn't extract details
                if (submission.studentName === 'Extracting...') {
                    const filenameParts = file.originalname.replace('.pdf', '').split('_');
                    if (filenameParts.length >= 2) {
                        submission.studentName = filenameParts[0];
                        submission.rollNumber = filenameParts[1];
                    } else {
                        submission.studentName = file.originalname;
                        submission.rollNumber = "N/A";
                    }
                }

                submission.status = 'completed';
                await submission.save();
                results.push(submission);
            } catch (error) {
                this.logger.error(`Failed to process ${file.originalname}`, error);
            }
        }

        return results;
    }

    async findByAssignment(assignmentId: string) {
        return this.submissionModel.find({ assignmentId: new Types.ObjectId(assignmentId) }).exec();
    }

    async delete(id: string) {
        return this.submissionModel.findByIdAndDelete(id).exec();
    }

    async deleteAllByAssignment(assignmentId: string) {
        return this.submissionModel.deleteMany({ assignmentId: new Types.ObjectId(assignmentId) }).exec();
    }
}

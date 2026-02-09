import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubmissionDocument = Submission & Document;

@Schema({ timestamps: true })
export class Submission {
    @Prop({ type: Types.ObjectId, ref: 'Assignment', required: true })
    assignmentId: Types.ObjectId;

    @Prop({ required: true })
    studentName: string;

    @Prop({ required: true })
    rollNumber: string;

    @Prop({ required: true })
    extractedText: string;

    @Prop()
    score: number;

    @Prop()
    remarks: string;

    @Prop({ default: 'pending' })
    status: 'pending' | 'processing' | 'completed' | 'failed';

    @Prop()
    pdfFileId?: string; // GridFS ID
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);

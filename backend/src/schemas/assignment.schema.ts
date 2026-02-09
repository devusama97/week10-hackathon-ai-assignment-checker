import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AssignmentDocument = Assignment & Document;

@Schema({ timestamps: true })
export class Assignment {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  instructions: string;

  @Prop({ enum: ['strict', 'loose'], default: 'loose' })
  markingMode: string;

  @Prop()
  wordCountRequirement?: number;

  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status: string;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);

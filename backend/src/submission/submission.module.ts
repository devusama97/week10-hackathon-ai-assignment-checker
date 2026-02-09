import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { Submission, SubmissionSchema } from '../schemas/submission.schema';
import { AssignmentModule } from '../assignment/assignment.module';
import { AgentModule } from '../agent/agent.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Submission.name, schema: SubmissionSchema }]),
        AssignmentModule,
        AgentModule,
    ],
    controllers: [SubmissionController],
    providers: [SubmissionService],
})
export class SubmissionModule { }

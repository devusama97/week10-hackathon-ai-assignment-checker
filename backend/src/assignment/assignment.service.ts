import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment, AssignmentDocument } from '../schemas/assignment.schema';

@Injectable()
export class AssignmentService {
    constructor(@InjectModel(Assignment.name) private assignmentModel: Model<AssignmentDocument>) { }

    async create(data: any): Promise<AssignmentDocument> {
        const created = new this.assignmentModel(data);
        return created.save();
    }

    async findAll(userId: string): Promise<AssignmentDocument[]> {
        return this.assignmentModel.find({ userId }).exec();
    }

    async findOne(id: string, userId: string): Promise<AssignmentDocument | null> {
        return this.assignmentModel.findOne({ _id: id, userId }).exec();
    }

    async delete(id: string, userId: string) {
        return this.assignmentModel.findOneAndDelete({ _id: id, userId }).exec();
    }

    async updateStatus(id: string, status: string, userId: string) {
        return this.assignmentModel.findOneAndUpdate({ _id: id, userId }, { status }, { new: true }).exec();
    }
}

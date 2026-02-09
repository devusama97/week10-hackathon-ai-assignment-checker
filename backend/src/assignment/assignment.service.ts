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

    async findAll(): Promise<AssignmentDocument[]> {
        return this.assignmentModel.find().exec();
    }

    async findOne(id: string): Promise<AssignmentDocument | null> {
        return this.assignmentModel.findById(id).exec();
    }

    async delete(id: string) {
        return this.assignmentModel.findByIdAndDelete(id).exec();
    }

    async updateStatus(id: string, status: string) {
        return this.assignmentModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    }
}

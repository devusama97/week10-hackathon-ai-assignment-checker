import { Controller, Post, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { AssignmentService } from './assignment.service';

@Controller('assignments')
export class AssignmentController {
    constructor(private readonly assignmentService: AssignmentService) { }

    @Post()
    async create(@Body() createAssignmentDto: any) {
        return this.assignmentService.create(createAssignmentDto);
    }

    @Get()
    async findAll() {
        return this.assignmentService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.assignmentService.findOne(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.assignmentService.delete(id);
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.assignmentService.updateStatus(id, status);
    }
}

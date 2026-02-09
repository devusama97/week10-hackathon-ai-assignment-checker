import { Controller, Post, Body, Get, Param, Delete, Patch, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssignmentService } from './assignment.service';

@Controller('assignments')
@UseGuards(JwtAuthGuard)
export class AssignmentController {
    constructor(private readonly assignmentService: AssignmentService) { }

    @Post()
    async create(@Body() createAssignmentDto: any, @Req() req: any) {
        return this.assignmentService.create({ ...createAssignmentDto, userId: req.user.userId });
    }

    @Get()
    async findAll(@Req() req: any) {
        return this.assignmentService.findAll(req.user.userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: any) {
        return this.assignmentService.findOne(id, req.user.userId);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: any) {
        return this.assignmentService.delete(id, req.user.userId);
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body('status') status: string, @Req() req: any) {
        return this.assignmentService.updateStatus(id, status, req.user.userId);
    }
}

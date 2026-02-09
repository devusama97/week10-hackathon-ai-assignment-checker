import { Controller, Post, Param, UploadedFiles, UseInterceptors, Get, Res, Delete, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SubmissionService } from './submission.service';
import type { Response } from 'express';
import * as excel from 'exceljs';

@Controller('submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionController {
    constructor(private readonly submissionService: SubmissionService) { }

    @Post('upload/:assignmentId')
    @UseInterceptors(FilesInterceptor('files'))
    async upload(
        @Param('assignmentId') assignmentId: string,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: any
    ) {
        return this.submissionService.processSubmissions(assignmentId, files, req.user.userId);
    }

    @Get('assignment/:assignmentId')
    async getByAssignment(@Param('assignmentId') assignmentId: string, @Req() req: any) {
        return this.submissionService.findByAssignment(assignmentId, req.user.userId);
    }

    @Get('export/:assignmentId')
    async export(@Param('assignmentId') assignmentId: string, @Res() res: Response, @Req() req: any) {
        const submissions = await this.submissionService.findByAssignment(assignmentId, req.user.userId);

        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Marks Sheet');

        worksheet.columns = [
            { header: 'Student Name', key: 'studentName', width: 20 },
            { header: 'Roll Number', key: 'rollNumber', width: 15 },
            { header: 'Score', key: 'score', width: 10 },
            { header: 'Remarks', key: 'remarks', width: 50 },
        ];

        submissions.forEach((s) => {
            worksheet.addRow({
                studentName: s.studentName,
                rollNumber: s.rollNumber,
                score: s.score,
                remarks: s.remarks,
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + `Marks_Sheet_${assignmentId}.xlsx`,
        );

        return workbook.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: any) {
        return this.submissionService.delete(id, req.user.userId);
    }

    @Delete('assignment/:assignmentId')
    async removeByAssignment(@Param('assignmentId') assignmentId: string, @Req() req: any) {
        return this.submissionService.deleteAllByAssignment(assignmentId, req.user.userId);
    }
}

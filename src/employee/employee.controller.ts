import { Body, Controller, Post, Get, Param, Delete, UploadedFile, UseInterceptors, HttpException, Res, Header, Put } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { employee, updateEmployee } from 'src/model/employee.model';
import { apiResponse } from 'src/model/apiResponse';
import * as path from 'path';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CsvService } from 'src/common/csv/csv.service';
import { Response } from 'express';
import { request } from 'http';


@Controller('api/employee')
export class EmployeeController {

    constructor(
        private employeeService:EmployeeService,
        private csvService: CsvService
    ){}

    @Post('/')
    async create(@Body() request: employee) : Promise<apiResponse<employee>> {
        const result = await this.employeeService.create(request);
        return {
            data: result,
            message: 'Success create new employee',
            error: false
        }
    }

    @Get('/')
    async index() : Promise<apiResponse<employee[]>> {
        const employee = await this.employeeService.get();
        if ( employee.length == 0 ) {
            return {
                data: employee,
                message: 'Employee not found',
                error: false
            }
        }

        return {
            data: employee,
            message: 'Success get all employee',
            error: false
        }
    }

    @Post('/upload')
    @UseInterceptors(
        FileInterceptor('file', {
          storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
              const ext = path.extname(file.originalname);
              const filename = `${Date.now()}-${file.originalname}`;
              cb(null, filename);
            },
          }),
          fileFilter: (req, file, cb) => {
            if (file.mimetype !== 'text/csv') {
              return cb(new Error('Only CSV files are allowed!'), false);
            }
            cb(null, true);
          },
        }),
    )
    async uploadCSV(@UploadedFile() file: Express.Multer.File) : Promise<apiResponse<any>>{
        if (!file) {
            throw new HttpException('Please select csv file', 400)
        }
        const filePath = path.join(__dirname, '../../uploads', file.filename);
        const data = await this.csvService.processCsv(filePath);
        if (data.length == 0) {
            throw new HttpException('Can\'t use blank csv', 400)
        }
        const result = await this.employeeService.createFromCsv(data);
        return {
            message: `Success create ${result[0].length} items, and failed for ${result[1].length} items`,
            error : false
        }
    }

    @Get('/download')
    @Header('Content-Type', 'text/csv')
    @Header('Content-Disposition', 'attachment; filename=employees.csv')
    async exportEmployeesToCsv(@Res() res: Response) {
        try {
          const filePath = await this.csvService.exportEmployeesToCsv();
    
          const stream = fs.createReadStream(filePath);
          stream.pipe(res);
        } catch (error) {
          res.status(500).send('Failed to export employees to CSV');
        }
    }

    @Get('/:id')
    async view(@Param('id') id: string ) : Promise<apiResponse<employee>> {
        const employeeId = parseInt(id)
        const employee = await this.employeeService.find(employeeId);
        return {
            data: employee,
            message: 'Success get employee',
            error: false
        }
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() request: updateEmployee) : Promise<apiResponse<employee>> {
        const employeeId = parseInt(id)
        const employee = await this.employeeService.update(employeeId, request)
        return {
            data: employee,
            message: 'Success update employee',
            error: false
        }
    } 

    @Delete('/:id')
    async delete(@Param('id') id: string) : Promise<apiResponse<employee>> {
        const employeeId = parseInt(id);
        const employee = await this.employeeService.find(employeeId);
        await this.employeeService.delete(employeeId);
        return {
            message: 'Success delete employee',
            error: false
        }
    }
}

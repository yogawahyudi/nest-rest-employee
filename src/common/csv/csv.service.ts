import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs'
import { parse } from 'fast-csv';
import { error } from 'console';
import { employee } from 'src/model/employee.model';
import { EmployeeService } from 'src/employee/employee.service';
import * as path from 'path';
import * as moment from 'moment';

@Injectable()
export class CsvService {
    constructor(
        private employeeService : EmployeeService
    ){}

    async processCsv(filePath: string) {
        const rows: any[] = [];

        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(parse({ headers: true }))
                .on('error', (error) => reject(error))
                .on('data', (row) => rows.push(row))
                .on('end', () => resolve());
        });
        this.unlinkFile(filePath)
        return rows
    }

    unlinkFile(filePath : string) {
        fs.unlinkSync(filePath);
    }

    generateCsvContent(data: employee[]): string {
        let header : String | String[] = ['nama', 'nomor', 'jabatan', 'departmen', 'tanggal_masuk', 'foto', 'status' ]
            header = header.join(',') + '\n';
        const dataRows = data.map((employee) =>{ 
            let row = [
                employee.full_name,
                employee.employee_number,
                employee.position,
                employee.department,
                employee.hire_date,
                employee.photo,
                employee.status
            ]
            return row.join(',') + '\n'
        });
    
        return header + dataRows.join('');
    }

    async exportEmployeesToCsv(): Promise<string> {
        try {
          const employees = await this.employeeService.get()
          // Generate CSV content
          const csvContent = this.generateCsvContent(employees);
    
          // Save CSV to file
          const timestamp = moment().format('YYYY-MM-DD');
          const fileName =  `${timestamp}_employees.csv`;
          const uploadsDir = path.join(__dirname, '..', 'download');
          
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
          }

          const filePath = path.join(uploadsDir, fileName);
          fs.writeFileSync(filePath, csvContent);
    
          return filePath;
        } catch (error) {
          throw new Error(`Failed to export employees to CSV: ${error.message}`);
        }
    }
}

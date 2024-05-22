import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ValidationService } from './validation/validation.service';
import { CsvService } from './csv/csv.service';
import { EmployeeService } from 'src/employee/employee.service';
import { LogServiceService } from './log-service/log-service.service';

@Global()
@Module({
    imports: [],
    providers: [PrismaService, ValidationService, CsvService, EmployeeService, LogServiceService],
    exports: [PrismaService, ValidationService, CsvService, LogServiceService]
})
export class CommonModule {}

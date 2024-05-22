import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { CsvService } from 'src/common/csv/csv.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, CsvService]
})
export class EmployeeModule {}

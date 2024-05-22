import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [CommonModule, EmployeeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

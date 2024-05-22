import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ValidationService } from 'src/common/validation/validation.service';
import { employee, updateEmployee, logs } from 'src/model/employee.model';
import { employeeValidation } from './employee.validation';
import * as moment from 'moment'
import { Prisma } from '@prisma/client';
import { LogServiceService } from 'src/common/log-service/log-service.service';

@Injectable()
export class EmployeeService {

    constructor(
        private validationService : ValidationService,
        private prismaService : PrismaService,
        private logSevice: LogServiceService
    ){}

    async create(request: employee) : Promise<employee> {
        let employeeRequest: employee = this.validationService.validate(employeeValidation.createEmployee, request)
        employeeRequest.hire_date = moment(employeeRequest.hire_date).toDate()
        const existingEmployee = await this.checkExistingEmployee({employee_number : employeeRequest.employee_number})
        if (existingEmployee) {
             throw new HttpException('Employee with the same employee_number already exists', 400);
        }
        
        const employee = await this.prismaService.employees.create({
            data: employeeRequest
        })
        return employee;
    }

    async get() : Promise<employee[]> {
        const employee = await this.prismaService.employees.findMany();
        return employee
    }

    async find(id: number) : Promise<employee> {
        const employee = await this.prismaService.employees.findUnique({
            where: {id: id}
        })

        if(!employee) {
            throw new HttpException('Employee not found', 404);
        }

        return employee
    }

    async checkExistingEmployee(where : Prisma.EmployeesWhereUniqueInput) : Promise<employee> {
        const existingEmployee = await this.prismaService.employees.findUnique({
            where : where
        });
        return existingEmployee
    }

    async update(id:number, request : updateEmployee) : Promise<employee> {
        let employee = await this.find(id);
        let updatedData = { ...employee, ...request };
        updatedData = this.validationService.validate(employeeValidation.updateEmployee, updatedData);
        updatedData.hire_date = moment(updatedData.hire_date).toDate();
        
        employee = await this.prismaService.employees.update({
            where: {id: id},
            data : updatedData
        })
        return employee
    }

    async delete(id: number) : Promise<employee> {
        let employee = await this.find(id);
        employee = await this.prismaService.employees.delete({
            where : {id: id}
        })
        return employee
    }

    async createFromCsv(datas: any[]): Promise<[any[], any[]]> {
        let createdItems: employee[] = []
        let uncreatedItems: any[] = []
        await this.logSevice.deleteRecord();
        for (const data of datas) {
            let employee: logs = {
                full_name: data.nama,
                employee_number: data.nomor,
                position: data.jabatan,
                department: data.departmen,
                hire_date: new Date(data.tanggal_masuk),
                photo: data.foto,
                status: data.status
            };
            
            try {
                const existingEmployee = await this.checkExistingEmployee({employee_number : data.nomor})
                if (existingEmployee) {
                    employee.error = 'Employee with the same employee_number already exists.';
                    uncreatedItems.push(employee);
                    await this.logSevice.create({
                        data: JSON.stringify(employee),
                        failed_reason: employee.error
                    });
                    continue;
                }
                const createdEmployee = await this.prismaService.employees.create({
                    data: employee
                });
                createdItems.push(createdEmployee);
            } catch (error) {
                employee.error = 'Unknown error occurred';
                uncreatedItems.push(employee);
                await this.logSevice.create({
                    data: JSON.stringify(employee),
                    failed_reason: employee.error
                });
            }
        }
        return [createdItems, uncreatedItems];
    }
}
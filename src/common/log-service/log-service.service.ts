import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Count } from '@prisma/client/runtime/library';
import { failedImportedEmployee } from 'src/model/failedImportedEmployee.model';

@Injectable()
export class LogServiceService {
    constructor(
        private prismaService : PrismaService
    ){}

    async create(request: failedImportedEmployee) : Promise<failedImportedEmployee> {
        return await this.prismaService.failed_exported_employees.create({
            data: {
                data: request.data,
                failed_reason : request.failed_reason
            }
        });
    }

    async get() : Promise<failedImportedEmployee[]> {
        return await this.prismaService.failed_exported_employees.findMany();
        
    }

    async deleteRecord() : Promise<{count: number}> {
        return await this.prismaService.failed_exported_employees.deleteMany();

    }

    
}

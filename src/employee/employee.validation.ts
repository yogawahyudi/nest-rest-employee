import { z, ZodType } from "zod";
export class employeeValidation {

    static readonly createEmployee : ZodType = z.object({
        full_name: z.string().min(1, "Full name is required").max(50),
        employee_number: z.string().min(1, "Employee number is required").max(100),
        position: z.string().min(1, "Position is required").max(100),
        department: z.string().min(1, "Department is required").max(100),
        hire_date: z.string(),
        photo: z.string(),
        status: z.enum(['kontrak', 'probation', 'tetap']),
    }).required()

    static readonly updateEmployee : ZodType = z.object({
        id: z.number(),
        full_name: z.string().min(1, "Full name is required").max(50),
        employee_number: z.string().min(1, "Employee number is required").max(100),
        position: z.string().min(1, "Position is required").max(100),
        department: z.string().min(1, "Department is required").max(100),
        hire_date: z.union([z.string(), z.date()]),
        photo: z.string(),
        status: z.enum(['kontrak', 'probation', 'tetap']),
    }).required()
}

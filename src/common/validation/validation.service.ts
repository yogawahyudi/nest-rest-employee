import { HttpException, Injectable } from '@nestjs/common';
import { ZodError, ZodType } from 'zod';

@Injectable()
export class ValidationService {
    
    validate<T>(zodType : ZodType <T>, data: T) : T {
        try {
            return zodType.parse(data)
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((err) => {
                    // Ambil pesan kesalahan dari setiap objek kesalahan
                    return `${err.path.join('.')} ${err.message}`;
                });
                throw new HttpException( errorMessages, 400);
            } else {
                // Tangani error lainnya
                throw error; // Lemparkan kembali kesalahan
            }            
        }
    }
}

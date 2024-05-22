export class apiResponse <T> {
    data ?: T;
    message: string;
    error : boolean;
}
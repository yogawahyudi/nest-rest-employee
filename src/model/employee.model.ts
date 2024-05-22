import { Status } from "@prisma/client"

export class employee {
  id ?: number
  full_name : string  
  employee_number : string
  position : string
  department : string
  hire_date : string | Date
  photo : string
  status : Status
}

export class updateEmployee extends employee {
  id: number
}

export class logs extends employee {
  error ?: string
}
// Enums para mapear con el Backend (Python IntEnum)
export enum Gender {
    FEMALE = 0,
    MALE = 1
}

export enum MaritalStatus {
    SINGLE = 0,
    MARRIED = 1,
    DIVORCED = 2
}

export enum Department {
    RESEARCH_DEVELOPMENT = 0,
    SALES = 1,
    HUMAN_RESOURCES = 2
}

export enum EducationLevel {
    BELOW_COLLEGE = 0,
    COLLEGE = 1,
    BACHELOR = 2,
    MASTER = 3,
    DOCTOR = 4
}

export enum EducationField {
    SCIENCES = 0,
    MEDICAL = 1,
    MARKETING = 2,
    TECHNICAL_DEGREE = 3,
    HUMAN_RESOURCES = 4,
    OTHER = 5
}

export enum JobLevel {
    ENTRY = 1,
    LOW = 2,
    MEDIUM = 3,
    HIGH = 4,
    TOP = 5
}

export enum JobRole {
    SALES_EXECUTIVE = 0,
    RESEARCH_SCIENTIST = 1,
    LABORATORY_TECHNICIAN = 2,
    MANUFACTURING_DIRECTOR = 3,
    HEALTHCARE_REPRESENTATIVE = 4,
    MANAGER = 5,
    SALES_REPRESENTATIVE = 6,
    RESEARCH_DIRECTOR = 7,
    HUMAN_RESOURCES = 8
}

// Interfaz del Empleado utilizando los Enums definidos arriba
export interface Employee {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    birth_date: string;
    gender: Gender;
    marital_status: MaritalStatus;
    home_address: string;
    phone: string;
    department: Department;
    education: EducationLevel;
    education_field: EducationField;
    job_level: JobLevel;
    job_role: JobRole;
    number_of_companies_worked: number;
    monthly_salary: number;
    percent_salary_hike: number;
    contract_start_date: string;
    current_role_start_date: string;
    last_promotion_date: string;
    last_manager_date: string;
    company_id: number;
    user_id?: number;
}
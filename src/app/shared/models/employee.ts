export interface Employee {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    birth_date: string;
    gender: number;
    marital_status: number;
    home_address: string;
    phone: string;
    department: number;
    education: number;
    education_field: number;
    job_level: number;
    job_role: number;
    number_of_companies_worked: number;
    monthly_salary: number;
    percent_salary_hike: number;
    company_id: number;
    user_id?: number;
}
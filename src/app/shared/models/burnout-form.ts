export interface BurnoutRequest {
    environment_satisfaction: number;
    overtime: number;
    job_involvement: number;
    performance_rating: number;
    job_satisfaction: number;
    work_life_balance: number; 
    business_travel: number;
    images?: string[];
    audio?: string | null;
}

export class BurnoutForm {
    id?: number;
    employee_id: number;
    written_feedback: string;
    environment_satisfaction: string;
    overtime: string;
    job_involvement: string;
    performance_rating: string;
    job_satisfaction: string;
    work_life_balance: string;
    business_travel: string;
    created_at: string;
    burnout_score: string;        
    final_burnout_score?: number;  
    image_score?: number;         
    text_score?: number;          
    form_score?: number;

    constructor(employeeId: number = 0) {
        this.employee_id = employeeId;
        this.written_feedback = '';
        this.environment_satisfaction = '';
        this.overtime = 'No';
        this.job_involvement = '';
        this.performance_rating = '';
        this.job_satisfaction = '';
        this.work_life_balance = '';
        this.business_travel = '';
        this.burnout_score = '';
        this.created_at = '';
    }
}
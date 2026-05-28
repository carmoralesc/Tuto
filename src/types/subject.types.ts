export interface Subject {
    id: string;
    code: string;
    name: string;
    credits: number;
    prerequisites: string[];
    isSpecial?: boolean;
    professor?: string;
    maxFailuresAllowed?: number;
}
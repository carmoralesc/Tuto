export type StudentStatus = 'MODIFIED' | 'PENDING' | 'NOT_SUBMITTED' | 'APPROVED';

export interface Student {
  id: string;
  name: string;
  firstLastName: string;
  secondLastName: string;
  semester: number;
  approvedSubjects: string[];
  failedSubjects: string[];
  repeatedSubjects: string[];
  specialSubjects: string[];
  proposedSubjects: string[];
  riskScore: number;
  status: StudentStatus;
}

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface FailureReason {
  subjectId: string;
  reason: string;
}

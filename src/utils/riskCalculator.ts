import { Student } from '../types/student';
import { Subject } from '../types/subject';
import { checkPrerequisites } from './subjectValidator';

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export const MAX_CREDITS = 36;
export const MIN_CREDITS = 20;
export const MAX_SPECIAL_SUBJECTS = 2;

const RISK_THRESHOLD_HIGH = 70;
const RISK_THRESHOLD_MEDIUM = 40;

const SCORE_SPECIAL_2_PLUS = 50;
const SCORE_SPECIAL_1 = 30;
const SCORE_REPEATED_3_PLUS = 25;
const SCORE_REPEATED_2 = 15;
const SCORE_OVER_MAX_CREDITS = 30;
const SCORE_UNDER_MIN_CREDITS = 20;
const SCORE_MISSING_PREREQ = 15;

export function calculateRiskScore(student: Student, allSubjects: Subject[]): number {
  let score = 0;

  // Special subjects
  if (student.specialSubjects.length >= MAX_SPECIAL_SUBJECTS) score += SCORE_SPECIAL_2_PLUS;
  else if (student.specialSubjects.length === 1) score += SCORE_SPECIAL_1;

  // Repeated subjects
  if (student.repeatedSubjects.length >= 3) score += SCORE_REPEATED_3_PLUS;
  else if (student.repeatedSubjects.length === 2) score += SCORE_REPEATED_2;

  // Credits
  const proposedSubjects = allSubjects.filter(s => student.proposedSubjects.includes(s.id));
  const totalCredits = proposedSubjects.reduce((sum, s) => sum + s.credits, 0);

  if (totalCredits > MAX_CREDITS) score += SCORE_OVER_MAX_CREDITS;
  else if (totalCredits < MIN_CREDITS) score += SCORE_UNDER_MIN_CREDITS;

  // Prerequisite violations
  for (const subjectId of student.proposedSubjects) {
    const valid = checkPrerequisites(subjectId, student.approvedSubjects, allSubjects);
    if (!valid) score += SCORE_MISSING_PREREQ;
  }

  return score;
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= RISK_THRESHOLD_HIGH) return 'HIGH';
  if (score >= RISK_THRESHOLD_MEDIUM) return 'MEDIUM';
  return 'LOW';
}

import { Student } from '../types/student';
import { Subject } from '../types/subject';
import { checkPrerequisites } from './subjectValidator';

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export function calculateRiskScore(student: Student, allSubjects: Subject[]): number {
  let score = 0;

  // Special subjects
  if (student.specialSubjects.length >= 2) score += 50;
  else if (student.specialSubjects.length === 1) score += 30;

  // Repeated subjects
  if (student.repeatedSubjects.length >= 3) score += 25;
  else if (student.repeatedSubjects.length === 2) score += 15;

  // Credits
  const proposedSubjects = allSubjects.filter(s => student.proposedSubjects.includes(s.id));
  const totalCredits = proposedSubjects.reduce((sum, s) => sum + s.credits, 0);

  if (totalCredits > 36) score += 30;
  else if (totalCredits < 20) score += 20;

  // Prerequisite violations
  for (const subjectId of student.proposedSubjects) {
    const valid = checkPrerequisites(subjectId, student.approvedSubjects, allSubjects);
    if (!valid) score += 15;
  }

  return score;
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}

import { useMemo } from 'react';
import { Student, StudentStatus } from '../../../types/student';
import { Subject } from '../../../types/subject';
import { getRiskLevel, RiskLevel } from '../../../utils/riskCalculator';

const STATUS_ORDER: Record<StudentStatus, number> = {
  MODIFIED: 0,
  PENDING: 1,
  NOT_SUBMITTED: 2,
  APPROVED: 3,
};

export interface TableRow {
  student: Student;
  totalCredits: number;
  specialCount: number;
  riskLevel: RiskLevel;
}

export function useTutorTable(students: Student[], subjects: Subject[]): TableRow[] {
  const tableData = useMemo(() => {
    return students
      .map(student => {
        const proposed = subjects.filter(s => student.proposedSubjects.includes(s.id));
        const totalCredits = proposed.reduce((sum, s) => sum + s.credits, 0);
        const specialCount = student.specialSubjects.filter(id => student.proposedSubjects.includes(id)).length;
        const riskLevel = getRiskLevel(student.riskScore);
        return { student, totalCredits, specialCount, riskLevel };
      })
      .sort((a, b) => {
        const statusDiff = STATUS_ORDER[a.student.status] - STATUS_ORDER[b.student.status];
        if (statusDiff !== 0) return statusDiff;
        const riskOrder: Record<RiskLevel, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        const riskDiff = riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
        if (riskDiff !== 0) return riskDiff;
        const creditDiff = b.totalCredits - a.totalCredits;
        if (creditDiff !== 0) return creditDiff;
        return a.student.firstLastName.localeCompare(b.student.firstLastName);
      });
  }, [students, subjects]);

  return tableData;
}

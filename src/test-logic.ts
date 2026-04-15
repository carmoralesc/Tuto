import { mockStudents } from '@/mocks/students.mocks';
import { mockSubjects } from '@/mocks/subjects.mocks';
import { detectViolations } from '@/lib/utils/validation.utils';
import { calculateRiskScore } from '@/lib/utils/risk.utils';

const student = mockStudents[0];
const selected = mockSubjects.filter(s => ['MAT101', 'FIS101', 'PROG101'].includes(s.code));

console.log(detectViolations(student, selected));
console.log('Riesgo:', calculateRiskScore(student, selected));
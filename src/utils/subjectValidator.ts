import { Subject } from '../types/subject';

export function checkPrerequisites(
  subjectId: string,
  approvedSubjects: string[],
  allSubjects: Subject[]
): boolean {
  const subject = allSubjects.find(s => s.id === subjectId);
  if (!subject) return false;
  return subject.prerequisites.every(prereqId => approvedSubjects.includes(prereqId));
}

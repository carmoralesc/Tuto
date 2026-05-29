import { ProposalsTable } from '@/features/tutor-dashboard/components/ProposalsTable';
import { mockProposals } from '@/mocks/proposals.mock';

export default function TutorDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Panel del Tutor</h1>
      <ProposalsTable proposals={mockProposals} />
    </div>
  );
}
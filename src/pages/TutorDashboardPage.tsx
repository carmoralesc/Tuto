import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProposalsTable } from '@/features/tutor-dashboard/components/ProposalsTable';
import { ProposalDetail } from '@/features/tutor-dashboard/components/ProposalDetail';
import { TutorSubjectEditor } from '@/features/tutor-dashboard/components/TutorSubjectEditor';
import { mockProposals } from '@/mocks/proposals.mock';
import type { AcademicLoadProposal } from '@/types/academic-load.types';

export default function TutorDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('propuesta');
  const [modifyingId, setModifyingId] = useState<string | null>(null);
  const [proposals, setProposals] = useState(mockProposals);
  const [proposalHistory, setProposalHistory] = useState<Record<string, AcademicLoadProposal[]>>({});

  const handleSelectProposal = (id: string) => {
    setModifyingId(null);
    setSearchParams({ propuesta: id });
  };

  const handleBack = () => {
    setModifyingId(null);
    setSearchParams({});
  };

  const handleModify = (id: string) => {
    setModifyingId(id);
  };

  const handleSave = (updatedProposal: AcademicLoadProposal) => {
    const original = proposals.find(p => p.id === updatedProposal.id);
    if (original && original.status !== 'reviewed') {
      setProposalHistory(prev => ({
        ...prev,
        [updatedProposal.id]: [...(prev[updatedProposal.id] || []), original],
      }));
    }
    setProposals(prev => prev.map(p => p.id === updatedProposal.id ? updatedProposal : p));
    setModifyingId(null);
    setSearchParams({ propuesta: updatedProposal.id });
  };

  const handleCancelModify = () => setModifyingId(null);

  const handleApprove = (id: string) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
  };

  if (modifyingId) {
    const proposal = proposals.find(p => p.id === modifyingId);
    if (!proposal) return <div>Propuesta no encontrada</div>;
    return <TutorSubjectEditor proposal={proposal} onSave={handleSave} onCancel={handleCancelModify} />;
  }

  if (selectedId) {
    const currentProposal = proposals.find(p => p.id === selectedId);
    const previousProposals = proposalHistory[selectedId] || [];
    const previousProposal = previousProposals.length > 0 ? previousProposals[previousProposals.length - 1] : undefined;

    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ProposalDetail
          proposalId={selectedId}
          proposal={currentProposal}
          previousProposal={previousProposal}
          onModify={handleModify}
          onApprove={handleApprove}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Panel del Tutor</h1>
      <ProposalsTable proposals={proposals} onSelectProposal={handleSelectProposal} />
    </div>
  );
}
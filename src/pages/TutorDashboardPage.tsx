import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProposalsTable } from '@/features/tutor-dashboard/components/ProposalsTable';
import { ProposalDetail } from '@/features/tutor-dashboard/components/ProposalDetail';
import { mockProposals } from '@/mocks/proposals.mock';

export default function TutorDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('propuesta');

  const handleSelectProposal = (id: string) => {
    setSearchParams({ propuesta: id });
  };

  const handleBack = () => {
    setSearchParams({});
  };

  if (selectedId) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la lista
          </button>
        </div>
        <ProposalDetail proposalId={selectedId} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Panel del Tutor</h1>
      <ProposalsTable proposals={mockProposals} onSelectProposal={handleSelectProposal} />
    </div>
  );
}
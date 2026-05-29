import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import type {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  FilterFn,
} from '@tanstack/react-table';
import type { AcademicLoadProposal } from '@/types/academic-load.types';
import { mockStudents } from '@/mocks/students.mock';
import { subjectsByCodeMap } from '@/data/subjects';
import { calculateRiskScore, getRiskCategory } from '@/lib/utils';
import { getNextAttemptLevel } from '@/lib/utils/subject-level.utils';

type ProposalWithStudent = AcademicLoadProposal & {
  studentName: string;
  studentLastName: string;
  totalCredits: number;
  especialCount: number;
  riskScore: number;
  riskCategory: 'low' | 'medium' | 'high';
};

const columnHelper = createColumnHelper<ProposalWithStudent>();

const riskCategoryFilter: FilterFn<ProposalWithStudent> = (row, columnId, filterValue) => {
  return row.getValue<string>(columnId) === filterValue;
};

interface ProposalsTableProps {
  proposals: AcademicLoadProposal[];
  onSelectProposal: (id: string) => void;
}

export function ProposalsTable({ proposals, onSelectProposal }: ProposalsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'riskScore', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    riskCategory: false,
  });

  const data = useMemo(() => {
    return proposals.map((proposal) => {
      const student = mockStudents.find(s => s.id === proposal.studentId);
      const selectedSubjects = proposal.selectedSubjects
        .map((sel) => subjectsByCodeMap.get(sel.subjectCode))
        .filter((subject): subject is NonNullable<typeof subject> => subject != null);

      if (!student) {
        return {
          ...proposal,
          studentName: '',
          studentLastName: '',
          totalCredits: 0,
          especialCount: 0,
          riskScore: 0,
          riskCategory: 'low' as const,
        };
      }

      const totalCredits = selectedSubjects.reduce((sum, s) => sum + s.credits, 0);

      const especialCount = selectedSubjects.filter((subject) => {
        const attempts = student.academicHistory.filter((attempt) => attempt.subjectCode === subject.code);
        const nextLevel = getNextAttemptLevel(attempts);
        return nextLevel === 5 || nextLevel === 6;
      }).length;

      const riskScore = calculateRiskScore(student, selectedSubjects);
      const riskCategory = getRiskCategory(riskScore);

      return {
        ...proposal,
        studentName: student.firstName,
        studentLastName: student.lastName,
        totalCredits,
        especialCount,
        riskScore,
        riskCategory,
      };
    });
  }, [proposals]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('studentLastName', {
        header: 'Apellido',
        cell: (info) => info.getValue(),
        sortingFn: 'text',
      }),
      columnHelper.accessor('studentName', {
        header: 'Nombre',
        cell: (info) => info.getValue(),
        sortingFn: 'text',
      }),
      columnHelper.accessor('riskScore', {
        header: 'Riesgo',
        cell: (info) => {
          const score = info.getValue();
          const category = getRiskCategory(score);
          return (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${category === 'high'
                  ? 'bg-red-100 text-red-800'
                  : category === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}
            >
              {score}
            </span>
          );
        },
        sortingFn: 'basic',
      }),
      columnHelper.accessor('riskCategory', {
        header: 'Categoría',
        cell: (info) => {
          const value = info.getValue();
          const labelMap: Record<ProposalWithStudent['riskCategory'], string> = {
            low: 'Bajo',
            medium: 'Medio',
            high: 'Alto',
          };

          return (
            <span className={`text-xs font-medium ${value === 'high'
                ? 'text-red-600'
                : value === 'medium'
                  ? 'text-yellow-700'
                  : 'text-green-700'
              }`}>
              {labelMap[value]}
            </span>
          );
        },
        sortingFn: 'text',
        filterFn: riskCategoryFilter,
      }),
      columnHelper.accessor('totalCredits', {
        header: 'Créditos',
        cell: (info) => info.getValue(),
        sortingFn: 'basic',
      }),
      columnHelper.accessor('especialCount', {
        header: 'Especiales',
        cell: (info) => info.getValue(),
        sortingFn: 'basic',
      }),
      columnHelper.accessor('status', {
        header: 'Estado',
        cell: (info) => {
          const status = info.getValue();
          const statusMap: Record<string, string> = {
            draft: 'Borrador',
            submitted: 'Enviada',
            'under-review': 'En revisión',
            approved: 'Aprobada',
            rejected: 'Rechazada',
          };
          return (
            <span
              className={`text-xs font-medium ${status === 'submitted'
                  ? 'text-blue-600'
                  : status === 'approved'
                    ? 'text-green-600'
                    : status === 'rejected'
                      ? 'text-red-600'
                      : 'text-gray-600'
                }`}
            >
              {statusMap[status] || status}
            </span>
          );
        },
        sortingFn: 'text',
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setColumnFilters([{ id: 'riskCategory', value: 'high' }])}
          className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 hover:bg-red-200"
        >
          Alto riesgo
        </button>
        <button
          onClick={() => setColumnFilters([{ id: 'riskCategory', value: 'medium' }])}
          className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
        >
          Riesgo medio
        </button>
        <button
          onClick={() => setColumnFilters([{ id: 'riskCategory', value: 'low' }])}
          className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 hover:bg-green-200"
        >
          Riesgo bajo
        </button>
        <button
          onClick={() => setColumnFilters([{ id: 'status', value: 'submitted' }])}
          className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200"
        >
          Pendientes
        </button>
        <button
          onClick={() => setColumnFilters([{ id: 'status', value: 'draft' }])}
          className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          Borradores
        </button>
        <button
          onClick={() => setColumnFilters([])}
          className="px-3 py-1 text-sm rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted() as string] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={onSelectProposal ? () => onSelectProposal(row.original.id) : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
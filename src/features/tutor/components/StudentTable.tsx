import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { Student, StudentStatus } from '../../../types/student';
import { Subject } from '../../../types/subject';
import { RiskLevel } from '../../../utils/riskCalculator';
import { useTutorTable, TableRow } from '../hooks/useTutorTable';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

const STATUS_LABELS: Record<StudentStatus, string> = {
  MODIFIED: 'Modificado',
  PENDING: 'Pendiente',
  NOT_SUBMITTED: 'No enviado',
  APPROVED: 'Aprobado',
};

const STATUS_BADGE_VARIANT: Record<StudentStatus, 'modified' | 'pending' | 'not_submitted' | 'approved'> = {
  MODIFIED: 'modified',
  PENDING: 'pending',
  NOT_SUBMITTED: 'not_submitted',
  APPROVED: 'approved',
};

const RISK_LABELS: Record<RiskLevel, string> = {
  HIGH: 'Alto',
  MEDIUM: 'Medio',
  LOW: 'Bajo',
};

const RISK_BADGE_VARIANT: Record<RiskLevel, 'high' | 'medium' | 'low'> = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

interface StudentTableProps {
  students: Student[];
  subjects: Subject[];
  onViewDetails: (student: Student) => void;
  onApprove: (studentId: string) => void;
  onViewAlerts: (student: Student) => void;
  onViewFailureReasons: (student: Student) => void;
}

const columnHelper = createColumnHelper<TableRow>();

const StudentTable = React.memo<StudentTableProps>(({
  students,
  subjects,
  onViewDetails,
  onApprove,
  onViewAlerts,
  onViewFailureReasons,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const tableData = useTutorTable(students, subjects);

  const columns = [
    columnHelper.accessor('riskLevel', {
      header: 'Riesgo',
      cell: info => (
        <Badge variant={RISK_BADGE_VARIANT[info.getValue()]}>
          {RISK_LABELS[info.getValue()]}
        </Badge>
      ),
    }),
    columnHelper.accessor(row => `${row.student.firstLastName} ${row.student.secondLastName}, ${row.student.name}`, {
      id: 'nombre',
      header: 'Nombre del Alumno',
      enableSorting: true,
    }),
    columnHelper.accessor('totalCredits', {
      header: 'Créditos',
      cell: info => <span className="font-mono">{info.getValue()}</span>,
    }),
    columnHelper.accessor('specialCount', {
      header: 'Mat. Especiales',
      cell: info => <span className="font-mono">{info.getValue()}</span>,
    }),
    columnHelper.accessor(row => row.student.status, {
      id: 'estado',
      header: 'Estado',
      cell: info => (
        <Badge variant={STATUS_BADGE_VARIANT[info.getValue()]}>
          {STATUS_LABELS[info.getValue()]}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: info => {
        const { student } = info.row.original;
        const canApprove = student.status === 'PENDING' || student.status === 'MODIFIED';
        return (
          <div className="flex flex-wrap gap-1">
            <Button size="sm" variant="secondary" onClick={() => onViewDetails(student)}>
              Ver
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => onApprove(student.id)}
              disabled={!canApprove}
            >
              Aprobar
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onViewAlerts(student)}>
              Alertas
            </Button>
            {student.failedSubjects.length > 0 && (
              <Button size="sm" variant="secondary" onClick={() => onViewFailureReasons(student)}>
                Razones
              </Button>
            )}
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() && (
                      <span>{header.column.getIsSorted() === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-100">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-3 text-gray-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {tableData.length === 0 && (
        <div className="text-center py-8 text-gray-500">No hay estudiantes registrados.</div>
      )}
    </div>
  );
});

StudentTable.displayName = 'StudentTable';
export default StudentTable;

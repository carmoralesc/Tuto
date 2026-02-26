import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { useEstudiantes } from '../../store/useEstudiantes';
import { useMaterias } from '../../store/useMaterias';
import { calcularCreditos, COLORES_RIESGO } from '../../utils/calcularRiesgo';
import { IndicadorRiesgo } from '../common/IndicadorRiesgo';
import type { Estudiante, EstadoEstudiante } from '../../types';
import { ModalDetalle } from './ModalDetalle';

const ORDEN_ESTADOS: Record<EstadoEstudiante, number> = {
  MODIFICADO: 0,
  PENDIENTE: 1,
  NO_ENTREGADO: 2,
  APROBADO: 3,
};

const ETIQUETAS_ESTADO: Record<EstadoEstudiante, { label: string; clase: string }> = {
  MODIFICADO: { label: 'Modificado', clase: 'bg-orange-100 text-orange-700' },
  PENDIENTE: { label: 'Pendiente', clase: 'bg-yellow-100 text-yellow-700' },
  NO_ENTREGADO: { label: 'No Entregado', clase: 'bg-red-100 text-red-700' },
  APROBADO: { label: 'Aprobado', clase: 'bg-green-100 text-green-700' },
};

interface FilaTabla extends Estudiante {
  creditos: number;
  apellidos: string;
}

const columnHelper = createColumnHelper<FilaTabla>();

export const TablaTutor: React.FC = () => {
  const { estudiantes, actualizarEstado } = useEstudiantes();
  const { materias } = useMaterias();
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<FilaTabla | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const datos = useMemo<FilaTabla[]>(() => {
    return [...estudiantes]
      .map(e => ({
        ...e,
        creditos: calcularCreditos(e.materiasProguestas, materias),
        apellidos: `${e.primerApellido} ${e.segundoApellido}`,
      }))
      .sort((a, b) => {
        const diffEstado = ORDEN_ESTADOS[a.estado] - ORDEN_ESTADOS[b.estado];
        if (diffEstado !== 0) return diffEstado;
        const diffRiesgo = b.puntajeRiesgo - a.puntajeRiesgo;
        if (diffRiesgo !== 0) return diffRiesgo;
        const diffCreditos = b.creditos - a.creditos;
        if (diffCreditos !== 0) return diffCreditos;
        return a.apellidos.localeCompare(b.apellidos);
      });
  }, [estudiantes, materias]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('puntajeRiesgo', {
        header: 'Riesgo',
        cell: info => (
          <div className="flex items-center gap-2">
            <IndicadorRiesgo puntaje={info.getValue()} mostrarTexto />
            <span className="text-xs text-gray-400">({info.getValue()})</span>
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('apellidos', {
        header: 'Estudiante',
        cell: info => {
          const row = info.row.original;
          return (
            <div>
              <p className="font-medium text-gray-800">
                {row.primerApellido} {row.segundoApellido}
              </p>
              <p className="text-sm text-gray-500">{row.nombre}</p>
            </div>
          );
        },
        enableSorting: true,
      }),
      columnHelper.accessor('creditos', {
        header: 'Créditos',
        cell: info => (
          <span className="font-semibold text-blue-700">{info.getValue()}</span>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('materiasEspeciales', {
        header: 'Especiales',
        cell: info => (
          <span className={`font-medium ${info.getValue().length > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
            {info.getValue().length}
          </span>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor('estado', {
        header: 'Estado',
        cell: info => {
          const config = ETIQUETAS_ESTADO[info.getValue()];
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.clase}`}>
              {config.label}
            </span>
          );
        },
        enableSorting: true,
      }),
      columnHelper.display({
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEstudianteSeleccionado(row.original)}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Ver
            </button>
            {row.original.estado !== 'APROBADO' && (
              <button
                onClick={() => actualizarEstado(row.original.id, 'APROBADO')}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Aprobar
              </button>
            )}
          </div>
        ),
      }),
    ],
    [actualizarEstado]
  );

  const table = useReactTable({
    data: datos,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Panel de Tutorías</h2>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Total: {datos.length} estudiantes</span>
          <div className="flex items-center gap-2">
            {(['ALTO', 'MEDIO', 'BAJO'] as const).map(nivel => (
              <div key={nivel} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORES_RIESGO[nivel] }} />
                <span>{nivel === 'ALTO' ? 'Alto' : nivel === 'MEDIO' ? 'Medio' : 'Bajo'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className={`px-4 py-3 text-left text-sm font-semibold text-gray-600 ${
                        header.column.getCanSort() ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="text-gray-400">
                            {header.column.getIsSorted() === 'asc'
                              ? ' ↑'
                              : header.column.getIsSorted() === 'desc'
                              ? ' ↓'
                              : ' ↕'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-50">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {estudianteSeleccionado && (
        <ModalDetalle
          estudiante={estudianteSeleccionado}
          onCerrar={() => setEstudianteSeleccionado(null)}
        />
      )}
    </div>
  );
};

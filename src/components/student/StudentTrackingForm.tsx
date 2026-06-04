import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/useAuthStore';
import { useStudentTrackingStore } from '@/stores/useStudentTrackingStore';
import { useToast } from '@/features/student-wizard/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';
import type { StudentTrackingData } from '@/types/student-tracking.types';

// ─── Zod Schema (solo datos que llena el alumno) ──────────────
const trackingFormSchema = z.object({
    fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    promedioBachillerato: z
        .number({ error: 'Ingresa un número entre 0 y 10' })
        .min(0, 'Mínimo 0')
        .max(10, 'Máximo 10'),
    promedioExamenAdmision: z
        .number({ error: 'Ingresa un número entre 0 y 100' })
        .min(0, 'Mínimo 0')
        .max(100, 'Máximo 100'),
});

type TrackingFormValues = z.infer<typeof trackingFormSchema>;

// ─── Main Component ───────────────────────────────────────────
export function StudentTrackingForm() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { saveTrackingData, allTrackingData } = useStudentTrackingStore();
    const { toasts, addToast, removeToast } = useToast();

    if (!user || user.role !== 'student') {
        navigate('/login', { replace: true });
        return null;
    }

    const existingData = useMemo(
        () => allTrackingData.find((d) => d.studentId === user.username),
        [allTrackingData, user.username],
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TrackingFormValues>({
        resolver: zodResolver(trackingFormSchema),
        defaultValues: existingData
            ? {
                fullName: existingData.fullName,
                promedioBachillerato: existingData.promedioBachillerato,
                promedioExamenAdmision: existingData.promedioExamenAdmision,
            }
            : {
                fullName: user.name,
                promedioBachillerato: undefined as unknown as number,
                promedioExamenAdmision: undefined as unknown as number,
            },
        mode: 'onChange',
    });

    const onSubmit = useCallback(
        (data: TrackingFormValues) => {
            const base = existingData ?? {
                studentId: user.username,
                necesidades: { A: false, B: false, C: false, D: false, E: false, F: false, G: false, H: false, I: false, J: false },
                test1: 'A' as const,
                test2: 'A' as const,
                test3: 'N1' as const,
                test4: 'A' as const,
                test5: { organizacion: 0, tecnicasEstudio: 0, motivacion: 0, total: 0 },
                semestres: [],
            };

            const trackingData: StudentTrackingData = {
                ...base,
                studentId: user.username,
                fullName: data.fullName,
                promedioBachillerato: data.promedioBachillerato,
                promedioExamenAdmision: data.promedioExamenAdmision,
            };
            saveTrackingData(trackingData);
            addToast('Encuesta de seguimiento guardada exitosamente.', 'info');
        },
        [user.username, saveTrackingData, addToast, existingData],
    );

    return (
        <div className="max-w-xl mx-auto px-4 py-12">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Encuesta de Seguimiento Tutorial</h1>
                <p className="text-sm text-gray-600 mt-2">
                    Ingresa tus datos generales. Los tests y evaluaciones serán completados por tu tutor.
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                    <input type="text" {...register('fullName')} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                    {errors.fullName?.message ? <p className="text-sm text-red-600 mt-1">{String(errors.fullName.message)}</p> : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Promedio Bachillerato (P.B.)</label>
                    <input type="number" step="0.1" {...register('promedioBachillerato', { valueAsNumber: true })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                    {errors.promedioBachillerato?.message ? <p className="text-sm text-red-600 mt-1">{String(errors.promedioBachillerato.message)}</p> : null}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Promedio Examen Admisión (P.E.A.)</label>
                    <input type="number" step="0.1" {...register('promedioExamenAdmision', { valueAsNumber: true })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                    {errors.promedioExamenAdmision?.message ? <p className="text-sm text-red-600 mt-1">{String(errors.promedioExamenAdmision.message)}</p> : null}
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition">
                    {isSubmitting ? 'Guardando...' : 'Guardar encuesta'}
                </button>
            </form>
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}

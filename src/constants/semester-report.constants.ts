// Códigos de canalización según el formato oficial del Documento 5
export const CANALIZACION_CODES: Record<number, string> = {
    1: 'Asesoría académica',
    2: 'Servicio Médico',
    3: 'Servicio Psicopedagógico',
    4: 'Beca',
    5: 'Otros',
};

// Etiquetas para los seguimientos
export const SEGUIMIENTO_LABELS = ['1er Seg.', '2do Seg.', '3er Seg.'] as const;

// Períodos disponibles
export const PERIODOS_DISPONIBLES = ['2025A', '2025B', '2026A', '2026B'] as const;

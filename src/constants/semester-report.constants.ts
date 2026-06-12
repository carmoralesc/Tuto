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
export const PERIODOS_DISPONIBLES = ['Ene-Jun 2025', 'Ago-Dic 2025', 'Ene-Jun 2026', 'Ago-Dic 2026'] as const;

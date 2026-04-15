export interface Subject {
    id: string;
    code: string;           // Ej: "MAT101"
    name: string;           // Ej: "Cálculo Diferencial"
    credits: number;
    prerequisites: string[]; // Array de códigos de materias requeridas
    isSpecial: boolean;      // Materia especial (requiere autorización adicional)
    maxFailuresAllowed?: number; // Opcional: veces que se puede reprobar
}
import { z } from 'zod';

export const formSchema = z.object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    firstSurname: z.string().min(2, 'El primer apellido debe tener al menos 2 caracteres'),
    secondSurname: z.string().min(2, 'El segundo apellido debe tener al menos 2 caracteres'),
    studentId: z.string().regex(/\d{8}$/, 'Matrícula inválida (ej: 21001122)'),
    program: z.string().min(3, 'Selecciona un programa académico'),
});

export const personalDataSchema = formSchema.transform((data) => ({
    firstName: data.firstName,
    lastName: `${data.firstSurname} ${data.secondSurname}`.trim(),
    studentId: data.studentId,
    program: data.program,
}));

export type PersonalData = z.infer<typeof personalDataSchema>;
export type PersonalDataFormInput = z.infer<typeof formSchema>;
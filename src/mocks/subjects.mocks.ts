import type { Subject } from '@/types/subject.types';

export const mockSubjects: Subject[] = [
    {
        id: '1',
        code: 'MAT101',
        name: 'Cálculo Diferencial',
        credits: 5,
        prerequisites: [],
        isSpecial: false,
        professor: 'Dr. Juan Pérez',
    },
    {
        id: '2',
        code: 'MAT102',
        name: 'Cálculo Integral',
        credits: 5,
        prerequisites: ['MAT101'],
        isSpecial: false,
        professor: 'Dra. Ana Rodríguez',
    },
    {
        id: '3',
        code: 'FIS101',
        name: 'Física General I',
        credits: 4,
        prerequisites: [],
        isSpecial: false,
        professor: 'Dr. Carlos Gómez',
    },
    {
        id: '4',
        code: 'PROG101',
        name: 'Programación I',
        credits: 6,
        prerequisites: [],
        isSpecial: false,
        professor: 'Mtra. Sofía Ramírez',
    },
    {
        id: '5',
        code: 'QUI101',
        name: 'Química Básica',
        credits: 4,
        prerequisites: [],
        isSpecial: true,
        professor: 'Dr. Miguel Ortega',
    },
];
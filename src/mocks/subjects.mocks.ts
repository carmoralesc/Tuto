import type { Subject } from '@/types/subject.types';

export const mockSubjects: Subject[] = [
    {
        id: '1',
        code: 'MAT101',
        name: 'Cálculo Diferencial',
        credits: 5,
        prerequisites: [],
        isSpecial: false,
    },
    {
        id: '2',
        code: 'MAT102',
        name: 'Cálculo Integral',
        credits: 5,
        prerequisites: ['MAT101'],
        isSpecial: false,
    },
    {
        id: '3',
        code: 'FIS101',
        name: 'Física General I',
        credits: 4,
        prerequisites: [],
        isSpecial: false,
    },
    {
        id: '4',
        code: 'PROG101',
        name: 'Fundamentos de Programación',
        credits: 4,
        prerequisites: [],
        isSpecial: false,
    },
    {
        id: '5',
        code: 'PROG102',
        name: 'Estructuras de Datos',
        credits: 5,
        prerequisites: ['PROG101'],
        isSpecial: false,
    },
    {
        id: '6',
        code: 'MAT201',
        name: 'Ecuaciones Diferenciales',
        credits: 5,
        prerequisites: ['MAT102'],
        isSpecial: false,
    },
    {
        id: '7',
        code: 'ESP301',
        name: 'Seminario de Investigación',
        credits: 2,
        prerequisites: [],
        isSpecial: true,       // Materia especial
    },
];
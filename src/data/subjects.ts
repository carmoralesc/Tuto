import type { Subject } from '@/types/subject.types';

export const subjectsArray: Subject[] = [
    // Semestre 1
    { id: "calculo_diferencial", code: "ACF-0901", name: "Cálculo Diferencial", credits: 5, prerequisites: [] },
    { id: "fund_programacion", code: "AED-1128", name: "Fundamentos de Programación", credits: 5, prerequisites: [] },
    { id: "taller_etica", code: "ACA-0907", name: "Taller de Ética", credits: 4, prerequisites: [] },
    { id: "matematicas_discretas", code: "AEF-1041", name: "Matemáticas Discretas", credits: 5, prerequisites: [] },
    { id: "taller_administracion", code: "SCH-1024", name: "Taller de Administración", credits: 4, prerequisites: [] },
    { id: "fund_investigacion", code: "ACC-0906", name: "Fundamentos de Investigación", credits: 4, prerequisites: [] },
    // Semestre 2
    { id: "calculo_integral", code: "ACF-0902", name: "Cálculo Integral", credits: 5, prerequisites: ["calculo_diferencial"] },
    { id: "poo", code: "AED-1286", name: "Programación Orientada a Objetos", credits: 5, prerequisites: ["fund_programacion"] },
    { id: "contabilidad", code: "AEC-1008", name: "Contabilidad Financiera", credits: 4, prerequisites: [] },
    { id: "quimica", code: "AEC-1058", name: "Química", credits: 4, prerequisites: [] },
    { id: "algebra_lineal", code: "ACF-0903", name: "Álgebra Lineal", credits: 5, prerequisites: [] },
    { id: "probabilidad", code: "AEF-1052", name: "Probabilidad y Estadística", credits: 5, prerequisites: [] },
    // Semestre 3
    { id: "calculo_vectorial", code: "ACF-0904", name: "Cálculo Vectorial", credits: 5, prerequisites: ["calculo_integral"] },
    { id: "estructura_datos", code: "AED-1026", name: "Estructura de Datos", credits: 5, prerequisites: ["poo"] },
    { id: "cultura_empresarial", code: "SCC-1005", name: "Cultura Empresarial", credits: 4, prerequisites: [] },
    { id: "investigacion_operaciones", code: "SCC-1013", name: "Investigación de Operaciones", credits: 4, prerequisites: [] },
    { id: "desarrollo_sustentable", code: "ACD-0908", name: "Desarrollo Sustentable", credits: 5, prerequisites: [] },
    { id: "fisica", code: "SCF-1006", name: "Física General", credits: 5, prerequisites: [] },
    // Semestre 4
    { id: "ecuaciones", code: "ACF-0905", name: "Ecuaciones Diferenciales", credits: 5, prerequisites: ["calculo_vectorial"] },
    { id: "metodos_numericos", code: "SCC-1017", name: "Métodos Numéricos", credits: 4, prerequisites: ["estructura_datos"] },
    { id: "topicos_prog", code: "SCD-1027", name: "Tópicos Avanzados de Programación", credits: 5, prerequisites: ["estructura_datos"] },
    { id: "fund_bd", code: "AEF-1031", name: "Fundamentos de Base de Datos", credits: 5, prerequisites: [] },
    { id: "simulacion", code: "SCD-1022", name: "Simulación", credits: 5, prerequisites: [] },
    { id: "principios_electricos", code: "SCD-1018", name: "Principios Eléctricos", credits: 5, prerequisites: [] },
    // Semestre 5
    { id: "graficacion", code: "SCC-1010", name: "Graficación", credits: 4, prerequisites: ["ecuaciones"] },
    { id: "telecom", code: "AEC-1034", name: "Fundamentos de Telecomunicaciones", credits: 4, prerequisites: [] },
    { id: "sistemas_operativos", code: "AEC-1061", name: "Sistemas Operativos", credits: 4, prerequisites: ["topicos_prog"] },
    { id: "taller_bd", code: "SCA-1025", name: "Taller de Base de Datos", credits: 4, prerequisites: ["fund_bd"] },
    { id: "fund_software", code: "SCC-1007", name: "Fundamentos de Ingeniería de Software", credits: 4, prerequisites: [] },
    { id: "arquitectura", code: "SCD-1003", name: "Arquitectura de Computadoras", credits: 5, prerequisites: [] },
    // Semestre 6
    { id: "automatas_1", code: "SCD-1015", name: "Lenguajes y Autómatas I", credits: 5, prerequisites: ["matematicas_discretas"] },
    { id: "redes", code: "SCD-1021", name: "Redes de Computadoras", credits: 5, prerequisites: ["telecom"] },
    { id: "admin_bd", code: "SCB-1001", name: "Administración de Base de Datos", credits: 5, prerequisites: ["taller_bd"] },
    { id: "programacion_web", code: "AEB-1055", name: "Programación Web", credits: 5, prerequisites: ["topicos_prog"] },
    { id: "ingenieria_software", code: "SCD-1011", name: "Ingeniería de Software", credits: 5, prerequisites: ["fund_software"] },
    { id: "lenguajes_interfaz", code: "SCC-1014", name: "Lenguajes de Interfaz", credits: 4, prerequisites: [] },
    // Semestre 7
    { id: "automatas_2", code: "SCD-1016", name: "Lenguajes y Autómatas II", credits: 5, prerequisites: ["automatas_1"] },
    { id: "conmutacion", code: "SCD-1004", name: "Conmutación y Enrutamiento", credits: 5, prerequisites: ["redes"] },
    { id: "logica_funcional", code: "SCC-1019", name: "Programación Lógica y Funcional", credits: 4, prerequisites: [] },
    { id: "aplicaciones_web", code: "AEB-1054", name: "Aplicaciones Web", credits: 5, prerequisites: ["programacion_web"] },
    { id: "arquitectura_web", code: "IWF-1803", name: "Arquitectura de Software Web", credits: 5, prerequisites: ["ingenieria_software"] },
    { id: "sistemas_programables", code: "SCC-1023", name: "Sistemas Programables", credits: 4, prerequisites: [] },
    // Ahora las del semestre 8
    { id: "admin_servicios", code: "IWB-1804", name: "Administración de Servicios Internet", credits: 5, prerequisites: ["aplicaciones_web"] },
    { id: "admin_redes", code: "SCA-1002", name: "Administración de Redes", credits: 4, prerequisites: ["conmutacion"] },
    { id: "ia", code: "SCC-1012", name: "Inteligencia Artificial", credits: 4, prerequisites: ["automatas_2"] },
    { id: "gestion_proyectos", code: "SCG-1009", name: "Gestión de Proyectos", credits: 6, prerequisites: ["ingenieria_software"] },
    { id: "movil", code: "IWB-1805", name: "Desarrollo Móvil", credits: 5, prerequisites: ["aplicaciones_web"] },
];

export const subjectsMap: Map<string, Subject> = new Map(
    subjectsArray.map(s => [s.id, s])
);

export const subjectsByCodeMap: Map<string, Subject> = new Map(
    subjectsArray.map((subject) => [subject.code, subject])
);

export function getSubjectByKey(key: string) {
    return subjectsMap.get(key) || subjectsByCodeMap.get(key) || null;
}
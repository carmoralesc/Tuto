import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'student' | 'tutor';

export interface User {
    id: string;
    username: string;
    name: string;
    role: UserRole;
    token: string; // simulado
}

export interface UserProfile {
    career: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    alternateEmail: string;
    tutorName: string;
    tutorPhone: string;
}

interface AuthState {
    user: User | null;
    profile: UserProfile | null;
    isAuthenticated: boolean;
    selectedRole: UserRole | null;
    setSelectedRole: (role: UserRole) => void;
    login: (username: string, password: string) => Promise<boolean>;
    updateProfile: (profile: UserProfile) => void;
    changePassword: (currentPassword: string, newPassword: string) => { success: boolean; message: string };
    logout: () => void;
}

// Credenciales mock para simulación
const MOCK_USERS: Record<string, { password: string; user: User }> = {
    'A00123456': {
        password: '123456',
        user: {
            id: 's1',
            username: 'A00123456',
            name: 'María González López',
            role: 'student',
            token: 'mock-token-student',
        },
    },
    'A00123457': {
        password: '123456',
        user: {
            id: 's2',
            username: 'A00123457',
            name: 'Luis Ángel Hernández García',
            role: 'student',
            token: 'mock-token-student',
        },
    },
    'admin': {
        password: 'admin123',
        user: {
            id: 't1',
            username: 'admin',
            name: 'Dr. Tutor Principal',
            role: 'tutor',
            token: 'mock-token-tutor',
        },
    },
    'tutor1': {
        password: 'tutor123',
        user: {
            id: 't2',
            username: 'tutor1',
            name: 'Mtra. Laura Sánchez',
            role: 'tutor',
            token: 'mock-token-tutor',
        },
    },
};

const MOCK_PROFILES: Record<string, UserProfile> = {
    A00123456: {
        career: 'Ingeniería en Sistemas Computacionales',
        address: 'Calle Reforma 123, Col. Centro',
        city: 'Orizaba, Veracruz',
        state: 'Veracruz',
        phone: '2721234567',
        alternateEmail: 'maria.gonzalez.alt@example.com',
        tutorName: 'Dr. Tutor Principal',
        tutorPhone: '2727654321',
    },
    A00123457: {
        career: 'Ingeniería en Sistemas Computacionales',
        address: 'Av. Cri-Cri 45, Col. El Espinal',
        city: 'Orizaba, Veracruz',
        state: 'Veracruz',
        phone: '2722345678',
        alternateEmail: 'luis.hernandez.alt@example.com',
        tutorName: 'Mtra. Laura Sánchez',
        tutorPhone: '2726543210',
    },
    admin: {
        career: 'Coordinación Académica',
        address: 'Edificio Administrativo, Planta Alta',
        city: 'Orizaba, Veracruz',
        state: 'Veracruz',
        phone: '2721112233',
        alternateEmail: 'admin.alt@example.com',
        tutorName: 'N/A',
        tutorPhone: 'N/A',
    },
    tutor1: {
        career: 'Tutoría Académica',
        address: 'Edificio de Tutorías, Cubículo 4',
        city: 'Orizaba, Veracruz',
        state: 'Veracruz',
        phone: '2722223344',
        alternateEmail: 'laura.sanchez.alt@example.com',
        tutorName: 'N/A',
        tutorPhone: 'N/A',
    },
};

function getDefaultProfile(username: string): UserProfile {
    return (
        MOCK_PROFILES[username] ?? {
            career: '',
            address: '',
            city: '',
            state: '',
            phone: '',
            alternateEmail: '',
            tutorName: '',
            tutorPhone: '',
        }
    );
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            profile: null,
            isAuthenticated: false,
            selectedRole: null,
            setSelectedRole: (role) => set({ selectedRole: role }),
            login: async (username: string, password: string) => {
                const mockUser = MOCK_USERS[username];
                if (mockUser && mockUser.password === password) {
                    if (mockUser.user.role === get().selectedRole) {
                        set({
                            user: mockUser.user,
                            profile: getDefaultProfile(mockUser.user.username),
                            isAuthenticated: true,
                        });
                        return true;
                    } else {
                        return false; // rol no coincide
                    }
                }
                return false;
            },
            updateProfile: (profile) => {
                const currentUser = get().user;
                if (!currentUser) return;

                MOCK_PROFILES[currentUser.username] = profile;
                set({ profile });
            },
            changePassword: (currentPassword: string, newPassword: string) => {
                const currentUser = get().user;
                if (!currentUser) {
                    return { success: false, message: 'No hay sesión activa.' };
                }

                const account = MOCK_USERS[currentUser.username];
                if (!account) {
                    return { success: false, message: 'No se encontró la cuenta de usuario.' };
                }

                if (account.password !== currentPassword) {
                    return { success: false, message: 'La contraseña actual es incorrecta.' };
                }

                account.password = newPassword;
                return { success: true, message: 'Contraseña actualizada correctamente.' };
            },
            logout: () => set({ user: null, profile: null, isAuthenticated: false, selectedRole: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, profile: state.profile, isAuthenticated: state.isAuthenticated }),
        }
    )
);
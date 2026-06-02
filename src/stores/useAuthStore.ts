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

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    selectedRole: UserRole | null;
    setSelectedRole: (role: UserRole) => void;
    login: (username: string, password: string) => Promise<boolean>;
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

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            selectedRole: null,
            setSelectedRole: (role) => set({ selectedRole: role }),
            login: async (username: string, password: string) => {
                const mockUser = MOCK_USERS[username];
                if (mockUser && mockUser.password === password) {
                    if (mockUser.user.role === get().selectedRole) {
                        set({ user: mockUser.user, isAuthenticated: true });
                        return true;
                    } else {
                        return false; // rol no coincide
                    }
                }
                return false;
            },
            logout: () => set({ user: null, isAuthenticated: false, selectedRole: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
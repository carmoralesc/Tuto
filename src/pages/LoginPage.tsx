import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore, type UserRole } from "@/stores/useAuthStore";

const loginSchema = z.object({
    username: z.string().min(1, "Ingresa tu número de control o usuario"),
    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { selectedRole, setSelectedRole, login, isAuthenticated } = useAuthStore();
    const [error, setError] = useState<string | null>(null);
    const [showRecovery, setShowRecovery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
    });

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setError(null);
    };

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError(null);
        const success = await login(data.username, data.password);
        setIsLoading(false);
        if (success) {
            const role = useAuthStore.getState().user?.role;
            if (role === 'student') navigate('/wizard/paso-1');
            else if (role === 'tutor') navigate('/dashboard');
        } else {
            setError('Credenciales inválidas o rol incorrecto.');
        }
    };

    const roleTitle = selectedRole === "student" ? "Estudiante" : "Tutor";
    const roleDescription =
        selectedRole === "student"
            ? "Accede a tu perfil académico"
            : "Revisa y aprueba propuestas";

    // Si ya está autenticado, redirigir
    if (isAuthenticated) {
        const role = useAuthStore.getState().user?.role;
        if (role === "student") navigate("/wizard/paso-1");
        else if (role === "tutor") navigate("/dashboard");
        return null;
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="absolute inset-0 opacity-35">
                <svg className="h-full w-full" aria-hidden="true">
                    <defs>
                        <pattern
                            id="login-dots"
                            width="28"
                            height="28"
                            patternUnits="userSpaceOnUse"
                        >
                            <circle cx="2" cy="2" r="1.2" fill="#c7d2fe" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#login-dots)" />
                </svg>
            </div>

            <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                    <section className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-4 rounded-3xl bg-white/70 px-5 py-4 shadow-sm ring-1 ring-white/70 backdrop-blur">
                            <div className="flex h-20 items-center justify-center rounded-2xl text-gray-500 overflow-hidden">
                                <img src="/tecnm.webp" alt="Logo institucional" className="h-12 w-12 object-contain" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#0b57a4] leading-tight">
                                    Tecnológico Nacional
                                </p>
                                <p className="text-xs font-medium text-gray-600 -mt-0.5">de México <b>Campus Orizaba</b></p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-700">
                                    Tecnológico Nacional de México
                                </p>
                                <h1 className="text-5xl font-black tracking-tight text-gray-950 sm:text-6xl">
                                    TutorTec
                                </h1>
                            </div>
                            <p className="max-w-2xl text-lg leading-8 text-gray-600">
                                Sistema de Gestión de Tutorías del Tecnológico Nacional de México
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => handleRoleSelect("student")}
                                className={`group flex h-full min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl border-2 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl ${selectedRole === "student"
                                    ? "border-blue-400 shadow-lg shadow-blue-200/60"
                                    : "border-gray-200"
                                    }`}
                            >
                                <div className="text-gray-600 transition-colors duration-300 group-hover:text-blue-600">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-base font-semibold text-gray-800">Estudiante</p>
                                    <p className="text-sm text-gray-500">Accede a tu perfil académico</p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleRoleSelect("tutor")}
                                className={`group flex h-full min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl border-2 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl ${selectedRole === "tutor"
                                    ? "border-blue-400 shadow-lg shadow-blue-200/60"
                                    : "border-gray-200"
                                    }`}
                            >
                                <div className="text-gray-600 transition-colors duration-300 group-hover:text-blue-600">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-base font-semibold text-gray-800">Tutor</p>
                                    <p className="text-sm text-gray-500">Revisa y aprueba propuestas</p>
                                </div>
                            </button>
                        </div>
                    </section>

                    <section className="w-full max-w-md justify-self-center lg:justify-self-end">
                        {selectedRole ? (
                            <div className="animate-fadeIn space-y-4 rounded-2xl bg-white/95 p-8 shadow-2xl ring-1 ring-black/5 backdrop-blur">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
                                            Acceso seguro
                                        </p>
                                        <h2 className="mt-2 text-2xl font-bold text-gray-900">
                                            Iniciar sesión como {roleTitle}
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-500">{roleDescription}</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setSelectedRole(null as never)}
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M12.78 15.53a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 111.06 1.06L9.06 10l3.72 3.72a.75.75 0 010 1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Cambiar rol
                                </button>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {selectedRole === "student" ? "Número de control" : "Usuario"}
                                        </label>
                                        <div className="relative">
                                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                            </span>
                                            <input
                                                type="text"
                                                {...register("username")}
                                                className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                placeholder={selectedRole === "student" ? "A00123456" : "admin"}
                                            />
                                        </div>
                                        {errors.username && (
                                            <p className="text-sm text-red-600">{errors.username.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Contraseña
                                        </label>
                                        <div className="relative">
                                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 11V8a4 4 0 10-8 0v3m-2 0h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z"
                                                    />
                                                </svg>
                                            </span>
                                            <input
                                                type="password"
                                                {...register("password")}
                                                className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                placeholder="••••••"
                                            />
                                        </div>
                                        {errors.password && (
                                            <p className="text-sm text-red-600">{errors.password.message}</p>
                                        )}
                                    </div>

                                    {error && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={!isValid || isLoading}
                                        className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
                                    >
                                        {isLoading ? "Ingresando..." : "Ingresar"}
                                    </button>
                                </form>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowRecovery(true)}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-fadeIn rounded-2xl bg-white/90 p-8 shadow-2xl ring-1 ring-black/5 backdrop-blur">
                                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
                                    Selección de acceso
                                </p>
                                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                                    Elige tu perfil para continuar
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Selecciona si vas a entrar como estudiante o tutor para mostrarte la experiencia adecuada.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {showRecovery && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5">
                        <h3 className="text-lg font-bold text-gray-900">Recuperar contraseña</h3>
                        {selectedRole === "student" ? (
                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                Se enviará un enlace de recuperación a tu correo institucional (@tecnm.mx).
                            </p>
                        ) : (
                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                Por seguridad, contacta al administrador del sistema para restablecer tu contraseña.
                            </p>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowRecovery(false)}
                                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
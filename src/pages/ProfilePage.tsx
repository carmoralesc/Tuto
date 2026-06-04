import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useAuthStore, type UserProfile } from "@/stores/useAuthStore";

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

const emptyProfile: UserProfile = {
    career: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    alternateEmail: "",
    tutorName: "",
    tutorPhone: "",
};

export default function ProfilePage() {
    const { user, profile, updateProfile, changePassword } = useAuthStore();
    const isStudent = user?.role === "student";
    const isTutor = user?.role === "tutor";

    const [profileForm, setProfileForm] = useState<UserProfile>(profile ?? emptyProfile);
    const [profileMessage, setProfileMessage] = useState<string | null>(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [showPasswordConfirmModal, setShowPasswordConfirmModal] = useState(false);

    const [changeRequestMessage, setChangeRequestMessage] = useState<string | null>(null);

    const initials = useMemo(() => {
        if (!user?.name) return "U";
        return getInitials(user.name);
    }, [user?.name]);

    useEffect(() => {
        if (profile) {
            setProfileForm(profile);
        }
    }, [profile]);

    const handleProfileFieldChange =
        (field: keyof UserProfile) => (e: ChangeEvent<HTMLInputElement>) => {
            setProfileForm((prev) => ({ ...prev, [field]: e.target.value }));
            setProfileMessage(null);
            setChangeRequestMessage(null);
        };

    const handleSaveProfile = (e: FormEvent) => {
        e.preventDefault();

        updateProfile(profileForm);
        setProfileMessage("Datos de contacto actualizados correctamente.");
    };

    const handleRequestChanges = () => {
        setChangeRequestMessage(
            "Solicitud enviada: un administrador revisará los cambios en los datos no editables.",
        );
    };

    const handlePasswordSubmit = (e: FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);
        setPasswordError(null);

        if (currentPassword.trim().length === 0) {
            setPasswordError("Ingresa tu contraseña actual.");
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError("La nueva contraseña debe tener al menos 6 caracteres.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("La confirmación no coincide con la nueva contraseña.");
            return;
        }
        if (newPassword === currentPassword) {
            setPasswordError("La nueva contraseña debe ser diferente a la actual.");
            return;
        }

        setShowPasswordConfirmModal(true);
    };

    const confirmPasswordChange = () => {
        const result = changePassword(currentPassword, newPassword);
        setShowPasswordConfirmModal(false);

        if (!result.success) {
            setPasswordError(result.message);
            return;
        }

        setPasswordMessage(result.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <div className="mx-auto w-full max-w-4xl">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
                        {user?.name ? initials : <UserCircleIcon className="h-8 w-8" aria-hidden="true" />}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
                        <p className="text-sm text-gray-600">Consulta y actualiza tu información de contacto.</p>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {isStudent && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Carrera</label>
                            <input
                                type="text"
                                value={profileForm.career}
                                disabled
                                className="mt-1 block w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-700 shadow-sm"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                        <input
                            type="text"
                            value={user?.name ?? ""}
                            disabled
                            className="mt-1 block w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-700 shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Usuario</label>
                        <input
                            type="text"
                            value={user?.username ?? ""}
                            disabled
                            className="mt-1 block w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-700 shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ID interno</label>
                        <input
                            type="text"
                            value={user?.id ?? ""}
                            disabled
                            className="mt-1 block w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-700 shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rol</label>
                        <input
                            type="text"
                            value={user?.role ?? ""}
                            disabled
                            className="mt-1 block w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-700 capitalize shadow-sm"
                        />
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={handleRequestChanges}
                        className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Solicitar cambios en datos bloqueados
                    </button>
                </div>
                {changeRequestMessage && (
                    <p className="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                        {changeRequestMessage}
                    </p>
                )}

                <form onSubmit={handleSaveProfile} className="mt-8 space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <h2 className="text-base font-semibold text-gray-900">
                        {isStudent ? "Datos editables del alumno" : "Datos de contacto"}
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                            <input
                                type="text"
                                value={profileForm.city}
                                onChange={handleProfileFieldChange("city")}
                                className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Estado</label>
                            <input
                                type="text"
                                value={profileForm.state}
                                onChange={handleProfileFieldChange("state")}
                                className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Dirección</label>
                            <input
                                type="text"
                                value={profileForm.address}
                                onChange={handleProfileFieldChange("address")}
                                className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teléfono de contacto</label>
                            <input
                                type="tel"
                                value={profileForm.phone}
                                onChange={handleProfileFieldChange("phone")}
                                className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Correo alternativo</label>
                            <input
                                type="email"
                                value={profileForm.alternateEmail}
                                onChange={handleProfileFieldChange("alternateEmail")}
                                className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {isStudent && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre del tutor</label>
                                    <input
                                        type="text"
                                        value={profileForm.tutorName}
                                        onChange={handleProfileFieldChange("tutorName")}
                                        className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Teléfono del tutor</label>
                                    <input
                                        type="tel"
                                        value={profileForm.tutorPhone}
                                        onChange={handleProfileFieldChange("tutorPhone")}
                                        className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {profileMessage && (
                        <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                            {profileMessage}
                        </p>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                        >
                            Guardar datos
                        </button>
                    </div>
                </form>

                {user?.role === "student" && (
                    <section className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                        <h2 className="text-base font-semibold text-gray-900">Cambiar contraseña</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Ingresa tu contraseña actual y define una nueva para actualizarla.
                        </p>

                        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contraseña actual</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••"
                                    className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••"
                                    className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirmar nueva contraseña</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••"
                                    className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            {passwordError && (
                                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                    {passwordError}
                                </p>
                            )}

                            {passwordMessage && (
                                <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                                    {passwordMessage}
                                </p>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                                >
                                    Cambiar contraseña
                                </button>
                            </div>
                        </form>
                    </section>
                )}
            </section>

            {showPasswordConfirmModal &&
                createPortal(
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
                        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                            <h3 className="text-lg font-bold text-gray-900">¿Confirmar cambio de contraseña?</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Se actualizará tu contraseña y usarás la nueva en tu próximo inicio de sesión.
                            </p>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirmModal(false)}
                                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmPasswordChange}
                                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
                                >
                                    Confirmar cambio
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </div>
    );
}

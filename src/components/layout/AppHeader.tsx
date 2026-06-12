import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    AcademicCapIcon,
    ChevronDownIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/stores/useAuthStore";

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function AppHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
    const navLinkClass = (path: string) =>
        `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive(path)
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const homePath = user?.role === "tutor" ? "/dashboard" : "/inicio";

    const initials = useMemo(() => {
        if (!user?.name) return "U";
        return getInitials(user.name);
    }, [user?.name]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!menuRef.current) return;
            const target = event.target as Node;
            if (!menuRef.current.contains(target)) {
                setIsMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
                setShowLogoutModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const openProfile = () => {
        setIsMenuOpen(false);
        navigate("/perfil");
    };

    const requestLogout = () => {
        setIsMenuOpen(false);
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        setShowLogoutModal(false);
        navigate("/login", { replace: true });
    };

    return (
        <>
            <header className="bg-white shadow-sm">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
                    <div className="flex items-center gap-2">
                        <Link
                            to={homePath}
                            className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-gray-900 transition hover:bg-gray-100"
                        >
                            <AcademicCapIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                            <span className="text-lg font-bold tracking-tight sm:text-xl">TutorTec</span>
                        </Link>

                        {/* Navigation links */}
                        <nav className="hidden sm:flex items-center gap-1 ml-4">
                            {user?.role === "tutor" && (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className={navLinkClass('/dashboard')}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/tutor/seguimiento"
                                        className={navLinkClass('/tutor/seguimiento')}
                                    >
                                        Seguimiento
                                    </Link>
                                    <Link
                                        to="/tutor/reporte-semestral"
                                        className={navLinkClass('/tutor/reporte-semestral')}
                                    >
                                        Reporte
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>

                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
                            aria-expanded={isMenuOpen}
                            aria-haspopup="menu"
                        >
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                                {user?.name ? initials : <UserCircleIcon className="h-5 w-5" aria-hidden="true" />}
                            </span>
                            <span className="hidden max-w-40 truncate sm:inline">{user?.name ?? "Usuario"}</span>
                            <ChevronDownIcon
                                className={`h-4 w-4 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
                                aria-hidden="true"
                            />
                        </button>

                        <div
                            className={`absolute right-0 z-40 mt-2 w-52 origin-top-right rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg transition-all duration-150 ${isMenuOpen
                                ? "pointer-events-auto scale-100 opacity-100"
                                : "pointer-events-none scale-95 opacity-0"
                                }`}
                            role="menu"
                            aria-hidden={!isMenuOpen}
                        >
                            <button
                                type="button"
                                onClick={openProfile}
                                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                role="menuitem"
                            >
                                Ver perfil
                            </button>
                            <button
                                type="button"
                                onClick={requestLogout}
                                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                                role="menuitem"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {showLogoutModal &&
                createPortal(
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                            <h3 className="text-lg font-bold text-gray-900">¿Cerrar sesión?</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Tu sesión actual se cerrará y tendrás que volver a iniciar sesión para continuar.
                            </p>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowLogoutModal(false)}
                                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmLogout}
                                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { useToast } from "@/features/student-wizard/hooks/useToast";
import { useWizardStore } from "@/stores/useWizardStore";

interface ProtectedStepProps {
    stepNumber: number;
    children: ReactNode;
}

export function ProtectedStep({ stepNumber, children }: ProtectedStepProps) {
    const navigate = useNavigate();
    const { completedSteps } = useWizardStore();
    const { toasts, addToast, removeToast } = useToast();
    const handledRef = useRef(false);

    const isAllowed = stepNumber === 1 || completedSteps.includes(stepNumber - 1);

    const redirectStep = useMemo(() => {
        if (stepNumber === 1) return 1;
        if (completedSteps.length === 0) return 1;
        return Math.max(...completedSteps) + 1;
    }, [completedSteps, stepNumber]);

    useEffect(() => {
        if (isAllowed) {
            handledRef.current = false;
            return;
        }

        if (handledRef.current) return;
        handledRef.current = true;
        addToast("Completa los pasos anteriores antes de continuar.", "info", 2000);
        navigate(`/wizard/paso-${redirectStep}`, { replace: true });
    }, [isAllowed, addToast, navigate, redirectStep]);

    if (!isAllowed) {
        return <ToastContainer toasts={toasts} onRemove={removeToast} />;
    }

    return (
        <>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </>
    );
}

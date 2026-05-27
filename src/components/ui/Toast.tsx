import { useEffect, useState } from "react";

export type ToastType = "error" | "info";

export interface ToastData {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastProps {
  toast: ToastData;
  onRemove: (id: number) => void;
}

export function Toast({ toast, onRemove }: ToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const end = start + toast.duration;
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, end - now);
      setProgress((remaining / toast.duration) * 100);
      if (remaining <= 0) {
        clearInterval(interval);
        onRemove(toast.id);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [toast, onRemove]);

  const bg =
    toast.type === "error"
      ? "bg-red-50 border-red-200 text-red-800"
      : "bg-white border-blue-200 text-blue-800";
  const barColor = toast.type === "error" ? "bg-red-500" : "bg-blue-500";

  return (
    <div
      className={`rounded-md border px-4 py-3 shadow-lg ${bg} relative overflow-hidden`}
    >
      <p className="text-sm font-medium">{toast.message}</p>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200">
        <div
          className={`h-full ${barColor} transition-all duration-75`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

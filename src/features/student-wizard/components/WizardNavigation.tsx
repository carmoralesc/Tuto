type WizardNavigationProps = {
  onPrevious: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
  leftText?: string;
  nextLabel?: string;
  previousLabel?: string;
};

export function WizardNavigation({
  onPrevious,
  onNext,
  isNextDisabled,
  leftText = "Los cambios se guardan al avanzar.",
  nextLabel = "Siguiente",
  previousLabel = "Anterior",
}: WizardNavigationProps) {
  return (
    <div className="flex-shrink-0 mt-4 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-600">{leftText}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          {previousLabel}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
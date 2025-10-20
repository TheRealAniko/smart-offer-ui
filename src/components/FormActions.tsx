import { type FormActionsProps } from "../types/offerForm";

const FormActions = ({
    currentStep,
    isSaving,
    hasFormErrors,
    onPrevious,
    onNext,
    onSave,
}: FormActionsProps) => {
    return (
        <div className="flex justify-between mt-6">
            {currentStep > 1 && (
                <button
                    type="button"
                    onClick={onPrevious}
                    className="rounded bg-gray-300 hover:bg-gray-400 py-2 px-6 text-black">
                    Zurück
                </button>
            )}

            {currentStep < 4 && (
                <button
                    type="button"
                    onClick={onNext}
                    className="rounded bg-blue-600 hover:bg-blue-700 py-2 px-6 text-white">
                    Weiter
                </button>
            )}
            
            {currentStep === 4 && (
                <button
                    type="button"
                    onClick={onSave}
                    disabled={isSaving || hasFormErrors}
                    className="rounded bg-green-600 hover:bg-green-700 py-2 px-6 text-white disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isSaving ? "Speichert..." : "Speichern"}
                </button>
            )}
        </div>
    );
};

export default FormActions;

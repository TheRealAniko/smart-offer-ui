import { type StepNavigationProps } from "../types/offerForm";

const StepNavigation = ({ currentStep, onStepChange }: StepNavigationProps) => {
    const steps = [
        { id: 1, label: "Angebotsdaten" },
        { id: 2, label: "Kundendaten" },
        { id: 3, label: "Positionen" },
        { id: 4, label: "Review" },
    ];

    return (
        <div className="flex items-center justify-between mb-6 text-sm font-medium">
            {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isComplete = currentStep > step.id;

                return (
                    <div
                        key={step.label}
                        className={`flex-1 text-center border-b-4 pb-2 transition-all ${
                            isActive
                                ? "border-blue-600 text-blue-600"
                                : isComplete
                                ? "border-green-500 text-green-500"
                                : "border-gray-300 text-gray-400"
                        }`}>
                        {step.label}
                    </div>
                );
            })}
        </div>
    );
};

export default StepNavigation;

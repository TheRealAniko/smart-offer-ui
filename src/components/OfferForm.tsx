import { useState } from "react";
import ReviewStep from "./steps/ReviewSteps";
import OfferStep from "./steps/OfferStep";
import CustomerStep from "./steps/CustomerStep";
import PositionsStep from "./steps/PositionsStep";
import StepNavigation from "./StepNavigation";
import FormActions from "./FormActions";
import { useOfferForm } from "../hooks/useOfferForm";
import { useFormValidation } from "../hooks/useFormValidation";
import { type OfferFormProps, type Step } from "../types/offerForm";

const OfferForm = ({ initialData, onSaveComplete }: OfferFormProps) => {
    const [currentStep, setCurrentStep] = useState<Step>(1);

    // Custom hooks for state management and validation
    const {
        offer,
        newPosition,
        isSaving,
        editIndex,
        handleOfferChange,
        handleCustomerChange,
        handlePositionChange,
        handleEditClick,
        handleSavePosition,
        handleDeletePosition,
        handleCancelEdit,
        calculateTotal,
        saveOffer,
    } = useOfferForm({ initialData, onSaveComplete });

    const {
        formErrors,
        positionErrors,
        hasFormErrors,
        titleRef,
        customerNameRef,
        labelRef,
        getStepErrors,
        focusFirstErrorInStep,
        validatePosition,
        validateAllBeforeSave,
    } = useFormValidation(offer, newPosition);

    // Step navigation handlers
    const handlePrevious = () => {
        setCurrentStep((prev) => {
            if (prev === 4) return 3;
            if (prev === 3) return 2;
            if (prev === 2) return 1;
            return prev;
        });
    };

    const handleNext = () => {
        const stepErrors = getStepErrors(currentStep);
        if (Object.keys(stepErrors).length > 0) {
            focusFirstErrorInStep(stepErrors, currentStep);
            return;
        }
        setCurrentStep((prev) => {
            if (prev === 1) return 2;
            if (prev === 2) return 3;
            if (prev === 3) return 4;
            return prev;
        });
    };

    const handleSave = () => {
        if (!validateAllBeforeSave()) return;
        saveOffer();
        setCurrentStep(1);
    };

    // Enhanced position save with validation
    const handleSavePositionWithValidation = () => {
        if (!validatePosition()) return;
        handleSavePosition();
    };

    return (
        <>
            <StepNavigation 
                currentStep={currentStep} 
                onStepChange={setCurrentStep} 
            />

            <form className="space-y-4">
                {currentStep === 1 && (
                    <OfferStep
                        offer={offer}
                        onChange={handleOfferChange}
                        formErrors={formErrors}
                        titleRef={titleRef}
                    />
                )}

                {currentStep === 2 && (
                    <CustomerStep
                        customer={offer.customer}
                        onChange={handleCustomerChange}
                        formErrors={formErrors}
                        customerNameRef={customerNameRef}
                    />
                )}

                {currentStep === 3 && (
                    <PositionsStep
                        newPosition={newPosition}
                        positions={offer.positions}
                        onChange={handlePositionChange}
                        onSave={handleSavePositionWithValidation}
                        onCancelEdit={handleCancelEdit}
                        onEdit={handleEditClick}
                        onDelete={handleDeletePosition}
                        editIndex={editIndex}
                        positionErrors={positionErrors}
                        formErrors={formErrors}
                        labelRef={labelRef}
                        calculateTotal={calculateTotal}
                    />
                )}

                {currentStep === 4 && (
                    <ReviewStep
                        offer={offer}
                        total={calculateTotal()}
                        isSaving={isSaving}
                        onEditStep={(s) => setCurrentStep(s)}
                        onSave={handleSave}
                    />
                )}

                <FormActions
                    currentStep={currentStep}
                    isSaving={isSaving}
                    hasFormErrors={hasFormErrors}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onSave={handleSave}
                />
            </form>
        </>
    );
};

export default OfferForm;

import { useState, useEffect, useCallback, useRef } from "react";
import { type Position } from "smart-offer-types";
import { type OfferFormState, type FormErrors, type PositionErrors, type Step } from "../types/offerForm";

export const useFormValidation = (offer: OfferFormState, newPosition: Position) => {
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [positionErrors, setPositionErrors] = useState<PositionErrors>({});

    const titleRef = useRef<HTMLInputElement>(null);
    const customerNameRef = useRef<HTMLInputElement>(null);
    const labelRef = useRef<HTMLInputElement>(null);

    const hasFormErrors = Object.keys(formErrors).length > 0;

    const isFormFieldValid = useCallback(
        (field: keyof FormErrors): boolean => {
            switch (field) {
                case "title":
                    return offer.title.trim() !== "";
                case "customerName":
                    return offer.customer.name.trim() !== "";
                case "positions":
                    return offer.positions.length > 0;
                default:
                    return true;
            }
        },
        [offer]
    );

    const isPositionFieldValid = useCallback(
        (field: keyof PositionErrors): boolean => {
            switch (field) {
                case "label":
                    return newPosition.label.trim() !== "";
                case "quantity":
                    return newPosition.quantity > 0;
                case "unit":
                    return newPosition.unit.trim() !== "";
                case "unitPrice":
                    return (
                        !isNaN(newPosition.unitPrice) &&
                        newPosition.unitPrice >= 0
                    );
                default:
                    return true;
            }
        },
        [newPosition]
    );

    // Step-spezifische Fehler ermitteln
    const getStepErrors = useCallback((step: Step): FormErrors => {
        const errors: FormErrors = {};
        if (step === 1) {
            if (!offer.title.trim())
                errors.title = "Angebotstitel ist erforderlich.";
        }
        if (step === 2) {
            if (!offer.customer.name.trim())
                errors.customerName = "Kundenname ist erforderlich.";
        }
        if (step === 3) {
            if (offer.positions.length === 0)
                errors.positions = "Mindestens eine Position ist erforderlich.";
        }
        return errors;
    }, [offer]);

    // Fokus auf das erste fehlerhafte Feld im aktuellen Schritt setzen
    const focusFirstErrorInStep = useCallback((errors: FormErrors, step: Step) => {
        if (step === 1 && errors.title && titleRef.current) {
            titleRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            titleRef.current.focus();
        }
        if (step === 2 && errors.customerName && customerNameRef.current) {
            customerNameRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            customerNameRef.current.focus();
        }
        if (step === 3 && errors.positions && labelRef.current) {
            labelRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            labelRef.current.focus();
        }
    }, []);

    // Validierung der Positionen
    const validatePosition = useCallback((): boolean => {
        const errors: PositionErrors = {};
        if (!newPosition.label.trim()) {
            errors.label = "Bezeichnung ist erforderlich.";
        }
        if (!newPosition.quantity || newPosition.quantity <= 0) {
            errors.quantity = "Menge muss größer als 0 sein.";
        }
        if (!newPosition.unit) {
            errors.unit = "Einheit ist erforderlich.";
        }
        if (newPosition.unitPrice < 0 || isNaN(newPosition.unitPrice)) {
            errors.unitPrice = "Einzelpreis darf nicht negativ sein.";
        }
        
        setPositionErrors(errors);
        return Object.keys(errors).length === 0;
    }, [newPosition]);

    // Final-Validierung für Speichern
    const validateAllBeforeSave = useCallback((): boolean => {
        const errors: FormErrors = {};
        if (!offer.title.trim())
            errors.title = "Angebotstitel ist erforderlich.";
        if (!offer.customer.name.trim())
            errors.customerName = "Kundenname ist erforderlich.";
        if (offer.positions.length === 0)
            errors.positions = "Mindestens eine Position ist erforderlich.";

        setFormErrors(errors);

        // Fokus beim Final-Check
        if (errors.title && titleRef.current) {
            titleRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            titleRef.current.focus();
        } else if (errors.customerName && customerNameRef.current) {
            customerNameRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            customerNameRef.current.focus();
        } else if (errors.positions && labelRef.current) {
            labelRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            labelRef.current.focus();
        }
        return Object.keys(errors).length === 0;
    }, [offer]);

    // Auto-Validierung bei Änderungen
    useEffect(() => {
        let formHasChanged = false;
        let positionHasChanged = false;

        const newFormErrors = { ...formErrors };
        (Object.keys(formErrors) as (keyof FormErrors)[]).forEach((field) => {
            if (isFormFieldValid(field)) {
                delete newFormErrors[field];
                formHasChanged = true;
            }
        });
        if (formHasChanged) {
            setFormErrors(newFormErrors);
        }
        
        const newPositionErrors = { ...positionErrors };
        (Object.keys(positionErrors) as (keyof PositionErrors)[]).forEach(
            (field) => {
                if (isPositionFieldValid(field)) {
                    delete newPositionErrors[field];
                    positionHasChanged = true;
                }
            }
        );
        if (positionHasChanged) {
            setPositionErrors(newPositionErrors);
        }
    }, [
        offer,
        newPosition,
        formErrors,
        positionErrors,
        isFormFieldValid,
        isPositionFieldValid,
    ]);

    return {
        formErrors,
        setFormErrors,
        positionErrors,
        setPositionErrors,
        hasFormErrors,
        titleRef,
        customerNameRef,
        labelRef,
        getStepErrors,
        focusFirstErrorInStep,
        validatePosition,
        validateAllBeforeSave,
    };
};

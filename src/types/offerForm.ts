import { type Position, type Offer } from "smart-offer-types";

export type FormErrors = {
    title?: string;
    customerName?: string;
    positions?: string;
};

export type PositionErrors = {
    label?: string;
    quantity?: string;
    unit?: string;
    unitPrice?: string;
};

export type Step = 1 | 2 | 3 | 4;

// UI-spezifischer Zustand für das Formular (ohne Branded Types)
export type OfferFormState = {
    id: string;
    title: string;
    customer: {
        name: string;
        email: string; // normale Zeichenkette, kein Email-Type
        phone: string;
        address: string;
        contactPerson: string;
    };
    positions: Position[];
    createdAt: Date;
    totalPrice: number;
    taxRatePct?: number;
    footer?: string;
};

export type OfferFormProps = {
    initialData?: Offer | null; // Optional initial data for editing
    onSaveComplete?: () => void;
};

export type StepNavigationProps = {
    currentStep: Step;
    onStepChange: (step: Step) => void;
};

export type FormActionsProps = {
    currentStep: Step;
    isSaving: boolean;
    hasFormErrors: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onSave: () => void;
};

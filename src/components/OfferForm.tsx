import { type Position, type Customer, type Offer } from "smart-offer-types";
import { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import ReviewStep from "./steps/ReviewSteps";
import OfferStep from "./steps/OfferStep";
import CustomerStep from "./steps/CustomerStep";
import PositionsStep from "./steps/PositionsStep";
import { useNavigate } from "react-router";
import { useCompanyProfile } from "../company/useCompanyProfile";
import { getOfferDefaultsFromProfile } from "../company/companyProfileStore";

type FormErrors = {
    title?: string;
    customerName?: string;
    positions?: string;
};
type PositionErrors = {
    label?: string;
    quantity?: string;
    unit?: string;
    unitPrice?: string;
};
type Step = 1 | 2 | 3 | 4;

type Props = {
    initialData?: Offer | null; // Optional initial data for editing
    onSaveComplete?: () => void;
};

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

const OfferForm = ({ initialData, onSaveComplete }: Props) => {
    const navigate = useNavigate();
    const initialOffer: OfferFormState = {
        id: "temp-id",
        title: "",
        customer: {
            name: "",
            email: "",
            phone: "",
            address: "",
            contactPerson: "",
        },
        positions: [],
        createdAt: new Date(),
        totalPrice: 0, // 👈 wichtig
    };

    const [offer, setOffer] = useState<OfferFormState>(
        initialData
            ? {
                  ...initialData,
                  customer: {
                      name: initialData.customer.name ?? "",
                      email: initialData.customer.email ?? "",
                      phone: initialData.customer.phone ?? "",
                      address: initialData.customer.address ?? "",
                      contactPerson: initialData.customer.contactPerson ?? "",
                  },
                  positions: initialData.positions.map((p) => ({
                      ...p,
                      unitPrice: Number(p.unitPrice),
                      quantity: Number(p.quantity),
                  })),
                  totalPrice: initialData.totalPrice ?? 0,
              }
            : initialOffer
    );

    const initialPosition: Position = {
        label: "",
        quantity: 1,
        unit: "stück",
        unitPrice: 0,
        material: "",
        type: undefined,
        dimensions: {
            length: undefined,
            width: undefined,
            height: undefined,
        },
    };

    const [newPosition, setNewPosition] = useState<Position>(initialPosition);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [positionErrors, setPositionErrors] = useState<PositionErrors>({});
    const [isSaving, setIsSaving] = useState(false);
    const [currentStep, setCurrentStep] = useState<Step>(1);

    const { profile } = useCompanyProfile();

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

    // Step-spezifische Fehler ermitteln
    const getStepErrors = (step: Step): FormErrors => {
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
    };

    // Fokus auf das erste fehlerhafte Feld im aktuellen Schritt setzen
    const focusFirstErrorInStep = (errors: FormErrors, step: Step) => {
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
    };

    // Validierung der Positionen
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

    useEffect(() => {
        const { defaultTaxRatePct, defaultFooterTemplate } =
            getOfferDefaultsFromProfile(profile);

        // Nur übernehmen, wenn Feld noch leer ist
        setOffer((prev: OfferFormState) => ({
            ...prev,
            taxRatePct:
                prev.taxRatePct === 0 ? defaultTaxRatePct : prev.taxRatePct,
            footer:
                (prev.footer ?? "").trim() === ""
                    ? defaultFooterTemplate
                    : prev.footer,
        }));
    }, [profile]);

    const handleOfferChange = (field: keyof OfferFormState, value: string) => {
        setOffer((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCustomerChange = (field: keyof Customer, value: string) => {
        setOffer((prev) => ({
            ...prev,
            customer: {
                ...prev.customer,
                [field]: value,
            },
        }));
    };

    const handlePositionChange = <K extends keyof Position>(
        field: K,
        value: Position[K]
    ) => {
        setNewPosition((prev) => ({ ...prev, [field]: value }));
    };

    const [editIndex, setEditIndex] = useState<number | null>(null);

    const handleEditClick = (index: number) => {
        const positionToEdit = offer.positions[index];
        setNewPosition(positionToEdit);
        setEditIndex(index);
    };

    const handleSavePosition = () => {
        // Validierung der Position
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
        if (Object.keys(errors).length > 0) {
            setPositionErrors(errors);
            return;
        }

        if (!newPosition.label.trim()) return;

        if (editIndex !== null) {
            const updatedPositions = [...offer.positions];
            updatedPositions[editIndex] = newPosition;

            setOffer((prevOffer) => ({
                ...prevOffer,
                positions: updatedPositions,
            }));

            setEditIndex(null);
        } else {
            setOffer((prevOffer) => ({
                ...prevOffer,
                positions: [...prevOffer.positions, newPosition],
            }));
        }

        setNewPosition(initialPosition);
    };

    const calculateTotal = (): number => {
        return offer.positions.reduce((sum, pos) => {
            return sum + pos.unitPrice * pos.quantity;
        }, 0);
    };

    const handleDeletePostion = (indexToDelete: number) => {
        setOffer((prev) => ({
            ...prev,
            positions: prev.positions.filter(
                (_, index) => index !== indexToDelete
            ),
        }));
    };

    const handleCancelEdit = () => {
        setEditIndex(null);
        setNewPosition(initialPosition);
    };

    // Validierung der Eingaben
    // Umbenannt: Final-Validierung für Speichern
    const validateAllBeforeSave = (): boolean => {
        const errors: FormErrors = {};
        if (!offer.title.trim())
            errors.title = "Angebotstitel ist erforderlich.";
        if (!offer.customer.name.trim())
            errors.customerName = "Kundenname ist erforderlich.";
        if (offer.positions.length === 0)
            errors.positions = "Mindestens eine Position ist erforderlich.";

        setFormErrors(errors);

        // Fokus beim Final-Check (optional über bestehende Refs)
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
    };

    const saveOffer = () => {
        if (!validateAllBeforeSave()) return;
        setIsSaving(true);
        try {
            const storedOffers = localStorage.getItem("offers");
            const parsedOffers: Offer[] = storedOffers
                ? JSON.parse(storedOffers)
                : [];

            let updatedOffers: Offer[];
            if (parsedOffers.some((o) => o.id === offer.id)) {
                // Update
                updatedOffers = parsedOffers.map((o) =>
                    o.id === offer.id
                        ? ({
                              ...offer,
                              totalPrice: calculateTotal(),
                          } as unknown as Offer)
                        : o
                );
            } else {
                // Neues Angebot
                const newOffer = {
                    ...offer,
                    id: offer.id === "temp-id" ? uuidv4() : offer.id,
                    totalPrice: calculateTotal(),
                };
                updatedOffers = [...parsedOffers, newOffer as unknown as Offer];
            }

            localStorage.setItem("offers", JSON.stringify(updatedOffers));
            toast.success("Angebot erfolgreich gespeichert!");
            navigate("/");

            onSaveComplete?.(); // z.B. zurück zur Liste
            setOffer({ ...initialOffer, createdAt: new Date(), totalPrice: 0 });
            setFormErrors({});
            setCurrentStep(1);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-6 text-sm font-medium">
                {["Angebotsdaten", "Kundendaten", "Positionen", "Review"].map(
                    (label, index) => {
                        const step = index + 1;
                        const isActive = currentStep === step;
                        const isComplete = currentStep > step;

                        return (
                            <div
                                key={label}
                                className={`flex-1 text-center border-b-4 pb-2 transition-all ${
                                    isActive
                                        ? "border-blue-600 text-blue-600"
                                        : isComplete
                                        ? "border-green-500 text-green-500"
                                        : "border-gray-300 text-gray-400"
                                }`}>
                                {label}
                            </div>
                        );
                    }
                )}
            </div>

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
                        onSave={handleSavePosition}
                        onCancelEdit={handleCancelEdit}
                        onEdit={handleEditClick}
                        onDelete={handleDeletePostion}
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
                        onSave={() => {
                            if (!validateAllBeforeSave()) return;
                            saveOffer();
                            setCurrentStep(1);
                        }}
                    />
                )}

                <div className="flex justify-between mt-6">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentStep((prev) => {
                                    if (prev === 4) return 3;
                                    if (prev === 3) return 2;
                                    if (prev === 2) return 1;
                                    return prev;
                                })
                            }
                            className="rounded bg-gray-300 hover:bg-gray-400 py-2 px-6 text-black">
                            Zurück
                        </button>
                    )}

                    {currentStep < 4 && (
                        <button
                            type="button"
                            onClick={() => {
                                const stepErrors = getStepErrors(currentStep);
                                if (Object.keys(stepErrors).length > 0) {
                                    setFormErrors(stepErrors); // nur Step-Fehler setzen
                                    focusFirstErrorInStep(
                                        stepErrors,
                                        currentStep
                                    );
                                    return;
                                }
                                // Step ist gültig → Fehler leeren & nächsten Step aktivieren
                                setFormErrors({});
                                setCurrentStep((prev) => {
                                    if (prev === 1) return 2;
                                    if (prev === 2) return 3;
                                    if (prev === 3) return 4;
                                    return prev;
                                });
                            }}
                            className="rounded bg-blue-600 hover:bg-blue-700 py-2 px-6 text-white">
                            Weiter
                        </button>
                    )}
                    {currentStep === 4 && (
                        <button
                            type="button"
                            onClick={saveOffer}
                            disabled={isSaving || hasFormErrors}
                            className="rounded bg-green-600 hover:bg-green-700 py-2 px-6 text-white disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isSaving ? "Speichert..." : "Speichern"}
                        </button>
                    )}
                </div>
            </form>
        </>
    );
};

export default OfferForm;

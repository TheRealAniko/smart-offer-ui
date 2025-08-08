import { type Position, type Customer, type Offer } from "smart-offer-types";
import { useState, useRef, useEffect, useCallback } from "react";
import { SquarePen, Delete } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

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

const OfferForm = () => {
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

    const initialOffer: Offer = {
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
    };

    const [offer, setOffer] = useState<Offer>(initialOffer);
    const [newPosition, setNewPosition] = useState<Position>(initialPosition);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [positionErrors, setPositionErrors] = useState<PositionErrors>({});
    const [isSaving, setIsSaving] = useState(false);

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

    const handleOfferChange = (field: keyof Offer, value: string) => {
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

    const handlePositionChange = (field: keyof Position, value: string) => {
        setNewPosition((prev) => ({
            ...prev,
            [field]: value,
        }));
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
    const validateForm = (): boolean => {
        const errors: FormErrors = {};

        if (!offer.title.trim()) {
            errors.title = "Angebotstitel ist erforderlich.";
        }
        if (!offer.customer.name.trim()) {
            errors.customerName = "Kundenname ist erforderlich.";
        }
        if (offer.positions.length === 0) {
            errors.positions = "Mindestens eine Position ist erforderlich.";
        }
        setFormErrors(errors);

        // Fokus auf das erste fehlerhafte Feld setzen
        if (errors.title && titleRef.current) {
            titleRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            titleRef.current?.focus();
        } else if (errors.customerName && customerNameRef.current) {
            customerNameRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            customerNameRef.current?.focus();
        } else if (errors.positions && labelRef.current) {
            labelRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            labelRef.current?.focus();
        }
        return Object.keys(errors).length === 0;
    };

    const saveOffer = () => {
        // Validierung durchführen
        if (!validateForm()) return;

        setIsSaving(true);

        try {
            // Neue ID generieren
            const offerWithId = {
                ...offer,
                id: offer.id === "temp-id" ? uuidv4() : offer.id,
            };

            // Angebot aus localStorage laden (falls es existiert)
            const storedOffers = localStorage.getItem("offers");
            const parsedOffers: Offer[] = storedOffers
                ? JSON.parse(storedOffers)
                : [];

            // Aktuelles Angebot hinzufügen oder aktualisieren
            const updatedOffers = [...parsedOffers, offerWithId];

            // Angebote in localStorage speichern
            localStorage.setItem("offers", JSON.stringify(updatedOffers));

            //UI Feedback
            toast.success("Angebot erfolgreich gespeichert!");

            // Formular zurücksetzen
            setOffer({ ...initialOffer, createdAt: new Date() });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form className="space-y-4">
            <div className="flex flex-col">
                <label htmlFor="title" className="font-medium">
                    Angebotstitel
                </label>
                <input
                    ref={titleRef}
                    id="title"
                    type="text"
                    value={offer.title}
                    onChange={(e) => handleOfferChange("title", e.target.value)}
                    className={`p-2 rounded border ${
                        formErrors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Angebotstitel"
                />
                {formErrors.title && (
                    <p className="text-sm text-red-500 mt-1">
                        {formErrors.title}
                    </p>
                )}
            </div>

            <div className="flex flex-col">
                <label htmlFor="customerName" className="font-medium">
                    Kundenname
                </label>
                <input
                    ref={customerNameRef}
                    id="customerName"
                    type="text"
                    value={offer.customer.name}
                    onChange={(e) =>
                        handleCustomerChange("name", e.target.value)
                    }
                    className={`p-2 rounded border ${
                        formErrors.customerName
                            ? "border-red-500"
                            : "border-gray-300"
                    }`}
                    placeholder="Max Mustermann"
                />
                {formErrors.customerName && (
                    <p className="text-sm text-red-500 mt-1">
                        {formErrors.customerName}
                    </p>
                )}
            </div>

            <div className="flex flex-col">
                <label htmlFor="email" className="font-medium">
                    E-Mail
                </label>
                <input
                    id="email"
                    type="email"
                    value={offer.customer.email}
                    onChange={(e) =>
                        handleCustomerChange("email", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded"
                    placeholder="max@mustermann.com"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="phone" className="font-medium">
                    Telefon
                </label>
                <input
                    id="phone"
                    type="tel"
                    value={offer.customer.phone}
                    onChange={(e) =>
                        handleCustomerChange("phone", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded"
                    placeholder="+49 123 4567890"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="address" className="font-medium">
                    Adresse
                </label>
                <input
                    id="address"
                    type="text"
                    value={offer.customer.address}
                    onChange={(e) =>
                        handleCustomerChange("address", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Musterstraße 1, 12345 Musterstadt"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="contactPerson" className="font-medium">
                    Ansprechpartner
                </label>
                <input
                    id="contactPerson"
                    type="text"
                    value={offer.customer.contactPerson}
                    onChange={(e) =>
                        handleCustomerChange("contactPerson", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Max Mustermann"
                />
            </div>

            {/* Position hinzufügen */}
            <div className="border-t pt-4 mt-4 space-y-4">
                <h3 className="font-semibold text-lg mb-2">Neue Position</h3>
                {formErrors.positions && (
                    <p className="text-sm text-red-500 mb-2">
                        {formErrors.positions}
                    </p>
                )}
                <div className="flex flex-col ">
                    <label htmlFor="label" className="font-medium">
                        Bezeichnung
                    </label>
                    <input
                        ref={labelRef}
                        id="label"
                        type="text"
                        placeholder="Bezeichnung"
                        className={`p-2 rounded border ${
                            positionErrors.label
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        value={newPosition.label}
                        onChange={(e) =>
                            handlePositionChange("label", e.target.value)
                        }
                    />
                    {positionErrors.label && (
                        <p className="text-sm text-red-500 mt-1">
                            {positionErrors.label}
                        </p>
                    )}
                </div>

                <div className="flex flex-col ">
                    <label htmlFor="quantity" className="font-medium">
                        Menge
                    </label>
                    <input
                        id="quantity"
                        type="number"
                        min={1}
                        placeholder="Menge"
                        className={`p-2 rounded border ${
                            positionErrors.quantity
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        value={newPosition.quantity}
                        onChange={(e) =>
                            handlePositionChange("quantity", e.target.value)
                        }
                    />
                    {positionErrors.quantity && (
                        <p className="text-sm text-red-500 mt-1">
                            {positionErrors.quantity}
                        </p>
                    )}
                </div>

                <div className="flex flex-col ">
                    <label htmlFor="unit" className="font-medium">
                        Einheit
                    </label>
                    <select
                        id="unit"
                        className={`p-2 rounded border ${
                            positionErrors.unit
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        value={newPosition.unit}
                        onChange={(e) =>
                            handlePositionChange("unit", e.target.value)
                        }>
                        <option value="stück">Stück</option>
                        <option value="stunde">Stunde</option>
                        <option value="meter">Meter</option>
                    </select>
                    {positionErrors.unit && (
                        <p className="text-sm text-red-500 mt-1">
                            {positionErrors.unit}
                        </p>
                    )}
                </div>

                <div className="flex flex-col ">
                    <label htmlFor="unitPrice" className="font-medium">
                        Einzelpreis
                    </label>
                    <input
                        id="unitPrice"
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="Einzelpreis"
                        className={`p-2 rounded border ${
                            positionErrors.unitPrice
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        value={newPosition.unitPrice}
                        onChange={(e) =>
                            handlePositionChange("unitPrice", e.target.value)
                        }
                    />
                    {positionErrors.unitPrice && (
                        <p className="text-sm text-red-500 mt-1">
                            {positionErrors.unitPrice}
                        </p>
                    )}
                </div>

                {/* optional: Material */}
                <div className="flex flex-col ">
                    <label htmlFor="material" className="font-medium">
                        Material (optional)
                    </label>
                    <input
                        id="material"
                        type="text"
                        placeholder="Material (optional)"
                        className="border border-gray-300 p-2 rounded"
                        value={newPosition.material || ""}
                        onChange={(e) =>
                            handlePositionChange("material", e.target.value)
                        }
                    />
                </div>

                {/* optional: Typ */}
                <div className="flex flex-col ">
                    <label htmlFor="type" className="font-medium">
                        Typ (optional)
                    </label>
                    <select
                        id="type"
                        className="border border-gray-300 p-2 rounded"
                        value={newPosition.type || ""}
                        onChange={(e) =>
                            handlePositionChange(
                                "type",
                                e.target.value as "product" | "service"
                            )
                        }>
                        <option value="">Typ wählen</option>
                        <option value="product">Produkt</option>
                        <option value="service">Service</option>
                    </select>
                </div>

                {/* optional: Maße */}
                <div className="flex flex-col ">
                    <label htmlFor="width" className="font-medium">
                        Maße (optional)
                    </label>
                    <input
                        id="width"
                        type="number"
                        placeholder="Länge (optional)"
                        className="border border-gray-300 p-2 rounded"
                        value={newPosition.dimensions?.length || ""}
                        onChange={(e) =>
                            setNewPosition((prev) => ({
                                ...prev,
                                dimensions: {
                                    ...prev.dimensions,
                                    length: parseFloat(e.target.value),
                                },
                            }))
                        }
                    />
                </div>
                <div className="flex gap-8">
                    <button
                        type="button"
                        onClick={handleSavePosition}
                        className="mt-4 w-full rounded bg-blue-600 hover:bg-blue-700 py-2 px-6 text-white sm:w-auto ">
                        {editIndex !== null
                            ? "Position speichern"
                            : "Position hinzufügen"}
                    </button>
                    {editIndex !== null && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="mt-4 flex items-center border border-gray-500 py-2 px-6 text-gray-500 hover:text-gray-700">
                            Bearbeitung abbrechen
                        </button>
                    )}
                </div>

                <div className="mt-6">
                    <h3 className="mb-2 text-lg font-semibold">Positionen</h3>
                    <ul className="space-y-2">
                        {offer.positions.map((pos, index) => (
                            <li
                                key={index}
                                className="flex justify-between rounded border px-4 py-2 text-sm shadow-sm">
                                <span>
                                    {pos.quantity} {pos.unit} {pos.label}
                                </span>
                                <span>
                                    {(pos.unitPrice * pos.quantity).toFixed(2)}€
                                </span>

                                <button
                                    type="button"
                                    onClick={() => handleEditClick(index)}
                                    className="text-blue-600 hover:text-blue-800">
                                    <SquarePen />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDeletePostion(index)}
                                    className="text-red-600 hover:text-red-800">
                                    <Delete />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-4 font-semibold">
                    Gesamtsumme: {calculateTotal().toFixed(2)}€
                </div>
            </div>
            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    onClick={saveOffer}
                    disabled={isSaving || hasFormErrors}
                    className="rounded bg-green-600 hover:bg-green-700 py-2 px-6 text-white disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isSaving ? "Speichert..." : "Speichern"}
                </button>
            </div>
        </form>
    );
};

export default OfferForm;

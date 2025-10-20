import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { type Position, type Offer } from "smart-offer-types";
import { type OfferFormState, type OfferFormProps } from "../types/offerForm";
import { useCompanyProfile } from "../company/useCompanyProfile";
import { getOfferDefaultsFromProfile } from "../company/companyProfileStore";

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
    totalPrice: 0,
};

export const useOfferForm = ({ initialData, onSaveComplete }: OfferFormProps) => {
    const navigate = useNavigate();
    const { profile } = useCompanyProfile();
    
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

    const [newPosition, setNewPosition] = useState<Position>(initialPosition);
    const [isSaving, setIsSaving] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    // Apply company profile defaults
    useEffect(() => {
        const { defaultTaxRatePct, defaultFooterTemplate } =
            getOfferDefaultsFromProfile(profile);

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

    const handleOfferChange = useCallback((field: string, value: string) => {
        setOffer((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    const handleCustomerChange = useCallback((field: string, value: string) => {
        setOffer((prev) => ({
            ...prev,
            customer: {
                ...prev.customer,
                [field]: value,
            },
        }));
    }, []);

    const handlePositionChange = useCallback(<K extends keyof Position>(
        field: K,
        value: Position[K]
    ) => {
        setNewPosition((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleEditClick = useCallback((index: number) => {
        const positionToEdit = offer.positions[index];
        setNewPosition(positionToEdit);
        setEditIndex(index);
    }, [offer.positions]);

    const handleSavePosition = useCallback(() => {
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
    }, [newPosition, offer.positions, editIndex]);

    const handleDeletePosition = useCallback((indexToDelete: number) => {
        setOffer((prev) => ({
            ...prev,
            positions: prev.positions.filter(
                (_, index) => index !== indexToDelete
            ),
        }));
    }, []);

    const handleCancelEdit = useCallback(() => {
        setEditIndex(null);
        setNewPosition(initialPosition);
    }, []);

    const calculateTotal = useCallback((): number => {
        return offer.positions.reduce((sum, pos) => {
            return sum + pos.unitPrice * pos.quantity;
        }, 0);
    }, [offer.positions]);

    const saveOffer = useCallback(() => {
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

            onSaveComplete?.();
            setOffer({ ...initialOffer, createdAt: new Date(), totalPrice: 0 });
        } finally {
            setIsSaving(false);
        }
    }, [offer, calculateTotal, navigate, onSaveComplete]);

    return {
        offer,
        setOffer,
        newPosition,
        setNewPosition,
        isSaving,
        editIndex,
        setEditIndex,
        handleOfferChange,
        handleCustomerChange,
        handlePositionChange,
        handleEditClick,
        handleSavePosition,
        handleDeletePosition,
        handleCancelEdit,
        calculateTotal,
        saveOffer,
    };
};

import type { Customer, Offer } from "smart-offer-types";
import { useState } from "react";

const OfferForm = () => {
    const [offer, setOffer] = useState<Offer>({
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
    });

    const handleCustomerChange = (field: keyof Customer, value: string) => {
        setOffer((prev) => ({
            ...prev,
            customer: {
                ...prev.customer,
                [field]: value,
            },
        }));
    };

    return (
        <form className="space-y-4">
            <div className="flex flex-col">
                <label htmlFor="customerName" className="font-medium">
                    Kundenname
                </label>
                <input
                    id="customerName"
                    type="text"
                    value={offer.customer.name}
                    onChange={(e) =>
                        handleCustomerChange("name", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Max Mustermann"
                />
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
        </form>
    );
};

export default OfferForm;

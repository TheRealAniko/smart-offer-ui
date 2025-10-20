import React, { useState } from "react";
import type { CompanyProfileFormState } from "@smartoffer/types";

type Props = {
    initialData?: CompanyProfileFormState;
    onSave: (data: CompanyProfileFormState) => void;
};

export function CompanyForm({ initialData, onSave }: Props) {
    const [formData, setFormData] = useState<CompanyProfileFormState>(
        initialData ?? {
            companyName: "",
            address: {
                street: "",
                houseNumber: "",
                postalCode: "",
                city: "",
                country: "DE",
            },
            logoUrl: "",
            standardTaxRatePct: 19,
            standardFooter: "",
            email: "",
            phone: "",
            website: "",
            vatId: "",
            iban: "",
            bic: "",
        }
    );

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;

        // Sonderfall: address.* Felder
        if (name.startsWith("address.")) {
            const key = name.split(".")[1] as keyof typeof formData.address;
            setFormData({
                ...formData,
                address: { ...formData.address, [key]: value },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSave(formData);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-md mx-auto p-4">
            <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="border rounded w-full p-2"
                />
            </div>

            {/* Hier kommen gleich die restlichen Felder */}
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Save
            </button>
        </form>
    );
}

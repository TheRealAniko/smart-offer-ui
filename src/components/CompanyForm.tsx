import React, { useState, useEffect } from "react";
import type { CompanyProfileFormState } from "@smartoffer/types";

type Props = {
    initialData?: CompanyProfileFormState;
    onSave: (data: CompanyProfileFormState) => void;
    isSaving?: boolean;
};

export function CompanyForm({ initialData, onSave, isSaving = false }: Props) {
    const [formData, setFormData] = useState<CompanyProfileFormState>({
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
    });

    // Update form data when initialData changes
    useEffect(() => {
        if (initialData) {
            console.log("CompanyForm: Loading initial data:", initialData);
            setFormData(initialData);
        }
    }, [initialData]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;

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
            className="space-y-6 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
            {/* 🏢 Allgemein */}
            <div>
                <label className="block text-sm font-medium">Firmenname</label>
                <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="border rounded w-full p-2"
                />
            </div>

            {/* 📍 Adresse */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Adresse</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">
                            Straße
                        </label>
                        <input
                            type="text"
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Hausnummer
                        </label>
                        <input
                            type="text"
                            name="address.houseNumber"
                            value={formData.address.houseNumber}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">PLZ</label>
                        <input
                            type="text"
                            name="address.postalCode"
                            value={formData.address.postalCode}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Stadt
                        </label>
                        <input
                            type="text"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Land
                        </label>
                        <input
                            type="text"
                            name="address.country"
                            value={formData.address.country}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                        />
                    </div>
                </div>
            </div>

            {/* 💬 Kontakt */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Kontakt</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">
                            E-Mail
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Telefon
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium">
                            Website
                        </label>
                        <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                        />
                    </div>
                </div>
            </div>

            {/* 💰 Rechtliches / Bank */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Zahlungsdaten</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">
                            USt-ID
                        </label>
                        <input
                            type="text"
                            name="vatId"
                            value={formData.vatId}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            IBAN
                        </label>
                        <input
                            type="text"
                            name="iban"
                            value={formData.iban}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">BIC</label>
                        <input
                            type="text"
                            name="bic"
                            value={formData.bic}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                        />
                    </div>
                </div>
            </div>

            {/* 🖼️ Logo + Steuer + Footer */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Darstellung</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">
                            Logo URL
                        </label>
                        <input
                            type="url"
                            name="logoUrl"
                            value={formData.logoUrl}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                        />
                        {formData.logoUrl && (
                            <img
                                src={formData.logoUrl}
                                alt="Logo Preview"
                                className="mt-2 max-h-16 object-contain border rounded p-1"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Standard-Steuersatz (%)
                        </label>
                        <input
                            type="number"
                            name="standardTaxRatePct"
                            value={formData.standardTaxRatePct}
                            onChange={handleChange}
                            className="border rounded w-full p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Standard-Footer
                        </label>
                        <textarea
                            name="standardFooter"
                            value={formData.standardFooter}
                            onChange={handleChange}
                            className="border rounded w-full p-2 h-24"
                        />
                        {formData.standardFooter && (
                            <div className="mt-2 border rounded p-2 text-sm text-gray-700 bg-gray-50">
                                <strong>Vorschau:</strong>
                                <p>
                                    {formData.standardFooter
                                        .replace(
                                            "{companyName}",
                                            formData.companyName ||
                                                "Deine Firma"
                                        )
                                        .replace(
                                            "{today}",
                                            new Date().toLocaleDateString(
                                                "de-DE"
                                            )
                                        )}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 💾 Submit */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isSaving ? "Speichern..." : "Speichern"}
                </button>
            </div>
        </form>
    );
}

import type { OfferFormState } from "../OfferForm";

type Props = {
    customer: OfferFormState["customer"];
    onChange: (field: keyof OfferFormState["customer"], value: string) => void;
    formErrors: { customerName?: string };
    customerNameRef: React.RefObject<HTMLInputElement | null>;
};

const CustomerStep = ({
    customer,
    onChange,
    formErrors,
    customerNameRef,
}: Props) => {
    return (
        <section className="space-y-4">
            {/* Kundenname */}
            <div className="flex flex-col">
                <label htmlFor="customerName" className="font-medium">
                    Kundenname
                </label>
                <input
                    ref={customerNameRef}
                    id="customerName"
                    type="text"
                    value={customer.name}
                    onChange={(e) => onChange("name", e.target.value)}
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

            {/* E-Mail */}
            <div className="flex flex-col">
                <label htmlFor="email" className="font-medium">
                    E-Mail
                </label>
                <input
                    id="email"
                    type="email"
                    value={customer.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="max@mustermann.com"
                />
            </div>

            {/* Telefon */}
            <div className="flex flex-col">
                <label htmlFor="phone" className="font-medium">
                    Telefon
                </label>
                <input
                    id="phone"
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="+49 123 4567890"
                />
            </div>

            {/* Adresse */}
            <div className="flex flex-col">
                <label htmlFor="address" className="font-medium">
                    Adresse
                </label>
                <input
                    id="address"
                    type="text"
                    value={customer.address}
                    onChange={(e) => onChange("address", e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Musterstraße 1, 12345 Musterstadt"
                />
            </div>

            {/* Ansprechpartner */}
            <div className="flex flex-col">
                <label htmlFor="contactPerson" className="font-medium">
                    Ansprechpartner
                </label>
                <input
                    id="contactPerson"
                    type="text"
                    value={customer.contactPerson}
                    onChange={(e) => onChange("contactPerson", e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                    placeholder="Max Mustermann"
                />
            </div>
        </section>
    );
};

export default CustomerStep;

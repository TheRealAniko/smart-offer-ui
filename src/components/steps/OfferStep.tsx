import type { RefObject } from "react";
import type { OfferFormState } from "../OfferForm.js";

type Props = {
    offer: OfferFormState;
    onChange: (field: keyof OfferFormState, value: string) => void;
    formErrors: { title?: string };
    titleRef: RefObject<HTMLInputElement | null>;
};

const OfferStep = ({ offer, onChange, formErrors, titleRef }: Props) => {
    return (
        <section className="space-y-4">
            <div className="flex flex-col">
                <label htmlFor="title" className="font-medium">
                    Angebotstitel
                </label>
                <input
                    ref={titleRef}
                    id="title"
                    type="text"
                    value={offer.title}
                    onChange={(e) => onChange("title", e.target.value)}
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
        </section>
    );
};

export default OfferStep;

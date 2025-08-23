import { useState } from "react";
import { type Offer } from "smart-offer-types";
import OffersList from "../components/OffersList";
import OfferDetail from "../components/OfferDetail";
import OfferForm from "../components/OfferForm";

const OffersPage = () => {
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

    return (
        <div className="p-4">
            {editingOffer ? (
                <OfferForm
                    initialData={editingOffer}
                    onSaveComplete={() => setEditingOffer(null)}
                />
            ) : selectedOffer ? (
                <OfferDetail
                    offer={selectedOffer}
                    onBack={() => setSelectedOffer(null)}
                />
            ) : (
                <OffersList
                    onSelect={setSelectedOffer}
                    onEdit={setEditingOffer}
                />
            )}
        </div>
    );
};

export default OffersPage;

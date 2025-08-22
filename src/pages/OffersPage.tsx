import { useState } from "react";
import { type Offer } from "smart-offer-types";
import OffersList from "../components/OffersList";
import OfferDetail from "../components/OfferDetail";

const OffersPage = () => {
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

    return (
        <div className="p-4">
            {selectedOffer ? (
                <OfferDetail
                    offer={selectedOffer}
                    onBack={() => setSelectedOffer(null)}
                />
            ) : (
                <OffersList onSelect={setSelectedOffer} />
            )}
        </div>
    );
};

export default OffersPage;

import { type Offer } from "smart-offer-types";
import { useEffect, useState } from "react";

type Props = {
    onSelect: (offer: Offer) => void; // Callback when an offer is selected
};

const OffersList = ({ onSelect }: Props) => {
    const [offers, setOffers] = useState<Offer[]>([]);

    useEffect(() => {
        const storedOffers = localStorage.getItem("offers");
        if (storedOffers) {
            const parsed: Offer[] = JSON.parse(storedOffers);
            // Nachberechnen falls total fehlt
            const updated = parsed.map((o) => ({
                ...o,
                total:
                    o.totalPrice ??
                    o.positions.reduce(
                        (s, p) => s + p.unitPrice * p.quantity,
                        0
                    ),
            }));
            setOffers(updated);
        }
    }, []);

    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold">Angebote</h2>

            {offers.length === 0 ? (
                <p className="text-gray-500">Noch keine Angebote vorhanden.</p>
            ) : (
                <ul className="divide-y border rounded">
                    {offers.map((offer) => (
                        <li
                            key={offer.id}
                            className="flex justify-between items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                            onClick={() => onSelect(offer)}>
                            <div>
                                <div className="font-medium">
                                    {offer.title || "Unbenanntes Angebot"}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {offer.customer.name || "Kein Kunde"}
                                </div>
                            </div>
                            <div className="text-right text-sm">
                                <div>
                                    {new Date(
                                        offer.createdAt
                                    ).toLocaleDateString()}
                                </div>
                                <div className="font-semibold">
                                    {(offer.totalPrice ?? 0).toFixed(2)} €
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default OffersList;

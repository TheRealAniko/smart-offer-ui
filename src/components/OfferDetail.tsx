import { type Offer } from "smart-offer-types";

type Props = {
    offer: Offer;
    onBack: () => void;
};

const OfferDetail = ({ offer, onBack }: Props) => {
    const calculateTotal = (): number => {
        return offer.positions.reduce(
            (sum, pos) => sum + pos.unitPrice * pos.quantity,
            0
        );
    };

    return (
        <section className="space-y-4">
            <button
                onClick={onBack}
                className="text-blue-600 hover:underline text-sm">
                ← Zurück zur Liste
            </button>

            <h2 className="text-xl font-semibold">{offer.title}</h2>
            <p className="text-gray-500">Kunde: {offer.customer.name}</p>
            <p className="text-gray-500">
                Erstellt: {new Date(offer.createdAt).toLocaleDateString()}
            </p>

            <div className="mt-4">
                <h3 className="font-semibold">Positionen</h3>
                <ul className="divide-y">
                    {offer.positions.map((p, i) => (
                        <li key={i} className="flex justify-between py-2">
                            <span>
                                {p.quantity} {p.unit} {p.label}
                            </span>
                            <span>
                                {(p.unitPrice * p.quantity).toFixed(2)} €
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="mt-2 font-semibold text-right">
                    Gesamt: {calculateTotal().toFixed(2)} €
                </div>
            </div>
        </section>
    );
};

export default OfferDetail;

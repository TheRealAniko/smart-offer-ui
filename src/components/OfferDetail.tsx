import { type Offer } from "smart-offer-types";
import OfferDocument from "./OfferDocument";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

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

    // Referenz für das Angebot-Dokument
    const docRef = useRef<HTMLDivElement>(null);

    // Hook von react-to-print
    const handlePrint = useReactToPrint({
        contentRef: docRef,
        documentTitle: `Angebot-${offer.title}`,
    });

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="text-blue-600 hover:underline text-sm print-hidden">
                    ← Zurück zur Liste
                </button>

                {/* Print-Button */}
                <button
                    onClick={handlePrint}
                    className="rounded px-3 py-1 border text-sm hover:bg-gray-50">
                    Drucken / PDF
                </button>
            </div>

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

            <div className="mt-6">
                <h3 className="font-semibold mb-2">Vorschau</h3>
                <div className="border rounded shadow-sm">
                    <OfferDocument ref={docRef} offer={offer} />
                </div>
            </div>
        </section>
    );
};

export default OfferDetail;

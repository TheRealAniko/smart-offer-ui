import type { OfferFormState } from "../OfferForm";

type Props = {
    offer: OfferFormState;
    onEditStep: (step: 1 | 2 | 3) => void;
    onSave: () => void;
    isSaving: boolean;
    total: number;
};

const ReviewStep = ({ offer, onEditStep, total }: Props) => {
    return (
        <section className="space-y-6">
            <h3 className="text-lg font-semibold">Review</h3>

            {/* Angebotsdaten */}
            <div className="rounded border p-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-medium">Angebot</h4>
                    <button
                        type="button"
                        onClick={() => onEditStep(1)}
                        className="text-blue-600 hover:underline text-sm">
                        Bearbeiten
                    </button>
                </div>
                <div className="mt-2 text-sm">
                    <div>
                        <span className="text-gray-500">Titel:</span>{" "}
                        {offer.title || "—"}
                    </div>
                    <div>
                        <span className="text-gray-500">Erstellt:</span>{" "}
                        {new Date(offer.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Kundendaten */}
            <div className="rounded border p-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-medium">Kunde</h4>
                    <button
                        type="button"
                        onClick={() => onEditStep(2)}
                        className="text-blue-600 hover:underline text-sm">
                        Bearbeiten
                    </button>
                </div>
                <div className="mt-2 text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                    <div>
                        <span className="text-gray-500">Name:</span>{" "}
                        {offer.customer.name || "—"}
                    </div>
                    <div>
                        <span className="text-gray-500">E-Mail:</span>{" "}
                        {offer.customer.email || "—"}
                    </div>
                    <div>
                        <span className="text-gray-500">Telefon:</span>{" "}
                        {offer.customer.phone || "—"}
                    </div>
                    <div>
                        <span className="text-gray-500">Ansprechpartner:</span>{" "}
                        {offer.customer.contactPerson || "—"}
                    </div>
                    <div className="sm:col-span-2">
                        <span className="text-gray-500">Adresse:</span>{" "}
                        {offer.customer.address || "—"}
                    </div>
                </div>
            </div>

            {/* Positionen */}
            <div className="rounded border p-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-medium">Positionen</h4>
                    <button
                        type="button"
                        onClick={() => onEditStep(3)}
                        className="text-blue-600 hover:underline text-sm">
                        Bearbeiten
                    </button>
                </div>

                {offer.positions.length === 0 ? (
                    <p className="mt-2 text-sm text-gray-500">
                        Keine Positionen vorhanden.
                    </p>
                ) : (
                    <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-gray-500">
                                <tr>
                                    <th className="py-2 pr-3">Bezeichnung</th>
                                    <th className="py-2 pr-3">Menge</th>
                                    <th className="py-2 pr-3">Einheit</th>
                                    <th className="py-2 pr-3">Einzelpreis</th>
                                    <th className="py-2 pr-0 text-right">
                                        Summe
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {offer.positions.map((p, i) => (
                                    <tr key={i} className="border-t">
                                        <td className="py-2 pr-3">{p.label}</td>
                                        <td className="py-2 pr-3">
                                            {p.quantity}
                                        </td>
                                        <td className="py-2 pr-3">{p.unit}</td>
                                        <td className="py-2 pr-3">
                                            {p.unitPrice.toFixed(2)}€
                                        </td>
                                        <td className="py-2 pr-0 text-right">
                                            {(p.unitPrice * p.quantity).toFixed(
                                                2
                                            )}
                                            €
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t font-medium">
                                    <td
                                        colSpan={4}
                                        className="py-2 pr-3 text-right">
                                        Gesamt
                                    </td>
                                    <td className="py-2 pr-0 text-right">
                                        {total.toFixed(2)}€
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>

            {/* Speichern-Button */}
            {/* <div className="flex justify-end mt-6">
                <button
                    type="button"
                    onClick={onSave}
                    disabled={isSaving}
                    className="rounded bg-green-600 hover:bg-green-700 py-2 px-6 text-white disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isSaving ? "Speichert..." : "Speichern"}
                </button>
            </div> */}
        </section>
    );
};

export default ReviewStep;

import { forwardRef } from "react";
import { type Offer } from "smart-offer-types";
import { OfferPrintHeader } from "../print/OfferPrintHeader";
import { replaceFooterTokens } from "../print/replaceFooterTokens";
import { useCompanyProfile } from "../company/useCompanyProfile";

const OfferDocument = forwardRef<HTMLDivElement, { offer: Offer }>(
    ({ offer }, ref) => {
        // Fallback: falls totalPrice mal nicht gesetzt ist
        const computedTotal = offer.positions.reduce(
            (sum, p) => sum + p.unitPrice * p.quantity,
            0
        );
        const total =
            typeof offer.totalPrice === "number"
                ? offer.totalPrice
                : computedTotal;

        const toValidDate = (
            input: Date | string | number | null | undefined
        ): Date | null => {
            if (!input) return null;
            const dt = input instanceof Date ? input : new Date(input);
            return isNaN(dt.getTime()) ? null : dt;
        };

        const formatDate = (
            input: Date | string | number | null | undefined
        ) => {
            const dt = toValidDate(input);
            return dt ? new Intl.DateTimeFormat("de-DE").format(dt) : "–";
        };

        const formatCurrency = (
            value: number,
            currency: "EUR" | "CHF" = "EUR"
        ) =>
            new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency,
            }).format(value);

        const { profile } = useCompanyProfile();

        const renderedFooter = replaceFooterTokens(
            offer.footer ?? "",
            profile,
            offer
        );

        return (
            <div
                ref={ref}
                className="mx-auto print:w-[210mm] bg-white p-8 print:p-0">
                {/* Header mit Logo und Firmendaten */}
                <OfferPrintHeader />

                {/* Titel */}
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold">{offer.title}</h1>
                    <p className="text-sm text-gray-600">
                        Erstellt am: {formatDate(offer.createdAt)}
                    </p>
                    {offer.validUntil && (
                        <p className="text-sm text-gray-600">
                            Gültig bis: {formatDate(offer.validUntil)}
                        </p>
                    )}
                </header>

                {/* Kunde */}
                <section className="mb-6">
                    <h2 className="text-lg font-medium">Kunde</h2>
                    <div className="text-sm leading-6">
                        <div>{offer.customer.name}</div>
                        {offer.customer.address && (
                            <div>{offer.customer.address}</div>
                        )}
                        {offer.customer.email && (
                            <div>{offer.customer.email}</div>
                        )}
                    </div>
                </section>

                {/* Positionen */}
                <section>
                    <h2 className="text-lg font-medium mb-2">Positionen</h2>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Bezeichnung</th>
                                <th className="text-right py-2">Menge</th>
                                <th className="text-right py-2">Einheit</th>
                                <th className="text-right py-2">Einzelpreis</th>
                                <th className="text-right py-2">Summe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offer.positions.map((p, i) => (
                                <tr key={i} className="border-b">
                                    <td className="py-2">{p.label}</td>
                                    <td className="py-2 text-right">
                                        {p.quantity}
                                    </td>
                                    <td className="py-2 text-right">
                                        {p.unit}
                                    </td>
                                    <td className="py-2 text-right">
                                        {formatCurrency(p.unitPrice)}
                                    </td>
                                    <td className="py-2 text-right">
                                        {formatCurrency(
                                            p.quantity * p.unitPrice
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {/* 👇 Gesamtsumme sicher ausgeben */}
                        <tfoot>
                            <tr>
                                <td
                                    colSpan={4}
                                    className="py-3 text-right font-medium">
                                    Gesamt
                                </td>
                                <td className="py-3 text-right font-medium">
                                    {formatCurrency(total)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </section>
                <footer className="print-footer">
                    <p>{renderedFooter}</p>
                </footer>
            </div>
        );
    }
);
OfferDocument.displayName = "OfferDocument";
export default OfferDocument;

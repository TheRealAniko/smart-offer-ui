import type { CompanyProfile, Offer } from "smart-offer-types";

/**
 * Replaces placeholder tokens in a footer template with real data.
 */

export function replaceFooterTokens(
    template: string,
    company: CompanyProfile | null,
    offer: Offer | { id: string; title: string }
): string {
    const today = new Date();
    const todayStr = today.toLocaleDateString("de-DE");

    const replacements: Record<string, string> = {
        "{company.name}": company?.companyName ?? "",
        "{company.tax}": company?.standardTaxRatePct
            ? `${(company.standardTaxRatePct * 100).toFixed(0)}%`
            : "",
        "{offer.number}": "id" in offer ? offer.id : "",
        "{offer.title}": "title" in offer ? offer.title : "",
        "{today}": todayStr,
    };

    let result = template;
    for (const [token, value] of Object.entries(replacements)) {
        result = result.replaceAll(token, value);
    }
    return result.trim();
}

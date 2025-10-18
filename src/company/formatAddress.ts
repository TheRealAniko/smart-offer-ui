import type { CompanyProfile } from "smart-offer-types";

/**
 * Builds a single-line printable address from the company profile.
 */
export function formatAddressLine(company: CompanyProfile) {
    const a = company.address;
    const parts = [
        a?.street && a?.houseNumber
            ? `${a.street} ${a.houseNumber}`
            : a?.street,
        a?.postalCode && a?.city ? `${a.postalCode} ${a.city}` : a?.city,
        a?.country,
    ].filter(Boolean);

    return parts.join(" · ");
}

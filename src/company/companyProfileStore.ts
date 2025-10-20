import { makeCompanyProfile, type CompanyProfile } from "smart-offer-types";

const STORAGE_KEY = "smartOffer.companyProfile.v1";

/** Lädt CompanyProfile aus localStorage, validiert es, sonst null. */
export function loadCompanyProfile(): CompanyProfile | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        const res = makeCompanyProfile(parsed);
        if (res.ok) return res.value;

        console.warn("Invalid company profile in storage:", res.issues);
        return null;
    } catch (e) {
        console.warn("Failed to parse company profile:", e);
        return null;
    }
}

/** Liefert genau die Dinge, die die Offer-Form als Defaults braucht. */
export function getOfferDefaultsFromProfile(profile: CompanyProfile | null) {
    return {
        defaultTaxRatePct: profile?.standardTaxRatePct ?? 0, // z. B. 0.19
        defaultFooterTemplate: profile?.standardFooter ?? "",
        companyName: profile?.companyName ?? "",
        logoUrl: profile?.logoUrl ?? undefined,
    };
}

/** Speichert ein gültiges CompanyProfile im localStorage */
export function saveCompanyProfile(profile: CompanyProfile) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
        console.error("Failed to save company profile:", e);
    }
}

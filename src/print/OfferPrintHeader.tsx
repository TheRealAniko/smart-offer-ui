import { useCompanyProfile } from "../company/useCompanyProfile";
import { formatAddressLine } from "../company/formatAddress";

/**
 * Print header for offers: logo (or name) + address.
 */
export function OfferPrintHeader() {
    const { profile } = useCompanyProfile();

    if (!profile) {
        return (
            <header className="print-header">
                <div className="print-brand print-brand--text">
                    Your Company
                </div>
            </header>
        );
    }

    const addr = formatAddressLine(profile);

    return (
        <header className="print-header">
            {profile.logoUrl ? (
                <img
                    className="print-logo"
                    src={profile.logoUrl}
                    alt={profile.companyName}
                />
            ) : (
                <div className="print-brand print-brand--text">
                    {profile.companyName}
                </div>
            )}
            <address className="print-address">{addr}</address>
        </header>
    );
}

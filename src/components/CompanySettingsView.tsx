import { useNavigate } from "react-router";
import { useCompanyProfile } from "../company/useCompanyProfile";
import { toast } from "react-toastify";

export function CompanySettingsView() {
    const { profile } = useCompanyProfile();
    const navigate = useNavigate();

    if (!profile) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">Company Settings</h1>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-800 mb-4">
                        Noch kein Company-Profil vorhanden.
                    </p>
                    <button
                        onClick={() => navigate("/settings/company/edit")}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Company-Profil erstellen
                    </button>
                </div>
            </div>
        );
    }

    function handleDelete() {
        if (window.confirm("Möchten Sie das Company-Profil wirklich löschen?")) {
            localStorage.removeItem("smartOffer.companyProfile.v1");
            toast.success("Company-Profil wurde gelöscht");
            window.location.reload();
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">Company Settings</h1>

            <div className="border rounded-lg p-6 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {profile.companyName}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate("/settings/company/edit")}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                            Bearbeiten
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                            Löschen
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Adresse */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Adresse</h3>
                        <p className="text-gray-900">
                            {profile.address.street} {profile.address.houseNumber}
                            <br />
                            {profile.address.postalCode} {profile.address.city}
                            <br />
                            {profile.address.country}
                        </p>
                    </div>

                    {/* Kontakt */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Kontakt</h3>
                        <p className="text-gray-900">
                            {profile.email && (
                                <>
                                    <span className="font-medium">E-Mail:</span> {profile.email}
                                    <br />
                                </>
                            )}
                            {profile.phone && (
                                <>
                                    <span className="font-medium">Telefon:</span> {profile.phone}
                                    <br />
                                </>
                            )}
                            {profile.website && (
                                <>
                                    <span className="font-medium">Website:</span>{" "}
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800">
                                        {profile.website}
                                    </a>
                                </>
                            )}
                        </p>
                    </div>

                    {/* Rechtliches */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Rechtliches</h3>
                        <p className="text-gray-900">
                            {profile.vatId && (
                                <>
                                    <span className="font-medium">USt-ID:</span> {profile.vatId}
                                    <br />
                                </>
                            )}
                            <span className="font-medium">Steuersatz:</span> {profile.standardTaxRatePct}%
                        </p>
                    </div>

                    {/* Bankdaten */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Bankdaten</h3>
                        <p className="text-gray-900">
                            {profile.iban && (
                                <>
                                    <span className="font-medium">IBAN:</span> {profile.iban}
                                    <br />
                                </>
                            )}
                            {profile.bic && (
                                <>
                                    <span className="font-medium">BIC:</span> {profile.bic}
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* Logo */}
                {profile.logoUrl && (
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Logo</h3>
                        <img
                            src={profile.logoUrl}
                            alt="Company Logo"
                            className="max-h-20 object-contain border rounded p-2 bg-gray-50"
                        />
                    </div>
                )}

                {/* Footer */}
                {profile.standardFooter && (
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Standard-Footer</h3>
                        <div className="bg-gray-50 border rounded p-3 text-sm">
                            <p className="text-gray-700">
                                {profile.standardFooter
                                    .replace("{companyName}", profile.companyName)
                                    .replace("{today}", new Date().toLocaleDateString("de-DE"))}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

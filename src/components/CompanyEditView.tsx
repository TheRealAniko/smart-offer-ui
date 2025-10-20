import { useState } from "react";
import { useNavigate } from "react-router";
import { CompanyForm } from "./CompanyForm";
import { useCompanyProfile } from "../company/useCompanyProfile";
import {
    normalizeCompanyProfile,
    makeCompanyProfile,
    type CompanyProfileFormState,
    type CompanyProfile,
} from "smart-offer-types";
import { saveCompanyProfile } from "../company/companyProfileStore";
import { toast } from "react-toastify";

export function CompanyEditView() {
    const { profile } = useCompanyProfile();
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    console.log("CompanyEditView: Current profile:", profile);

    function convertToFormState(
        profile: CompanyProfile
    ): CompanyProfileFormState {
        return {
            companyName: profile.companyName,
            address: {
                street: profile.address.street,
                houseNumber: profile.address.houseNumber,
                postalCode: profile.address.postalCode as unknown as string,
                city: profile.address.city,
                country: profile.address.country,
            },
            standardTaxRatePct: profile.standardTaxRatePct as unknown as number,
            standardFooter: profile.standardFooter,
            email: profile.email ?? "",
            phone: profile.phone ?? "",
            website: profile.website ?? "",
            vatId: profile.vatId ?? "",
            iban: profile.iban ?? "",
            bic: profile.bic ?? "",
            logoUrl: profile.logoUrl ?? "",
        };
    }

    function handleSave(data: CompanyProfileFormState) {
        try {
            setIsSaving(true);

            // Normalize and convert form data to CompanyProfile
            const normalized = normalizeCompanyProfile(data);
            const result = makeCompanyProfile(normalized);

            if (!result.ok) {
                toast.error("Validation failed");
                console.error("Validation errors:", result.issues);
                return;
            }

            // Save the valid company profile
            saveCompanyProfile(result.value);

            // Notify user of success
            toast.success("Company profile saved successfully");
            navigate("/settings/company");
        } catch (err) {
            console.error("Error saving company profile:", err);
            toast.error("An error occurred while saving the profile");
        } finally {
            setIsSaving(false);
        }
    }

    function handleCancel() {
        navigate("/settings/company");
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">
                    {profile ? "Company-Profil bearbeiten" : "Company-Profil erstellen"}
                </h1>
                <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
                    Abbrechen
                </button>
            </div>

            <CompanyForm
                initialData={
                    profile ? (() => {
                        const formData = convertToFormState(profile);
                        console.log("CompanyEditView: Converted form data:", formData);
                        return formData;
                    })() : undefined
                }
                onSave={handleSave}
                isSaving={isSaving}
            />
        </div>
    );
}

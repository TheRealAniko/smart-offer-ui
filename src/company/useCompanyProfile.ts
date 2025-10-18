import { useEffect, useState } from "react";
import type { CompanyProfile } from "smart-offer-types";
import { loadCompanyProfile } from "./companyProfileStore";

export function useCompanyProfile() {
    const [profile, setProfile] = useState<CompanyProfile | null>(null);

    useEffect(() => {
        setProfile(loadCompanyProfile());
    }, []);

    return { profile };
}

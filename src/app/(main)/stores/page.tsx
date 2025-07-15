import { StoreFinder } from "@/components/about-us/store-finder";
import { fetchStoreLocations, FALLBACK_STORE_LOCATIONS } from "@/data/store-locations";
import { Suspense } from "react";
import { ExternalSiteWrapper } from "@/components/external-site/external-site-wrapper";

export default async function StoresPage() {
  // Fetch store locations from the API
  const storeLocations = await fetchStoreLocations();

  // Use fallback data if API call fails and returns empty array
  const stores = storeLocations.length > 0 ? storeLocations : FALLBACK_STORE_LOCATIONS;

  // External site URL to embed
  const externalSiteUrl = "https://juicefastc12.sg-host.com/";

  // Choose which implementation to use
  const useIframe = true; // Set to false to use server-side proxy instead

  return (
    <div className="py-6">
      <Suspense fallback={<div className="text-center py-10">Loading external content...</div>}>
        <ExternalSiteWrapper url={externalSiteUrl} useIframe={useIframe} />
      </Suspense>
    </div>
  );
}

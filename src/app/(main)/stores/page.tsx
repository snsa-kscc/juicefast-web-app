import { StoreFinder } from "@/components/about-us/store-finder";
import { fetchStoreLocations, FALLBACK_STORE_LOCATIONS } from "@/data/store-locations";

export default async function StoresPage() {
  // Fetch store locations from the API
  const storeLocations = await fetchStoreLocations();
  
  // Use fallback data if API call fails and returns empty array
  const stores = storeLocations.length > 0 ? storeLocations : FALLBACK_STORE_LOCATIONS;
  
  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Store Finder</h1>
        <p className="text-gray-500 mt-2">Find healthy food stores near you</p>
      </div>
      <StoreFinder initialStores={stores} />
    </div>
  );
}

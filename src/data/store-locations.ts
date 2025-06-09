// Store location data for the store finder feature
export interface ApiStoreLocation {
  title: string;
  street: string;
  city: string;
  postal_code: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  open_hours: string;
}

// Interface for our application's store location format
export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

// Function to fetch store locations from the API
export async function fetchStoreLocations(): Promise<StoreLocation[]> {
  try {
    const response = await fetch('https://staging2.juicefastc12.sg-host.com/wp-json/store-locator/v1/stores', {
      cache: 'no-store' // Don't cache the response to ensure fresh data
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch store locations: ${response.status}`);
    }
    
    const apiStores: ApiStoreLocation[] = await response.json();
    
    // Transform API response to our application's format
    return apiStores.map((store, index) => {
      // Parse open_hours if it's a JSON string
      let formattedHours = "Hours not available";
      try {
        const hoursObj = JSON.parse(store.open_hours);
        const daysMap: Record<string, string> = {
          mon: "Monday",
          tue: "Tuesday",
          wed: "Wednesday",
          thu: "Thursday",
          fri: "Friday",
          sat: "Saturday",
          sun: "Sunday"
        };
        
        // Format hours - if all values are "0", display as "Open 24/7"
        const allZero = Object.values(hoursObj).every(val => val === "0");
        if (allZero) {
          formattedHours = "Open 24/7";
        } else {
          formattedHours = Object.entries(hoursObj)
            .map(([day, hours]) => `${daysMap[day]}: ${hours || 'Closed'}`)
            .join(', ');
        }
      } catch (e) {
        console.error("Error parsing hours:", e);
      }
      
      return {
        id: `store${index + 1}`,
        name: store.title,
        address: store.street,
        city: store.city,
        state: "", // API doesn't provide state
        zipCode: store.postal_code,
        phone: store.phone,
        hours: formattedHours,
        lat: store.lat,
        lng: store.lng
      };
    });
  } catch (error) {
    console.error('Error fetching store locations:', error);
    return []; // Return empty array in case of error
  }
}

// Fallback store data in case API fails
export const FALLBACK_STORE_LOCATIONS: StoreLocation[] = [
  {
    id: "store1",
    name: "Split Health Center",
    address: "Ulica Domovinskog rata 45",
    city: "Split",
    state: "Splitsko-dalmatinska",
    zipCode: "21000",
    phone: "+385 21 555 123",
    hours: "Mon-Fri: 8am-8pm, Sat: 9am-3pm, Sun: Closed",
    lat: 43.5147,
    lng: 16.4435,
  }
];

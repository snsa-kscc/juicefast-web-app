// Store location data for the store finder feature
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

// Sample store data for Croatia
export const STORE_LOCATIONS: StoreLocation[] = [
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
  },
  {
    id: "store2",
    name: "Riva Nutrition Store",
    address: "Obala Hrvatskog narodnog preporoda 12",
    city: "Split",
    state: "Splitsko-dalmatinska",
    zipCode: "21000",
    phone: "+385 21 555 789",
    hours: "Mon-Sat: 9am-9pm, Sun: 10am-6pm",
    lat: 43.5081,
    lng: 16.4402,
  },
  {
    id: "store3",
    name: "Zagreb Wellness Hub",
    address: "Ilica 152",
    city: "Zagreb",
    state: "Grad Zagreb",
    zipCode: "10000",
    phone: "+385 1 555 234",
    hours: "Mon-Fri: 7am-9pm, Sat-Sun: 9am-7pm",
    lat: 45.815,
    lng: 15.9819,
  },
  {
    id: "store4",
    name: "Healthy Corner Zagreb",
    address: "Maksimirska 123",
    city: "Zagreb",
    state: "Grad Zagreb",
    zipCode: "10000",
    phone: "+385 1 555 432",
    hours: "Mon-Sun: 8am-8pm",
    lat: 45.8173,
    lng: 16.0054,
  },
  {
    id: "store5",
    name: "Rijeka Nutrition Center",
    address: "Korzo 22",
    city: "Rijeka",
    state: "Primorsko-goranska",
    zipCode: "51000",
    phone: "+385 51 555 678",
    hours: "Mon-Fri: 8am-8pm, Sat: 9am-6pm, Sun: Closed",
    lat: 45.3271,
    lng: 14.4422,
  },
];

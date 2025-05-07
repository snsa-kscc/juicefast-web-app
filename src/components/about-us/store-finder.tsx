"use client";

import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { STORE_LOCATIONS, StoreLocation } from "@/data/store-locations";

// Set Mapbox access token globally
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

// Disable Mapbox telemetry and tracking completely
if (typeof window !== 'undefined') {
  // Create a proxy for fetch to block Mapbox telemetry requests
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    const url = typeof input === 'string' ? input : input instanceof Request ? input.url : '';
    
    // Block any requests to Mapbox events/telemetry endpoints
    if (url.includes('events.mapbox.com') || url.includes('api.mapbox.com/events')) {
      console.log('Blocked Mapbox telemetry request:', url);
      return Promise.resolve(new Response('', { status: 200 }));
    }
    
    return originalFetch(input, init);
  };
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StoreFinder() {
  const [stores, setStores] = useState<StoreLocation[]>(STORE_LOCATIONS);
  const [filteredStores, setFilteredStores] = useState<StoreLocation[]>(STORE_LOCATIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Filter stores based on search term and selected state
  useEffect(() => {
    let filtered = stores;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (store) => store.name.toLowerCase().includes(term) || store.city.toLowerCase().includes(term) || store.address.toLowerCase().includes(term)
      );
    }

    if (selectedState) {
      filtered = filtered.filter((store) => store.state === selectedState);
    }

    setFilteredStores(filtered);

    // Select the first store by default if there are results
    if (filtered.length > 0 && !selectedStore) {
      setSelectedStore(filtered[0]);
    } else if (filtered.length === 0) {
      setSelectedStore(null);
    }
  }, [searchTerm, selectedState, stores, selectedStore]);

  // Reference for Mapbox map
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Initialize the map when the component mounts or when selected store changes
  useEffect(() => {
    if (!selectedStore || !mapContainerRef.current) return;
    
    // Access token is already set globally at the top of the file
    
    // If map already exists, try to remove it safely before creating a new one
    try {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    } catch (error) {
      console.log("Error removing previous map:", error);
    }
    
    // Create new map with all telemetry and tracking disabled
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [selectedStore.lng, selectedStore.lat],
      zoom: 12,
      trackResize: true,
      collectResourceTiming: false,  // Disable telemetry collection
      attributionControl: false,     // Disable attribution which also sends requests
      refreshExpiredTiles: false,    // Disable refreshing expired tiles
      fadeDuration: 0,               // Disable fade animations
      crossSourceCollisions: false   // Disable cross source collisions
    });
    
    // Add navigation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl());
    
    // Add markers for all filtered stores
    filteredStores.forEach((store) => {
      // Create a popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(
          `
          <div>
            <h3 style="font-weight: bold; margin-bottom: 5px;">${store.name}</h3>
            <p style="margin: 2px 0;">${store.address}, ${store.city}, ${store.state} ${store.zipCode}</p>
            <p style="margin: 2px 0;">Phone: ${store.phone}</p>
            <p style="margin: 2px 0;">Hours: ${store.hours}</p>
          </div>
        `
        )
        .setMaxWidth("300px");
    
      // Create a marker
      const marker = new mapboxgl.Marker({
        color: store.id === selectedStore.id ? "#ff0000" : "#3FB1CE",
      })
        .setLngLat([store.lng, store.lat])
        .setPopup(popup)
        .addTo(mapRef.current);
    
      // If this is the selected store, open the popup
      if (store.id === selectedStore.id) {
        marker.togglePopup();
      }
    });
    
    // Set map as loaded
    setMapLoaded(true);

    // Cleanup function with error handling
    return () => {
      try {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      } catch (error) {
        console.log("Error cleaning up map:", error);
      }
    };
  }, [selectedStore, filteredStores]);

  // Get unique states for the filter
  const uniqueStates = [...new Set(stores.map((store) => store.state))];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Search and filters */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Find a Store</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input id="search" placeholder="Search by name, city or address" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Filter by State</Label>
              <Select value={selectedState || "all"} onValueChange={(value) => setSelectedState(value === "all" ? "" : value)}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {uniqueStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Store list */}
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium">Stores ({filteredStores.length})</h3>
              {filteredStores.length === 0 ? (
                <p className="text-sm text-gray-500">No stores found. Try adjusting your search.</p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredStores.map((store) => (
                    <div
                      key={store.id}
                      className={`p-3 rounded-md cursor-pointer ${
                        selectedStore?.id === store.id ? "bg-primary/10 border border-primary/30" : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedStore(store)}
                    >
                      <h4 className="font-medium">{store.name}</h4>
                      <p className="text-sm text-gray-500">
                        {store.city}, {store.state}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map and store details */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Store Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Map container */}
            <div ref={mapContainerRef} className="w-full h-[300px] bg-gray-100 rounded-md">
              {!mapLoaded && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Loading map...</p>
                  <p className="text-xs text-gray-400 mt-2">Loading Mapbox map...</p>
                </div>
              )}
            </div>

            {/* Selected store details */}
            {selectedStore ? (
              <div className="border rounded-md p-4">
                <h3 className="text-xl font-medium">{selectedStore.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Address</h4>
                    <p>{selectedStore.address}</p>
                    <p>
                      {selectedStore.city}, {selectedStore.state} {selectedStore.zipCode}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Contact</h4>
                    <p>{selectedStore.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-sm text-gray-500">Hours</h4>
                    <p>{selectedStore.hours}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Button className="mt-2">Get Directions</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border rounded-md p-4 text-center">
                <p className="text-gray-500">Select a store to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

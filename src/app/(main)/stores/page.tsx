"use client";

import { StoreFinder } from "@/components/about-us/store-finder";

export default function StoresPage() {
  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Store Finder</h1>
        <p className="text-gray-500 mt-2">Find healthy food stores near you</p>
      </div>
      <StoreFinder />
    </div>
  );
}

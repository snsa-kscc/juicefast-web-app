"use client";

import { StoreFinder } from "./store-finder";

export function AboutUs() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Store Finder</h1>
      </div>
      <StoreFinder />
    </div>
  );
}

// Navigation data for the mobile navigation component
import { Home, Activity, Store, Heart, User, MessageCircle } from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: any; // Using any type to avoid TypeScript issues
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Tracker", href: "/tracker", icon: Activity },
  { name: "Store", href: "/stores", icon: Store },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "JF Club", href: "/wellness", icon: Heart },
];

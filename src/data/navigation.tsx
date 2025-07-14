// Navigation data for the mobile navigation component
import React from "react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.FC;
}

// Custom SVG icons
const HomeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.5 20.5002C8.60457 20.5002 9.5 19.6048 9.5 18.5002V16.0002C9.5 14.6192 10.619 13.5002 12 13.5002C13.381 13.5002 14.5 14.6192 14.5 16.0002V18.5002C14.5 19.6048 15.3954 20.5002 16.5 20.5002H18C19.1046 20.5002 20 19.6048 20 18.5002V11.9143C20 11.3843 19.789 10.8752 19.414 10.5002L12.707 3.79325C12.316 3.40225 11.683 3.40225 11.293 3.79325L4.586 10.5002C4.211 10.8752 4 11.3843 4 11.9143V18.5003C4 19.6048 4.89543 20.5002 6 20.5002H7.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeartIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M20.84 4.60987C20.3292 4.09888 19.7228 3.69352 19.0554 3.41696C18.3879 3.14039 17.6725 2.99805 16.95 2.99805C16.2275 2.99805 15.5121 3.14039 14.8446 3.41696C14.1772 3.69352 13.5708 4.09888 13.06 4.60987L12 5.66987L10.94 4.60987C9.9083 3.57818 8.50903 2.99858 7.05 2.99858C5.59096 2.99858 4.19169 3.57818 3.16 4.60987C2.1283 5.64156 1.54871 7.04084 1.54871 8.49987C1.54871 9.95891 2.1283 11.3582 3.16 12.3899L12 21.2299L20.84 12.3899C21.351 11.8791 21.7563 11.2727 22.0329 10.6052C22.3095 9.93777 22.4518 9.22236 22.4518 8.49987C22.4518 7.77738 22.3095 7.06198 22.0329 6.39452C21.7563 5.72706 21.351 5.12063 20.84 4.60987Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StoreIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.31002 6.527L6.40002 3.787C6.77802 3.291 7.36602 3 7.99002 3H16.01C16.634 3 17.222 3.291 17.6 3.787L19.69 6.527C19.956 6.875 20.1 7.302 20.1 7.74V19C20.1 20.105 19.205 21 18.1 21H5.90002C4.79502 21 3.90002 20.105 3.90002 19V7.74C3.90002 7.302 4.04402 6.876 4.31002 6.527Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M4.02002 7.07031H19.98" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChatIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M9 20.9995L14 16.9785" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 17V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M9 17H8C5.239 17 3 14.761 3 12V8C3 5.239 5.239 3 8 3H16C18.761 3 21 5.239 21 8V12C21 14.761 18.761 17 16 17H14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WellnessIcon: React.FC = () => (
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12.75" cy="8.5" r="5.5" stroke="#0C0C0D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M17.9983 10.1484C20.2921 10.6805 21.9924 12.6144 22.2262 14.9575C22.4601 17.3006 21.1757 19.5325 19.0322 20.5074C16.8888 21.4824 14.3625 20.9839 12.75 19.2678"
      stroke="#0C0C0D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.50162 10.1484C5.30257 10.6643 3.64339 12.4736 3.31944 14.709C2.9955 16.9444 4.07282 19.1502 6.03497 20.2691C7.99712 21.388 10.4442 21.1919 12.203 19.7747C13.9619 18.3576 14.6741 16.0083 13.9982 13.853"
      stroke="#0C0C0D"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12.75" cy="7" r="2" fill="#0C0C0D" />
    <circle cx="8.25" cy="15.5" r="1.5" fill="#0C0C0D" />
    <circle cx="17.75" cy="15" r="1" fill="#0C0C0D" />
  </svg>
);

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  { name: "Tracker", href: "/tracker", icon: HeartIcon },
  { name: "Store", href: "/stores", icon: StoreIcon },
  { name: "Chat", href: "/chat", icon: ChatIcon },
  { name: "JF Club", href: "/wellness", icon: WellnessIcon },
];

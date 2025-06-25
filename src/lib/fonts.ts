import localFont from "next/font/local";

export const Lufga = localFont({
  src: [
    {
      path: "../../public/fonts/LufgaLightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/LufgaRegular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/LufgaItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/LufgaBold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/LufgaBoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});

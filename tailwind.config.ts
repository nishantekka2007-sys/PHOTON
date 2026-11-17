import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}","./src/components/**/*.{js,ts,jsx,tsx,mdx}","./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {
    colors: {
      photon: {
        obsidian: "#F7F5EF", dark: "#EFECE4", card: "#FBFAF7", elevated: "#FFFFFF",
        border: "#E5DFD4", subtle: "#D8D0C2", muted: "#8B8376", light: "#716A5E",
        ivory: "#292720", pure: "#292720"
      },
      warm: {50:"#FBFAF7",100:"#F7F5EF",200:"#EFECE4",300:"#E5DFD4",400:"#D8D0C2",500:"#B8AE9D",600:"#958B7B",700:"#716A5E",800:"#4D483F",900:"#292720",950:"#1C1A16"},
      accent: {gold:"#A88C58",amber:"#B58A45",titanium:"#8A877F",crimson:"#B94B48",emerald:"#43866A"}
    },
    fontFamily:{serif:["Cormorant Garamond","Georgia","Baskerville","Cambria","serif"],sans:["-apple-system","BlinkMacSystemFont","SF Pro Display","Inter","Helvetica Neue","Arial","sans-serif"],mono:["SF Mono","Menlo","Monaco","Consolas","monospace"]},
    letterSpacing:{widest:".25em",cinema:".18em"},
    boxShadow:{cinema:"0 20px 50px rgba(55,48,37,.14)",soft:"0 10px 30px rgba(55,48,37,.08)",inset:"inset 0 1px 1px rgba(255,255,255,.7)"}
  }},
  plugins:[]
};
export default config;

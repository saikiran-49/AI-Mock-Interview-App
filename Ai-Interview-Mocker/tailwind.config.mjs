/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class", // Enable dark mode
	content: [
	  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
	  "./components/**/*.{js,ts,jsx,tsx,mdx}",
	  "./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
	  extend: {
		colors: {
		  primary: "hsl(var(--primary))", // Add primary color from CSS variable
		  border: "hsl(var(--border))", 
		  background: "hsl(var(--background))", // Reference background variable
		  foreground: "hsl(var(--foreground))", // Reference foreground variable
		},
	  },
	},
	plugins: [],
  };
  
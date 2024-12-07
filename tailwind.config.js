import { nextui } from "@nextui-org/theme";

/** @type { import("tailwindcss").Config } */
export default {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	plugins: [nextui()],
	theme: {
		extend: {},
	},
};
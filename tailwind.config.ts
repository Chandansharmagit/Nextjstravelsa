import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#1F6F78", // Teal / Blue-Green
                secondary: "#F7931E", // Orange / Sunset
                accent: "#8BC34A", // Light Green
                dark: "#1a1a1a",
                light: "#f5f5f5",
                christmas: {
                    red: "#D32F2F",
                    green: "#1B5E20",
                    gold: "#FFD700",
                    snow: "#FFFFFF",
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                playfair: ['var(--font-playfair)', 'serif'],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            },
            boxShadow: {
                'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            keyframes: {
                sway: {
                    '0%, 100%': { transform: 'rotate(-5deg)' },
                    '50%': { transform: 'rotate(5deg)' },
                },
                twinkle: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
                'fly-across': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100vw)' },
                },
                'candy-stripe': {
                    '0%': { backgroundPosition: '0 0' },
                    '100%': { backgroundPosition: '40px 40px' },
                }
            },
            animation: {
                sway: 'sway 3s ease-in-out infinite',
                twinkle: 'twinkle 2s ease-in-out infinite',
                'fly-across': 'fly-across 20s linear infinite',
                'candy-stripe': 'candy-stripe 1s linear infinite',
            },
        },
    },
    plugins: [],
};
export default config;

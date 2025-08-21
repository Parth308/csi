  import type { Config } from "tailwindcss";

  const config: Config = {
    darkMode: ["class"],
    content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: "#60A5FA",  // Main actions/buttons - light blue
            dark: "#7DD3FC",     // Slightly darker but still light blue
            light: "#BFDBFE",    // Very light blue
          },
          background: {
            light: "#F0F9FF",    // Subtle blue tinted background
            lighter: "#F8FAFC",  // Nearly white with slight blue tint
            DEFAULT: "#FFFFFF",  // Pure white
          },
          text: {
            DEFAULT: "#60A5FA",  // Light blue text for headers
            secondary: "#7DD3FC", // Slightly darker light blue for emphasis
            accent: "#93C5FD",   // Another light blue shade for accents
          },
          // Status colors in light pastel shades
          status: {
            success: "#A7F3D0",  // Very light green
            error: "#FCA5A5",    // Light red
            warning: "#FDE68A",  // Light yellow
            info: "#BFDBFE",     // Very light blue
          }
        },
        backgroundImage: {
          'gradient-primary': 'linear-gradient(to right, #60A5FA, #7DD3FC)',
          'gradient-accent': 'linear-gradient(to right, #7DD3FC, #BFDBFE)',
          'gradient-light': 'linear-gradient(to bottom, #F0F9FF, #FFFFFF)',
        },
        animation: {
          'float': 'float 6s ease-in-out infinite',
          'pulse-slow': 'pulse 4s ease-in-out infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
          }
        },
        boxShadow: {
          'soft': '0 4px 6px -1px rgba(96, 165, 250, 0.1), 0 2px 4px -1px rgba(96, 165, 250, 0.06)',
          'card': '0 10px 15px -3px rgba(96, 165, 250, 0.1), 0 4px 6px -2px rgba(96, 165, 250, 0.06)',
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)'
        }
      },
    },
    plugins: [require("tailwindcss-animate")],
  };

  export default config;
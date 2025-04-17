/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enables dark mode with the .dark class
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
          light: 'rgb(var(--color-secondary-light) / <alpha-value>)',
          dark: 'rgb(var(--color-secondary-dark) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          light: 'rgb(var(--color-accent-light) / <alpha-value>)',
          dark: 'rgb(var(--color-accent-dark) / <alpha-value>)',
        },
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        highlight: 'rgb(var(--color-highlight) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)',
      },
      fontFamily: {
        bebas: ['var(--font-bebas)'],
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
}
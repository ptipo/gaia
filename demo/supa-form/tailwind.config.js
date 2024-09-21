const { tailwindTransform } = require('postcss-lit');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: {
        files: ['./src/**/*.{ts,js,css,vue}', './configurator.html'],
        transform: {
            ts: tailwindTransform,
        },
    },
    theme: {
        fontFamily: {
            sans: [],
        },
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                ffadeInUp: {
                    '0%': { opacity: 0, transform: 'translate3d(0, 12px, 0)' },
                    '100%': { opacity: 1, transform: 'none' },
                },
            },
        },
    },
    darkMode: 'selector',
    plugins: [require('@tailwindcss/forms')],
};

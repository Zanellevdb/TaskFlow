"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',
                secondary: '#10b981',
                accent: '#f59e0b',
                danger: '#ef4444',
                surface: '#f9fafb',
                border: '#e5e7eb',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};
exports.default = config;

import type {Config} from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
	darkMode: 'class',
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			keyframes: {
				'fade-in': {
					'0%': {opacity: '0'},
					'100%': {opacity: '1'},
				},
				'fade-in-infinite': {
					'0%': {opacity: '0.2'},
					'50%': {opacity: '1'},
					'100%': {opacity: '0.2'},
				},
			},
			animation: {
				'fade-in': 'fade-in 300ms linear',
				'fade-in-infinite': 'fade-in-infinite 2s linear infinite',
			},
			fontFamily: {
				'ubuntu-sans': 'Ubuntu Sans',
				'ubuntu-sans-mono': 'Ubuntu Sans Mono',
				inter: 'inter',
				poppins: 'poppins',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			colors: {
				'black-dark': '#050505',
				'black-main': '#151515',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
			},
		},
	},
	plugins: [
		plugin(({addVariant, addUtilities}) => {
			addVariant('no-hover', '@media (hover: none)');
			addUtilities({
				'.flex-center': {
					display: 'flex',
					'justify-content': 'center',
					'align-items': 'center',
				},
			});
		}),
	],
} satisfies Config;

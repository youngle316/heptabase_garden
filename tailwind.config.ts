import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      writingMode: {
        'vertical-rl': 'vertical-rl',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ({ addUtilities }: any) => {
      addUtilities({
        '.writing-vertical-rl': {
          'writing-mode': 'vertical-rl',
        },
      });
    },
  ],
  safelist: [
    // 自动包含所有颜色的 text 和 bg 类
    {
      pattern: /(bg|text)-\w+-[1-9]00/,
    },
  ],
} satisfies Config;

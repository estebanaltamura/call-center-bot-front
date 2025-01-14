// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontSize: {
        title1: ['2.5rem', { lineHeight: '3rem', fontWeight: '700' }],
        title2: ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        title3: ['1.75rem', { lineHeight: '2.25rem', fontWeight: '600' }],
        title4: ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        body1: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '400' }],
        body2: ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        body3: ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        body4: ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
        caption: ['0.625rem', { lineHeight: '0.875rem', fontWeight: '400' }],
        overline: ['0.625rem', { lineHeight: '1rem', fontWeight: '700', letterSpacing: '0.1em' }],
      },
      colors: {
        primary: '#1D4ED8', // Color principal
        secondary: '#9333EA', // Color secundario
        accent: '#F59E0B', // Color de acento
        neutral: '#374151', // Color neutral
        background: '#F3F4F6', // Fondo
        error: '#EF4444', // Color para mensajes de error
        success: '#10B981', // Color para mensajes de éxito
        warning: '#FBBF24', // Color para mensajes de advertencia
      },
      spacing: {
        xs: '0.25rem', // 4px
        sm: '0.5rem', // 8px
        md: '1rem', // 16px
        lg: '2rem', // 32px
        xl: '4rem', // 64px
        '2xl': '8rem', // 128px
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem', // 2px
        md: '0.375rem', // 6px
        lg: '0.5rem', // 8px
        xl: '1rem', // 16px
        full: '9999px', // Full rounded corners
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        none: 'none',
      },
      maxWidth: {
        xs: '20rem', // 320px
        sm: '24rem', // 384px
        md: '28rem', // 448px
        lg: '32rem', // 512px
        xl: '36rem', // 576px
        '2xl': '42rem', // 672px
        full: '100%',
      },
      transitionProperty: {
        width: 'width',
        spacing: 'margin, padding',
      },
      zIndex: {
        auto: 'auto',
        0: 0,
        10: 10,
        20: 20,
        30: 30,
        40: 40,
        50: 50,
      },
    },
  },
  plugins: [],
};

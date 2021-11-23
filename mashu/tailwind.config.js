module.exports = {
  //mode: 'jit',
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/component/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      'dark-primary': '#131a1c',
      'dark-secondary': '#1b2224',
      aqua: '#51a39f',
      red: '#e74c4c',
      pink: '#d17287',
      green: '#6bb05d',
      yellow: '#e59e67',
      blue: '#58acc4',
      purple: '#cd69cc',
      white: '#c4c4c4',
    },
  },
  variants: {
    animation: ['responsive', 'motion-safe', 'motion-reduce'],
    extend: {},
  },
  plugins: [],
};

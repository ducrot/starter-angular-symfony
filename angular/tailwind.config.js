module.exports = {
  important: true,
  content: [
    "./src/**/*.{html,js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // https://javisperez.github.io/tailwindcolorshades/?brand=cc1f2f
        'brand': {
          '50': '#fcf4f5',
          '100': '#fae9ea',
          '200': '#f2c7cb',
          '300': '#eba5ac',
          '400': '#db626d',
          '500': '#cc1f2f',
          '600': '#b81c2a',
          '700': '#991723',
          '800': '#7a131c',
          '900': '#640f17'
        }
      },
    },
  },
  plugins: [],
}

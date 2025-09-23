import {createTheme, rem} from "@mantine/core";

const theme = createTheme({
  fontFamily: "Inter, Helvetica Neue, helvetica, sans-serif",
  headings: {
    fontFamily: "Inter, Helvetica Neue, helvetica, sans-serif",
    // sizes: {
    //   h1: {
    //     fontSize: rem(22),
    //     fontWeight: 600
    //   },
    // h2: {
    //   fontSize: rem(18),
    //   fontWeight: 600,
    // },
    // h3: {
    //   fontSize: rem(14),
    //   fontWeight: 700
    // },
    // h4: {
    //   fontSize: rem(14),
    //   fontWeight: 500
    // },
    // h6: {
    //   fontSize: rem(12),
    //   fontWeight: 500
    // }
    // }
  },
  colors: {
    highlight: [
      "#fa95ff", // highlight-6 (pink/lightest)
      "#d4c5ff", // highlight-12 (lavender)
      "#bb6bd9", // highlight-4 (medium purple)
      "#c07cff", // highlight-1 (medium-dark purple)
      "#ba8fe2", // highlight-5 (darker lavender)
      "#a81c9f", // highlight-9 (dark pink)
      "#9b51e0", // highlight-2 (deep purple)
      "#791cd0", // highlight-3 (even deeper purple)
      "#7025d0", // highlight-7 (darkest purple)
      "#286bd7", // highlight-8 (a dark blue, placed here for contrast)
    ],

    // A unified palette for blues used for icons and other elements.
    icon: [
      "#56ccf2", // icon-light-1 (light cyan)
      "#2d9cdb", // icon-light-2 (medium blue)
      "#13887b", // highlight-10 (teal, grouped with icons)
      "#286bd7", // highlight-8 (deeper blue)
    ],

    // Neutral tones for text, divided into light and dark themes.
    neutral: [
      // Light theme text colors
      "#aaadb2", // text-light-5 (light gray)
      "#a9a9a9", // text-light-6 (gray)
      "#465465", // text-light-3 (dark gray)
      "#434343", // text-light-4 (dark gray)
      "#505050", // text-light-8 (dark gray)
      "#222", // text-light-11 (dark gray)
      "#272727", // text-light-12 (dark gray)
      "#46556c", // text-light-9 (dark blue-gray)
      "#11243e", // text-light-2 (darker blue-gray)
      "#000", // text-light-1 (black)
    ],

    // Dark theme text colors
    darkText: [
      "#d9d9d9", // text-dark-2 (light gray)
      "#959595", // text-dark-6 (medium gray)
      "#949494", // text-dark-3 (medium gray)
      "#7f7f7f", // text-dark-5 (medium gray)
      "#545454", // text-dark-7 (dark gray)
      "#11243e", // text-dark-4 (dark blue-gray)
      "#fff", // text-dark-1 (white)
    ],

    // Backgrounds for both light and dark themes.
    background: [
      "#f7f9fc", // background-light-1 (lightest gray)
      "#f5f5f5", // background-light-4 (light gray)
      "#efecf4", // background-light-5 (light gray with purple tint)
      "#e3e3e3", // background-light-7 (light gray)
      "#d9d9d9", // background-light-6 (medium gray)
      "#dedede", // background-light-3 (medium gray)
      "#fff", // background-light-2 (white)
      "#0d0d0e", // background-dark-1 (darkest gray/black)
      "#1a1a1a", // background-dark-2 (dark gray)
      "#1c1d22", // background-dark-7 (dark gray)
      "#2e2e2e", // background-dark-3 (dark gray)
      "#262240", // background-dark-5 (dark blue/purple)
      "#000", // background-dark-6 (black)
    ],
  },

  // Use the "other" property for one-off values that don't fit into a palette.
  other: {
    colorHighlight11: "#665b83",
    colorHighlight12: "#d4c5ff",
    colorIconDark1: "#000",
    colorIconDark2: "#fff",
    colorTextLight10: "rgba(255, 255, 255, 0.8)",
    colorTextLightHighlight: "var(--mantine-color-highlight-6)",
    colorTextDarkHighlight: "var(--mantine-color-icon-0)",
    // Gradients, shadows, and other non-color values
    gradientFooterLight: "linear-gradient(180deg, rgb(155 81 224 / 0%) 0%, rgb(155 81 224 / 10%) 100%)",
    gradientFooterDark: "linear-gradient(180deg, rgb(41 17 64 / 0%) 0%, rgb(41 17 64 / 50%) 100%)",
    gradientFeaturesBanner: "linear-gradient(180deg, #471671 0%, #371870 100%)",
    shadowColor: "rgb(0 0 0 / 25%)",
    textShadowDark: "3px 3px 20px var(--mantine-other-shadow-color)"
  }
});

export default theme;

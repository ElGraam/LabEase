import { extendTheme } from "@chakra-ui/react";

/** Chakra UIのカスタムテーマ */
const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        color: "app.text",
        overflowX: "clip",
      },
    },
  },
  colors: {
    app: {
      blue: "#3182CE",
      bg: "#F7FAFC",
      border: "#E2E8F0",
      text: "#333",
      disable: "#A0AEC0",
    },
  },
  fontSizes: {
    app: {
      header1: "24px",
      header2: "20px",
    },
  },
});

export default theme;

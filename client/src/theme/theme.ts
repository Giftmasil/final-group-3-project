import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    purplebg: "#5718a9",
    purplebtn: "#9747FF",
    darkgreytxt: "#333333",
    300: "#7ebeff",
    400: "#5aaaed",
    500: "#3887db",
    600: "#2769a9",
    700: "#174877",
    800: "#082646",
    900: "#00121e",
  },
};

const theme = extendTheme({ colors });

export default theme;

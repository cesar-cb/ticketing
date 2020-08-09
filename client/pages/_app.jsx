import { ThemeProvider, CSSReset, theme } from '@chakra-ui/core';

export default ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

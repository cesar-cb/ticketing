import { ThemeProvider, CSSReset, theme, DarkMode, Box } from '@chakra-ui/core';
import Header from '../components/Header';
import request from '../api/request';

const config = theme => ({
  light: {
    color: theme.colors.gray[700],
    bg: theme.colors.gray[50],
    borderColor: theme.colors.gray[200],
    placeholderColor: theme.colors.gray[500],
  },
  dark: {
    color: theme.colors.whiteAlpha[900],
    bg: theme.colors.gray[800],
    borderColor: theme.colors.whiteAlpha[300],
    placeholderColor: theme.colors.whiteAlpha[400],
  },
});

const App = ({ Component, pageProps, currentUser }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box maxWidth="1200px" m="0 auto">
        <DarkMode>
          <CSSReset config={config} />
          <Header currentUser={currentUser} />
          <Component {...pageProps} />
        </DarkMode>
      </Box>
    </ThemeProvider>
  );
};

App.getInitialProps = async appContext => {
  const client = request(appContext.ctx);

  const { data } = await client.get('/api/users/current');

  let pageProps = {};

  const componentGetInitialProps = appContext.Component.getInitialProps;

  if (componentGetInitialProps) {
    pageProps = await componentGetInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default App;

import PropTypes from 'prop-types';
import { ThemeProvider, CSSReset, theme, DarkMode, Box } from '@chakra-ui/core';
import Header from '../components/Header';
import request from '../api/request';

const config = themeConfig => ({
  light: {
    color: themeConfig.colors.gray[700],
    bg: themeConfig.colors.gray[50],
    borderColor: themeConfig.colors.gray[200],
    placeholderColor: themeConfig.colors.gray[500],
  },
  dark: {
    color: themeConfig.colors.whiteAlpha[900],
    bg: themeConfig.colors.gray[800],
    borderColor: themeConfig.colors.whiteAlpha[300],
    placeholderColor: themeConfig.colors.whiteAlpha[400],
  },
});

const App = ({ Component, pageProps, currentUser }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box maxWidth="1200px" m="0 auto">
        <DarkMode>
          <CSSReset config={config} />
          <Header currentUser={currentUser} />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component currentUser={currentUser} {...pageProps} />
        </DarkMode>
      </Box>
    </ThemeProvider>
  );
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
  currentUser: PropTypes.shape({
    email: PropTypes.string.isRequired,
    iat: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
  }),
};

App.defaultProps = {
  currentUser: {},
};

App.getInitialProps = async appContext => {
  const client = request(appContext.ctx);

  const { data } = await client.get('/api/users/current');

  let pageProps = {};

  const componentGetInitialProps = appContext.Component.getInitialProps;

  if (componentGetInitialProps) {
    pageProps = await componentGetInitialProps(
      appContext.ctx,
      client,
      data.currentUser,
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default App;

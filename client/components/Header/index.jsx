import PropTypes from 'prop-types';
import { Box, Image, Flex, Button, Link, Text } from '@chakra-ui/core';
import NextLink from 'next/link';
import Router from 'next/router';

import ticketing from '../../assets/ticketing.svg';
import useRequest from '../../hooks/useRequest';

const Unlogged = () => (
  <>
    <NextLink href="/auth/signin" passHref>
      <Button as="a" marginRight="15px">
        Signin
      </Button>
    </NextLink>
    <NextLink href="/auth/signup" passHref>
      <Button variantColor="teal" as="a">
        Signup
      </Button>
    </NextLink>
  </>
);

const Logged = ({ email, signout }) => (
  <>
    <Text fontSize="md" as="b" marginRight="15px">
      {email}
    </Text>
    <Button variantColor="red" onClick={signout}>
      Logout
    </Button>
  </>
);

const Header = ({ currentUser }) => {
  const { request } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    onSuccess: () => Router.push('/'),
  });

  return (
    <Box p="2em">
      <Flex alignItems="center" justifyContent="space-between">
        <NextLink href="/">
          <Image src={ticketing} alt="Ticketing" cursor="pointer" />
        </NextLink>
        <Flex alignItems="center">
          {currentUser ? (
            <Logged email={currentUser.email} signout={request} />
          ) : (
            <Unlogged />
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

Logged.propTypes = {
  email: PropTypes.string.isRequired,
  signout: PropTypes.func.isRequired,
}

export default Header;

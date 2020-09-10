import { useState } from 'react';

import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Flex,
  Box,
  Alert,
  AlertIcon,
  Stack,
  Heading,
} from '@chakra-ui/core';

import Head from 'next/head';
import { useRouter } from 'next/router';

import useRequest from '../../hooks/useRequest';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const { request, data, errors } = useRequest({
    method: 'post',
    url: '/api/users/signup',
    body: { email, password },
    onSuccess: () => router.push('/'),
  });

  return (
    <Flex justifyContent="center" alignItems="center">
      <Head>
        <title>Ticketing — Signup</title>
      </Head>

      <Box
        w={['100%', '70%']}
        padding={['0 2em', '50px']}
        marginTop={['80px', '100px']}
        bg="gray.900"
        rounded="lg"
      >
        <Heading>Signup</Heading>

        <Box m="18px 0 32px">
          <Stack spacing={3}>
            {errors.map(error => (
              <Alert status="error" key={error.field}>
                <AlertIcon />
                {error.message}
              </Alert>
            ))}
          </Stack>
        </Box>

        <FormControl>
          <form onSubmit={request}>
            <FormLabel htmlFor="email">Email address</FormLabel>

            <Input
              type="email"
              id="email"
              aria-describedby="email-helper-text"
              onChange={e => setEmail(e.target.value)}
              autoFocus
              focusBorderColor="teal.100"
            />

            <FormHelperText id="email-helper-text">
              We'll never share your email.
            </FormHelperText>

            <FormLabel htmlFor="password" marginTop="20px">
              Password
            </FormLabel>

            <Input
              type="password"
              id="password"
              aria-describedby="password-helper-text"
              onChange={e => setPassword(e.target.value)}
              focusBorderColor="teal.100"
            />

            <Button
              mt={4}
              w="100%"
              variantColor="teal"
              isLoading={false}
              type="submit"
            >
              Submit
            </Button>
          </form>
        </FormControl>
      </Box>
    </Flex>
  );
};

export default Signup;

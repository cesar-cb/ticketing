import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/core';
import IntlCurrencyInput from 'react-intl-currency-input';

import useRequest from '../../hooks/useRequest';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const router = useRouter();

  const { request, errors } = useRequest({
    method: 'post',
    url: '/api/tickets',
    body: { title, price },
    onSuccess: ticket => {
      console.log(ticket);
      router.push('/');
    },
  });

  return (
    <Flex justifyContent="center" alignItems="center">
      <Head>
        <title>Ticketing — New Ticket</title>
      </Head>

      <Box
        w={['100%', '70%']}
        padding={['2em', '50px']}
        marginTop={['30px', '100px']}
        bg="gray.900"
        rounded="lg"
      >
        <Heading>Create New Ticket</Heading>

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
          <form onSubmit={event => request({ event })}>
            <FormLabel htmlFor="email">Title</FormLabel>

            <Input
              type="text"
              id="title"
              aria-describedby="title-helper-text"
              onChange={e => setTitle(e.target.value)}
              focusBorderColor="teal.100"
              autoFocus
            />

            <FormLabel htmlFor="password" marginTop="20px">
              Price
            </FormLabel>

            <IntlCurrencyInput
              type="text"
              id="price"
              aria-describedby="price-helper-text"
              onChange={(_, v) => setPrice(v)}
              focusBorderColor="teal.100"
              component={Input}
              value={price}
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

export default NewTicket;

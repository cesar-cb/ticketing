import { Heading, Box } from '@chakra-ui/core';
import Head from 'next/head';

const Home = ({ currentUser, tickets }) => {
  console.log(tickets);

  return (
    <>
      <Head>
        <title>Ticketing</title>
      </Head>

      {tickets.map(ticket => (
        <Box
          bg="gray.900"
          color="white"
          borderWidth="1px"
          rounded="lg"
          overflow="hidden"
          p="15px"
          mb="15px"
        >
          <Box
            mt="1"
            mb="10px"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            {ticket.title}
          </Box>

          <Box>$ {ticket.price}</Box>
        </Box>
      ))}

      {currentUser ? <Heading>You're logged in</Heading> : null}
    </>
  );
};

Home.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default Home;

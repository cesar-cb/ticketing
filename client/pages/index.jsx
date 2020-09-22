import PropTypes from 'prop-types';
import { Box } from '@chakra-ui/core';
import Head from 'next/head';
import NextLink from 'next/link';

const Home = ({ tickets }) => {
  return (
    <>
      <Head>
        <title>Ticketing</title>
      </Head>

      {tickets.map(ticket => (
        <NextLink
          href="/tickets/[ticketId]"
          as={`/tickets/${ticket.id}`}
          passHref
          key={ticket.id}
        >
          <Box
            as="a"
            bg="gray.900"
            borderWidth="1px"
            color="white"
            display="block"
            mb="15px"
            overflow="hidden"
            p="15px"
            rounded="lg"
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

            <Box>
              <span>$ </span>
              {ticket.price}
            </Box>
          </Box>
        </NextLink>
      ))}
    </>
  );
};

Home.propTypes = {
  tickets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      orderId: PropTypes.string,
      price: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      version: PropTypes.number.isRequired,
    }).isRequired,
  ),
};

Home.defaultProps = {
  tickets: [],
};

Home.getInitialProps = async (_, client) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default Home;

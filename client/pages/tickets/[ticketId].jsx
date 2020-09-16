import { Alert, AlertIcon, Box, Button, Stack, Text } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/useRequest';

const TicketShow = ({ ticket }) => {
  const router = useRouter();

  const { request, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: order => router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  console.log({ errors });

  return (
    <>
      {errors && (
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
      )}
      <Text fontSize="4xl">{ticket.title}</Text>
      <Text fontSize="2xl">Price: {ticket.price}</Text>
      <Button onClick={request} bg="green.300">
        Purchase
      </Button>
    </>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;

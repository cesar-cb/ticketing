import PropTypes from 'prop-types';
import { Alert, AlertIcon, Box, Stack } from '@chakra-ui/core';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import StripeCheckout from 'react-stripe-checkout';

import useRequest from '../../hooks/useRequest';

const OrderShow = ({ order, currentUser }) => {
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState(0);
  const { request, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const dateNow = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
      );
      const expiresAt = new Date(
        new Date(order.expiresAt).toLocaleString('en-US', { timeZone: 'UTC' }),
      );

      const secondsLeft = Math.round(Math.max((expiresAt - dateNow) / 1000, 0));

      setTimeLeft(secondsLeft);
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, []);

  if (timeLeft === 0) return <h1>Order expired</h1>;

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
      <h1>
        Left:
        {timeLeft}
      </h1>
      <StripeCheckout
        token={({ id: token }) => request({ body: { token } })}
        stripeKey="pk_test_yEvWo8W9yBhRo6HjtdM2oQAs"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </>
  );
};

OrderShow.propTypes = {
  order: PropTypes.shape({
    expiresAt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    ticket: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      orderId: PropTypes.string,
      version: PropTypes.number.isRequired,
    }).isRequired,
    userId: PropTypes.string.isRequired,
    version: PropTypes.number.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;

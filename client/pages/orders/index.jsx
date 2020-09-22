import PropTypes from 'prop-types';
import { List, ListItem } from '@chakra-ui/core';

const OrderIndex = ({ orders }) => {
  return (
    <List styleType="disc">
      {orders.map(order => {
        return (
          <ListItem key={order.id}>
            {order.ticket.title}
            <span>-</span>
            {order.status}
          </ListItem>
        );
      })}
    </List>
  );
};

OrderIndex.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
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
  ),
};

OrderIndex.defaultProps = {
  orders: [],
};

OrderIndex.getInitialProps = async (_, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default OrderIndex;

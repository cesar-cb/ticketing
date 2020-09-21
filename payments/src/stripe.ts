import Stripe from 'stripe';

if (!process.env.STRIPE_KEY) throw new Error('Missing STRIPE_KEY env');

export default new Stripe(process.env.STRIPE_KEY, {
  apiVersion: '2020-08-27',
});

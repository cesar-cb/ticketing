import { Heading } from '@chakra-ui/core';
import Head from 'next/head';
import request from '../api/request';

const Home = ({ currentUser }) => {
  return (
    <>
      <Head>
        <title>Ticketing</title>
      </Head>
      {currentUser ? <Heading>You're logged in</Heading> : null}
    </>
  );
};

Home.getInitialProps = async context => {
  const { data } = await request(context).get('/api/users/current');

  return data;
};

export default Home;

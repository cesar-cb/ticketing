import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
} from '@chakra-ui/core';

const Signup = () => (
  <FormControl>
    <FormLabel htmlFor="email">Email address</FormLabel>
    <Input type="email" id="email" aria-describedby="email-helper-text" />
    <FormHelperText id="email-helper-text">
      We'll never share your email.
    </FormHelperText>
    <FormLabel htmlFor="password">Password</FormLabel>
    <Input
      type="password"
      id="password"
      aria-describedby="password-helper-text"
    />
    <Button mt={4} variantColor="teal" isLoading={false} type="submit">
      Submitt
    </Button>
  </FormControl>
);

export default Signup;

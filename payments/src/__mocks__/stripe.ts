jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => {
    return {
      charges: {
        create: () => 'fake stripe response',
      },
    };
  });
});

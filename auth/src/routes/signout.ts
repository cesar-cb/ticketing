import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  res.send({ OK: true });
});

export default router;

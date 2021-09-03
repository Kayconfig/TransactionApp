import { Router, Request, Response } from 'express';
import {
  transferAmount,
  getAllAccountBalance,
  getBalance,
} from '../controllers/balanceController';

const router = Router();
router.post('/transfer', transferAmount);
router.get('/', getAllAccountBalance);
router.get('/:account', getBalance);
//handle every other route
router.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    msg: "The route you're trying to access, can't be serviced.",
  });
});

export default router;

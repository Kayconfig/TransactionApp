import { Router, Response, Request } from 'express';
import { createNewAccount } from '../controllers/balanceController';

const router = Router();
router.post('/', createNewAccount);
router.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    msg: "The route you're trying to access, can't be serviced.",
  });
});
export default router;

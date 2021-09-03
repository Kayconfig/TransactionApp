import { Router, Response, Request } from 'express';
import {
  findAllTransactions,
  findTransactionByReference,
  deleteTransactionById,
} from '../controllers/transactionController';

const router = Router();
router.get('/', findAllTransactions);
router.get('/:reference', findTransactionByReference);
router.delete('/:reference', deleteTransactionById);
//every other http request methods and route resolves to ...
router.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    msg: "The route you're trying to access, can't be serviced.",
  });
});

export default router;

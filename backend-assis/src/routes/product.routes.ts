import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createProductSchema,
  updateProductSchema,
  statusSchema,
  querySchema,
} from '../schemas/product.schema.js';
import { asyncHandler } from '../middlewares/async-handler.js';

const router = Router();

router.get('/', validate(querySchema, 'query'), asyncHandler(productController.getAll));
router.get('/:id', asyncHandler(productController.getById));
router.post('/', validate(createProductSchema), asyncHandler(productController.create));
router.put('/:id', validate(updateProductSchema), asyncHandler(productController.update));
router.delete('/:id', asyncHandler(productController.remove));
router.patch('/:id/status', validate(statusSchema), asyncHandler(productController.changeStatus));
router.get('/:id/history', asyncHandler(productController.getHistory));

export default router;

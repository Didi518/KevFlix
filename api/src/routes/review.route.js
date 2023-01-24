import express from 'express';
import { body } from 'express-validator';
import reviewController from '../controllers/review.controller.js';
import tokenMiddleware from '../middlewares/token.middleware.js';
import requestHandler from '../handlers/request.handler.js';

const router = express.Router({ mergeParams: true });

router.get('/', tokenMiddleware.auth, reviewController.getUserReviews);
router.post(
  '/',
  tokenMiddleware.auth,
  body('mediaId')
    .exists()
    .withMessage("L'identifiant du média est requis")
    .isLength({ min: 1 })
    .withMessage("L'identifiant du média ne peut rester vide"),
  body('content')
    .exists()
    .withMessage("Le contenu de l'avis est requis")
    .isLength({ min: 1 })
    .withMessage("Le contenu de l'avis ne peut rester vide"),
  body('mediaType')
    .exists()
    .withMessage('Le type de média est requis')
    .custom((type) => ['movie', 'tv'].includes(type))
    .withMessage('Le type est média est invalide'),
  body('mediaTitle').exists().withMessage('Le titre du média est requis'),
  body('mediaPoster').exists().withMessage('Les images du média sont requises'),
  requestHandler.validate,
  reviewController.create
);

router.delete('/:reviewId', tokenMiddleware.auth, reviewController.remove);

export default router;

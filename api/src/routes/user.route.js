import express from 'express';
import { body } from 'express-validator';
import favoriteController from '../controllers/favorite.controller.js';
import userController from '../controllers/user.controller.js';
import requestHandler from '../handlers/request.handler.js';
import userModel from '../models/user.model.js';
import tokenMiddleware from '../middlewares/token.middleware.js';

const router = express.Router();

router.post(
  '/signup',
  body('username')
    .exists()
    .withMessage('Le nom est requis')
    .isLength({ min: 8 })
    .withMessage('le nom doit faire au moins 8 caractères')
    .custom(async (value) => {
      const user = await userModel.findOne({ username: value });
      if (user) return Promise.reject('Le nom est déjà utilisé');
    }),
  body('password')
    .exists()
    .withMessage('Le mot de passe est requis')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit faire au moins 8 caractères'),
  body('confirmPassword')
    .exists()
    .withMessage('La confirmation du mot de passe est requise')
    .isLength({ min: 8 })
    .withMessage(
      'La confirmation du mot de passe doit faire au moins 9 caractères'
    )
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error('Les mots de passes ne correspondent pas');
      return true;
    }),
  body('displayName')
    .exists()
    .withMessage('Le pseudonyme est requis')
    .isLength({ min: 8 })
    .withMessage('Le pseudonyme doit faire au moins 8 caractères'),
  requestHandler.validate,
  userController.signup
);

router.post(
  '/signin',
  body('username')
    .exists()
    .withMessage('Le nom est requis')
    .isLength({ min: 8 })
    .withMessage('le nom doit faire au moins 8 caractères'),
  body('password')
    .exists()
    .withMessage('Le mot de passe est requis')
    .isLength({ min: 8 })
    .withMessage('le mot de passe doit faire au moins 8 caractères'),
  requestHandler.validate,
  userController.signin
);

router.put(
  '/update-password',
  tokenMiddleware.auth,
  body('password')
    .exists()
    .withMessage('Le mot de passe est requis')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit faire au moins 8 caractères'),
  body('newPassword')
    .exists()
    .withMessage('Le nouveau mot de passe est requis')
    .isLength({ min: 8 })
    .withMessage('Le nouveau mot de passe doit faire au moins 8 caractères'),
  body('confirmNewPassword')
    .exists()
    .withMessage('La confirmation du nouveau mot de passe est requise')
    .isLength({ min: 8 })
    .withMessage(
      'La confirmation du nouveau mot de passe doit faire au moins 8 caractères'
    )
    .custom((value, { req }) => {
      if (value !== req.body.newPassword)
        throw new Error('Les mots de passes ne correspondent pas');
      return true;
    }),
  requestHandler.validate,
  userController.updatePassword
);

router.get('/info', tokenMiddleware.auth, userController.getInfo);

router.get(
  '/favorites',
  tokenMiddleware.auth,
  favoriteController.getUserFavorite
);

router.post(
  '/favorites',
  tokenMiddleware.auth,
  body('mediaType')
    .exists()
    .withMessage('Le type de média est requis')
    .custom((type) => ['movie', 'tv'].includes(type))
    .withMessage('Le type est média est invalide'),
  body('mediaId')
    .exists()
    .withMessage("L'identifiant du média est requis")
    .isLength({ min: 1 })
    .withMessage("L'identifiant du média ne peut rester vide"),
  body('mediaTitle').exists().withMessage('Le titre du média est requis'),
  body('mediaPoster').exists().withMessage('Les images du média sont requises'),
  body('mediaRate').exists().withMessage('Les notes du média sont requises'),
  requestHandler.validate,
  favoriteController.addFavorite
);

router.delete(
  '/favorites/:favoriteId',
  tokenMiddleware.auth,
  favoriteController.removeFavorite
);

export default router;

import express, { Request, Response } from 'express';
import { check } from 'express-validator';
import { UploadedFile } from 'express-fileupload';

import { validationMiddleware } from '../middlewares/validationMiddleware';
import FriendsService from '../services/FriendsService';

const friendsRouter = express.Router();

const friendsService = new FriendsService();

/**
 * @swagger
 * /friends/{id}:
 *   get:
 *     summary: Get friend data by ID
 *     description: Get friend's name, phone and avatar in base64 format by ID
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric ID of the user to get
 *     responses:
 *      400:
 *        description: A friend with this id does not exist
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: Error message
 *      200:
 *        description: Friend data
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                      description: Friend's name
 *                      example: John
 *                    phone:
 *                      type: number
 *                      description: Friend's phone number
 *                      example: +79998882200
 *                    avatar:
 *                      type: string
 *                      description: Friend's avatar in base64 format
 *                      example: data:image/png;base64,...
 */
friendsRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  try {
    const data = friendsService.getFriend(Number(id));

    return res.status(200).send(JSON.stringify({ data }));
  } catch (error) {
    return res.status(error instanceof Error ? 400 : 500).send(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Something went wrong',
      })
    );
  }
});

/**
 * @swagger
 * /friends:
 *   post:
 *     summary: Add a new friend to the list
 *     description: Add a new friend to the list by his name, phone number and avatar
 *     requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Friend's name
 *                example: John
 *              phone:
 *                type: number
 *                description: Friend's phone number
 *                example: +79997770022
 *              avatar:
 *                type: image
 *                format: binary
 *                description: Friend avatar
 *     responses:
 *      400:
 *        description: Invalid request body
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: Error message
 *      200:
 *        description: Successfully adding a friend
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                result:
 *                  type: "Success"
 */
friendsRouter.post(
  '/',
  [
    check('name', 'Name is incorrect').isString(),
    check('phone', 'Phone number is incorrect')
      .isNumeric()
      .isLength({ min: 10, max: 14 })
      .toInt(),
    check('avatar', 'Avatar is incorrect').isBase64(),
    validationMiddleware,
  ],
  (req: Request, res: Response) => {
    const avatar = req.files?.avatar as UploadedFile;
    const regex = /(?<type>\w+)\/(?<subtype>[-+.\w]+)/u;
    const result = regex.exec(avatar.mimetype);

    if (!(result && result.groups?.subtype && result.groups?.type === 'image'))
      return res.status(400).send(JSON.stringify({ error: 'Incorrect data' }));

    friendsService.addFriend({
      name: req.body.name,
      phone: req.body.phone,
      avatar: req.body.avatar,
    });

    res.send(JSON.stringify({ result: 'Success' }));
  }
);

/**
 * @swagger
 * /friends/{id}:
 *   delete:
 *     summary: Remove friend from list
 *     description: Remove friend from list by ID
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric ID of the user to get
 *     responses:
 *      200:
 *        description: Successful removal of a friend
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                result:
 *                  type: "Success"
 */
friendsRouter.delete('/:id', (req, res) => {
  const { id } = req.params;

  friendsService.deleteFriend(Number(id));

  res.status(200).send(JSON.stringify({ result: 'Success' }));
});

export default friendsRouter;

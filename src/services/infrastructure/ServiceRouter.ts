import express from 'express';
import multer from 'multer';

import {
  createServiceController,
  deleteServiceController,
  updateServiceController,
  findAllServiceController,
  findByIdServiceController,
  findByProviderIdController,
  findByContentServiceController,
} from './dependencies';
import path from 'path';

export const serviceRouter = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/images-services/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);  },
});

const upload = multer({ storage });

serviceRouter.post('/',upload.array("images"), createServiceController.run.bind(createServiceController));
serviceRouter.delete('/:id', deleteServiceController.run.bind(deleteServiceController));
serviceRouter.patch('/:id', upload.array("images"), updateServiceController.run.bind(updateServiceController));
serviceRouter.get('/', findAllServiceController.run.bind(findAllServiceController));
serviceRouter.get('/:id', findByIdServiceController.run.bind(findByIdServiceController));
serviceRouter.get('/provider/:id', findByProviderIdController.run.bind(findByProviderIdController));
serviceRouter.post('/content/', findByContentServiceController.run.bind(findByContentServiceController));

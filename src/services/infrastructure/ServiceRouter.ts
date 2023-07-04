import express from 'express';
import multer from 'multer';
// import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
// import multerS3 from 'multer-s3';

dotenv.config(); // Cargar variables de entorno desde el archivo .env

import {
  createServiceController,
  deleteServiceController,
  updateServiceController,
  findAllServiceController,
  findByIdServiceController,
  findByProviderIdController,
} from './dependencies';
import path from 'path';

export const serviceRouter = express.Router();

// const s3Client  = new S3Client({
//   region: process.env.REGION_S3, // Ejemplo: "us-east-1"
//   credentials:{
//     accessKeyId: process.env.AccessKeyId!,
//     secretAccessKey: process.env.SecretAccessKey!,
//   },
// });
// export const uploadS3 = multer({
//   storage: multerS3({
//     s3: s3Client,
//     bucket: process.env.BUCKET_NAME!,
//     key: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split(".").pop());
//     },
//   }),
// });

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
// serviceRouter.post('/',uploadS3.array("images"), createServiceController.run.bind(createServiceController));
serviceRouter.delete('/:id', deleteServiceController.run.bind(deleteServiceController));
serviceRouter.patch('/:id', upload.array("images"), updateServiceController.run.bind(updateServiceController));
// serviceRouter.patch('/:id', uploadS3.array("images"), updateServiceController.run.bind(updateServiceController));
serviceRouter.get('/', findAllServiceController.run.bind(findAllServiceController));
serviceRouter.get('/:id', findByIdServiceController.run.bind(findByIdServiceController));
serviceRouter.get('/provider/:id', findByProviderIdController.run.bind(findByProviderIdController));

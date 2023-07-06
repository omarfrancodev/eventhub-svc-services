import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Service } from '../../domain/Service';
import { CreateServiceUseCase } from '../../application/CreateServiceUseCase';
import saveLogFile from '../LogsErrorControl';

export class CreateServiceController {
    constructor(private readonly createServiceUseCase: CreateServiceUseCase) { }
    async run(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        try {

            const formData = req.body.services;
            let images: Express.MulterS3.File[] = req.files as Express.MulterS3.File[];
            const createServicePromises: Promise<Service>[] = formData.map((item: any) => {
                return this.createService(item, images);
            });

            const createdServices = await Promise.all(createServicePromises);
            const createdService = await this.createServiceUseCase.run(createdServices);
            return res.status(201).json(createdService);
        } catch (error: any) {
            console.error(error);
            saveLogFile(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    private createService(serviceData: any, images: Express.MulterS3.File[]) {
        const urlImages: string[] = [];
        const imagesToSave = images.splice(0, serviceData.amountImages);
        for (const image of imagesToSave) {
            const imagePath = `/images-services/${image.filename}`;
            urlImages.push(imagePath);
        }
        const service = new Service();
        service.providerId = parseInt(serviceData.providerId);
        service.name = serviceData.name;
        service.description = serviceData.description;
        service.tags = serviceData.tags;
        service.urlImages = urlImages;

        return service;
    }
}
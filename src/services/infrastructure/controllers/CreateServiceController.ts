import { Request, Response } from 'express';
import { Service } from '../../domain/Service';
import { CreateServiceUseCase } from '../../application/CreateServiceUseCase';

export class CreateServiceController {
    constructor(private readonly createServiceUseCase: CreateServiceUseCase) { }

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const formData = JSON.parse(req.body.services);
            let images: Express.MulterS3.File[] = req.files as Express.MulterS3.File[];              

            const services: Service[] = [];

            for (const item of formData) {
                const newService = this.createService(item, images);
                services.push(newService);
            }

            const createdService = await this.createServiceUseCase.run(services);

            return res.status(201).json(createdService);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    private createService(serviceData: any, images: Express.MulterS3.File[]){
        const urlImages: string[] = [];

        if (Array.isArray(images)) {
            const imagesToSave = images.splice(0,  serviceData.amountImages);
            for (const image of imagesToSave) {
                const imagePath = `/images-services/${image.filename}`;
                urlImages.push(imagePath);
                // const imagePath = image.location;
                // urlImages.push(imagePath);
            }
        }

        const service = new Service();
        service.providerId = parseInt(serviceData.providerId);
        service.name = serviceData.name;
        service.description = serviceData.description;
        service.tags =serviceData.tags;
        service.urlImages = urlImages;

        return service;
    }
}
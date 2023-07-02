import { Request, Response } from 'express';
import { Service } from '../../domain/Service';
import { CreateServiceUseCase } from '../../application/CreateServiceUseCase';

export class CreateServiceController {
    constructor(private readonly createServiceUseCase: CreateServiceUseCase) { }

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const formData = req.body;
            const images: Express.MulterS3.File[] = req.files as Express.MulterS3.File[];
            const urlImages: string[] = [];
            let tags: string[] = [];

            if (Array.isArray(images)) {
                for (const image of images) {
                    const imagePath = `/images-services/${image.filename}`;
                    urlImages.push(imagePath);
                    // const imagePath = image.location;
                    // urlImages.push(imagePath);
                }
            }

            if (formData !== undefined) {
                tags = formData.tags.split('|');
            }

            const service = new Service();
            service.providerId = parseInt(formData.providerId);
            service.name = formData.name;
            service.description = formData.description;
            service.tags = tags;
            service.urlImages = urlImages;

            const createdService = await this.createServiceUseCase.run(service);

            return res.status(201).json(createdService);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
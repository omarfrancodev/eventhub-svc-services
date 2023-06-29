import { Request, Response } from 'express';
import { UpdateServiceUseCase } from '../../application/UpdateServiceUseCase';
import { FindByIdServiceUseCase } from '../../application/FindByIdServiceUseCase';
import * as fs from 'fs';

export class UpdateServiceController {
    constructor(private readonly updateServiceUseCase: UpdateServiceUseCase,
        private readonly findByIdServiceUseCase: FindByIdServiceUseCase
    ) { }

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const serviceId = Number(req.params.id);
            const updatedServiceData = req.body;
            const images: Express.MulterS3.File[] = req.files as Express.MulterS3.File[];
            const urlImages: string[] = [];
            let tags: string[] = [];

            const existingService = await this.findByIdServiceUseCase.run(serviceId);

            if (existingService) {
                if (images.length > 0) {
                    for (const image of images) {
                        const imagePath = `/images-services/${image.filename}`;
                        urlImages.push(imagePath);
                        // const imagePath = image.location;
                        // urlImages.push(imagePath);

                        await fs.promises.rename(image.path, imagePath);
                    }
                } else {
                    urlImages.push(...existingService.urlImages);
                }
                if (updatedServiceData.tags !== undefined) {
                    if (updatedServiceData.tags.length > 0) {
                        tags = updatedServiceData.tags.split('|');
                    }
                } else {
                    if (existingService.tags !== null) {
                        tags.push(...existingService.tags)
                    }
                }

                const updatedService = {
                    ...existingService,
                    ...updatedServiceData,
                    urlImages,
                    tags
                };

                const result = await this.updateServiceUseCase.run(serviceId, updatedService);

                return res.status(200).json(result);
            } else {
                return res.status(404).json({ error: "Service not found" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
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
            let urlImages: string[] = [];
            let imagesToKeep: string[] = [];
            let tags: string[] = [];

            const existingService = await this.findByIdServiceUseCase.run(serviceId);

            if (existingService) {
                if (images.length > 0) {
                    for (const image of images) {
                        const imagePath = `src/images-services/${image.filename}`;
                        const realImagePath = `${imagePath.substring(imagePath.indexOf('/'))}`;
                        urlImages.push(realImagePath);
                        // const imagePath = image.location;
                        // urlImages.push(imagePath);

                        await fs.promises.rename(image.path, imagePath);
                    }
                    const existingImages = existingService.urlImages;
                    if (updatedServiceData.urlImages.length > 0) { imagesToKeep = updatedServiceData.urlImages.split(','); }
                    const imagesToRemove = existingImages.filter(
                        (existingImage: string) => !imagesToKeep.includes(existingImage)
                    );
                    urlImages = urlImages.concat(imagesToKeep);
                    
                    imagesToRemove.forEach((image: any) => {
                        const imagePath = `src/${image}`;

                        fs.unlink(imagePath, (err) => {
                            if (err) {
                                console.error(`Error al eliminar la imagen ${image}: ${err}`);
                            } else {
                                console.log(`Imagen ${image} eliminada correctamente`);
                            }
                        });
                    });
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

                const result = await this.updateServiceUseCase.run(existingService, updatedService);

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
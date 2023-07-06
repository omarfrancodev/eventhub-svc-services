import { Request, Response } from 'express';
import { UpdateServiceUseCase } from '../../application/UpdateServiceUseCase';
import { FindByIdServiceUseCase } from '../../application/FindByIdServiceUseCase';
import { Service } from '../../domain/Service';
import saveLogFile from '../LogsErrorControl';
import * as fs from 'fs';

export class UpdateServiceController {
    constructor(private readonly updateServiceUseCase: UpdateServiceUseCase,
        private readonly findByIdServiceUseCase: FindByIdServiceUseCase
    ) { }

    async run(req: Request, res: Response): Promise<Response> {
        const serviceId = isNaN(Number(req.params.id)) ? null : Number(req.params.id);
        if (!serviceId) {
            return res.status(400).json({ error: 'Invalid service ID' });
        }
        try {
            const updatedServiceData = req.body;
            const images: Express.MulterS3.File[] = req.files as Express.MulterS3.File[];
            let urlImages: string[] = [];
            let tags: string[] = [];

            const existingService = await this.findByIdServiceUseCase.run(serviceId);

            if (!existingService) {
                return res.status(404).json({ error: "Service not found" });
            }
            if (images.length > 0) {
                urlImages = await this.manageImages(images, urlImages, existingService, updatedServiceData);
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
        } catch (error: any) {
            console.error(error);
            saveLogFile(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    private async manageImages(images: Express.MulterS3.File[], urlImages: string[], existingService: Service, updatedServiceData: any) {
        let imagesToKeep: string[] = [];
        const renamePromises = images.map(image => {
            const filename = `src/images-services/${image.filename}`;
            const imagePath = `${filename.substring(filename.indexOf('/'))}`;
            urlImages.push(imagePath);
            return fs.promises.rename(image.path, filename);
        });
        await Promise.all(renamePromises);

        const existingImages = existingService.urlImages;
        if (updatedServiceData.urlImages.length > 0) { imagesToKeep = updatedServiceData.urlImages.split(','); }

        const imagesToRemove = existingImages.filter(
            (existingImage: string) => !imagesToKeep.includes(existingImage)
        );
        urlImages = urlImages.concat(imagesToKeep);

        const unlinkPromises = imagesToRemove.map(async image => {
            const imagePath = `src/${image}`;
            try {
                await fs.promises.unlink(imagePath);
                console.log(`Imagen ${image} eliminada correctamente`);
            } catch (err: any) {
                console.error(`Error al eliminar la imagen ${image}: ${err}`);
                saveLogFile(err);
            }
        });
        await Promise.all(unlinkPromises);

        return urlImages;
    }
}
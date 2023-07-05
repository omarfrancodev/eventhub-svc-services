import { Request, Response } from 'express';
import { DeleteServiceUseCase } from '../../application/DeleteServiceUseCase';
import { FindByIdServiceUseCase } from '../../application/FindByIdServiceUseCase';
import * as fs from 'fs';
import saveErrorToLogFile from '../LogsErrorControl';

export class DeleteServiceController {
    constructor(private readonly deleteServiceUseCase: DeleteServiceUseCase,
        private readonly findByIdServiceUseCase: FindByIdServiceUseCase) { }

    async run(req: Request, res: Response): Promise<Response> {
        const serviceId = isNaN(Number(req.params.id)) ? null : Number(req.params.id);
        if (!serviceId) {
            return res.status(400).json({ error: 'Invalid service ID' });
        }
        try {
            const service = await this.findByIdServiceUseCase.run(serviceId);

            if (!service) {
                return res.status(404).json({ error: 'Service not found' });
            }

            const imagePaths = service.urlImages;

            if (imagePaths.length > 0) {
                await Promise.all(imagePaths.map(path => fs.promises.unlink(`src/${path}`)));
            }
            await this.deleteServiceUseCase.run(service);

            return res.status(200).json({ message: 'Service deleted successfully' });
        } catch (error: any) {
            console.error(error);
            const stackLines = error.stack.split("\n");
            let errorLine = '';
            for (const line of stackLines) {
                errorLine += line + "\n";
            }
            saveErrorToLogFile(error, errorLine);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
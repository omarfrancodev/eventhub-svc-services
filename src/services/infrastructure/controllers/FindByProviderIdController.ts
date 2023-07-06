import { Request, Response } from 'express';
import { FindByProviderIdUseCase } from '../../application/FindByProviderIdUseCase';
import saveLogFile from '../LogsErrorControl';

export class FindByProviderIdController {
    constructor(private readonly findByProviderIdsUseCase: FindByProviderIdUseCase) { }

    async run(req: Request, res: Response): Promise<Response> {
        const providerId = isNaN(Number(req.params.id)) ? null : Number(req.params.id);
        if (!providerId) {
            return res.status(400).json({ error: 'Invalid service ID' });
        }
        try {
            const services = await this.findByProviderIdsUseCase.run(providerId);
            if (!services) {
                return res.status(404).json({ error: 'Service not found' });
            }
            return res.status(200).json(services);
        } catch (error: any) {
            console.error(error);
            saveLogFile(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
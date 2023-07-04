import {Request, Response } from 'express';
import { FindByProviderIdUseCase } from '../../application/FindByProviderIdUseCase';

export class FindByProviderIdController{
    constructor(private readonly findByProviderIdsUseCase: FindByProviderIdUseCase) { }

    async run(req: Request, res: Response): Promise<Response>{
        try {
            const providerId = Number(req.params.id);

            const services = await this.findByProviderIdsUseCase.run(providerId);
            if (!services) {
                return res.status(404).json({ error: 'Service not found' });
            }
            return res.status(200).json(services);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
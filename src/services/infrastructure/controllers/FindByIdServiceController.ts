import { Request, Response } from 'express';
import { FindByIdServiceUseCase } from '../../application/FindByIdServiceUseCase';

export class FindByIdServiceController {
    constructor(private readonly findByIdServiceUseCase: FindByIdServiceUseCase) { }

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const serviceId = Number(req.params.id);

            const service = await this.findByIdServiceUseCase.run(serviceId);
            if (!service) {
                return res.status(404).json({ error: 'Service not found' });
            }
            return res.status(200).json(service);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
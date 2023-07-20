import { Request, Response } from 'express';
import { FindByContentServiceUseCase } from '../../application/FindByContentServiceUseCase';
import saveLogFile from '../LogsErrorControl';
import { validationResult } from 'express-validator';

export class FindByContentServiceController {
    constructor(
        private readonly findByContentServiceUseCase: FindByContentServiceUseCase
    ) { }

    async run(req: Request, res: Response): Promise<Response> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        try {
            const content = req.body.content;
            console.log(content);

            const setproviderIds: Set<number> = new Set();
            const listProviderIds: number[] = [];

            for (const token of content) {
                const servicesByContent = await this.findByContentServiceUseCase.run(token);
                for (const service of servicesByContent) {
                    if (!setproviderIds.has(service.providerId)) {
                        setproviderIds.add(service.providerId);
                    }
                }
            }

            setproviderIds.forEach((providerId) => listProviderIds.push(providerId));

            return res.status(200).json(listProviderIds);
        } catch (error) {
            console.error(error);
            saveLogFile(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

import { Request, Response } from 'express';
import { FindByProviderIdUseCase } from '../../application/FindByProviderIdUseCase';
import saveErrorToLogFile from '../LogsErrorControl';

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
            const stackLines = error.stack.split("\n");
            let errorLine = '';
            for (const line of stackLines) {
                const fileAndLine = line.match(/\((.*):(\d+):\d+\)$/);
                if (fileAndLine) {
                    const file = fileAndLine[1];
                    const lineNumber = fileAndLine[2];
                    errorLine = `File: ${file}, Line: ${lineNumber}`;
                    break;
                }
            }
            saveErrorToLogFile(error, errorLine);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
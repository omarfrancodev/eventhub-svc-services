import { Request, Response } from 'express';
import { FindByIdServiceUseCase } from '../../application/FindByIdServiceUseCase';
import saveErrorToLogFile from '../LogsErrorControl';

export class FindByIdServiceController {
    constructor(private readonly findByIdServiceUseCase: FindByIdServiceUseCase) { }

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
            return res.status(200).json(service);
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
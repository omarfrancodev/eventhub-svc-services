import { Request, Response } from 'express';
import { FindAllServiceUseCase } from '../../application/FindAllServiceUseCase';
import saveErrorToLogFile from '../LogsErrorControl';

export class FindAllServiceController {
    constructor(private readonly findAllServiceUseCase: FindAllServiceUseCase) { }

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const services = await this.findAllServiceUseCase.run();
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
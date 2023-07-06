import { Request, Response } from 'express';
import { FindAllServiceUseCase } from '../../application/FindAllServiceUseCase';
import saveLogFile from '../LogsErrorControl';

export class FindAllServiceController {
    constructor(private readonly findAllServiceUseCase: FindAllServiceUseCase) { }

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const services = await this.findAllServiceUseCase.run();
            return res.status(200).json(services);
        } catch (error: any) {
            console.error(error);
            saveLogFile(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
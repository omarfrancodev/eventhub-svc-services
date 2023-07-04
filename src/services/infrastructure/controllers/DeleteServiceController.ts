import { Request, Response } from 'express';
import { DeleteServiceUseCase } from '../../application/DeleteServiceUseCase';
import { FindByIdServiceUseCase } from '../../application/FindByIdServiceUseCase';
import * as fs from 'fs';

export class DeleteServiceController {
  constructor(private readonly deleteServiceUseCase: DeleteServiceUseCase,
    private readonly findByIdServiceUseCase: FindByIdServiceUseCase) { }

  async run(req: Request, res: Response): Promise<Response> {
    try {
      const serviceId = Number(req.params.id);
      const service = await this.findByIdServiceUseCase.run(serviceId);

      if (!service) {
          return res.status(404).json({error: 'Service not found'});
      }

      const imagePaths =service.urlImages;
      await this.deleteServiceUseCase.run(service);

      if (imagePaths.length > 0) {
        for(const path of imagePaths){
          await fs.promises.unlink(path);
        }
      }
      
      return res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
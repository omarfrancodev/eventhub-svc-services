import { Service } from '../domain/Service';
import { IServiceRepository } from '../domain/IServiceRepository';

export class CreateServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) { }

  async run(service: Service): Promise<Service> {
    return this.serviceRepository.create(service);
  }
}

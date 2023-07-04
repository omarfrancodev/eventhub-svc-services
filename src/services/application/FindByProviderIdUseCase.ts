import { Service } from '../domain/Service';
import { IServiceRepository } from '../domain/IServiceRepository';

export class FindByProviderIdUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) { }

  async run(providerId: number): Promise<Service[]> {
    return this.serviceRepository.findByProviderId(providerId);
  }
}
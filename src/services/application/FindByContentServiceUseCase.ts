import { Service } from '../domain/Service';
import { IServiceRepository } from '../domain/IServiceRepository';

export class FindByContentServiceUseCase {
  constructor(private readonly serviceRepository: IServiceRepository) { }

  async run(content: string): Promise<Service[]> {
    return this.serviceRepository.findByContent(content);
  }
}
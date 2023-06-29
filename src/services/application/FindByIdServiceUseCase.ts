import { Service } from "../domain/Service";
import { IServiceRepository } from "../domain/IServiceRepository";

export class FindByIdServiceUseCase {
    constructor(private readonly serviceRepository: IServiceRepository) {}

    async run(serviceId: number): Promise<Service | null> {
        const service = await this.serviceRepository.findById(serviceId);
        return service;
    }
}
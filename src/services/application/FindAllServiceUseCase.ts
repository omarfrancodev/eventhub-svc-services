import { Service } from "../domain/Service";
import { IServiceRepository } from "../domain/IServiceRepository";

export class FindAllServiceUseCase {
    constructor(private readonly serviceRepository: IServiceRepository) { }

    async run(): Promise<Service[]> {
        const services = await this.serviceRepository.findAll();
        return services;
    }
}
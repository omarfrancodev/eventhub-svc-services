import { Service } from "../domain/Service";
import { IServiceRepository } from "../domain/IServiceRepository";

export class UpdateServiceUseCase {
    constructor(private readonly servideRepository: IServiceRepository) { }

    async run(service: Service, updatedServiceData: Partial<Service>): Promise<Service> {
        const updatedService = Object.assign(service, updatedServiceData);
        return this.servideRepository.update(updatedService);
    }
}
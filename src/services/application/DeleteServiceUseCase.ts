import { IServiceRepository } from "../domain/IServiceRepository";
import { Service } from "../domain/Service";

export class DeleteServiceUseCase {
    constructor(private readonly serviceRepository: IServiceRepository) { }

    async run(service: Service): Promise<void> {
        await this.serviceRepository.delete(service);
    }
}
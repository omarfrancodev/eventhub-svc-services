import { Like, Repository } from "typeorm";
import { Service } from "../../domain/Service";
import { IServiceRepository } from "../../domain/IServiceRepository";
import { AppDataSource } from '../data-source';

export class ServiceRepository implements IServiceRepository {
    private repository: Repository<Service>;

    constructor() {
        this.repository = AppDataSource.getRepository(Service);
    }

    async create(services: Service[]): Promise<Service[]> {
        return this.repository.save(services);
    }

    async update(service: Service): Promise<Service> {
        return this.repository.save(service);
    }

    async delete(provider: Service): Promise<void> {
        await this.repository.remove(provider);
    }

    async findById(serviceId: number): Promise<Service | null> {
        return this.repository.findOneBy({ serviceId: serviceId })
    }

    async findAll(): Promise<Service[]> {
        return this.repository.find();
    }

    async findByProviderId(providerId: number): Promise<Service[]> {
        return await this.repository.findBy({ providerId: providerId });
    }

    async findByContent(content: string): Promise<Service[]> {
        const services = await this.repository.find({
            where: { lowerDescription: Like(`%${content}%`) },
        });
        return services;
    }
}
import { Service } from './Service';

export interface IServiceRepository {
  create(services: Service): Promise<Service>;
  update(service: Service): Promise<Service>;
  delete(service: Service): Promise<void>;
  findById(serviceId: number): Promise<Service | null>;
  findAll(): Promise<Service[]>;
}
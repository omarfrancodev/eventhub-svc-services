import { Service } from './Service';

export interface IServiceRepository {
  create(provider: Service): Promise<Service>;
  update(provider: Service): Promise<Service>;
  delete(provider: Service): Promise<void>;
  findById(providerId: number): Promise<Service | null>;
  findAll(): Promise<Service[]>;
}
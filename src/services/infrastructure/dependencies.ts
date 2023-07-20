import { CreateServiceUseCase } from "../application/CreateServiceUseCase";
import { DeleteServiceUseCase } from "../application/DeleteServiceUseCase";
import { FindAllServiceUseCase } from "../application/FindAllServiceUseCase";
import { FindByIdServiceUseCase } from "../application/FindByIdServiceUseCase";
import { UpdateServiceUseCase } from "../application/UpdateServiceUseCase";
import { FindByProviderIdUseCase } from "../application/FindByProviderIdUseCase";
import { FindByContentServiceUseCase } from "../application/FindByContentServiceUseCase";

import { CreateServiceController } from "./controllers/CreateServiceController";
import { DeleteServiceController } from "./controllers/DeleteServiceController";
import { FindAllServiceController } from "./controllers/FindAllServiceController";
import { FindByIdServiceController } from "./controllers/FindByIdServiceController";
import { UpdateServiceController } from "./controllers/UpdateServiceController";
import { FindByProviderIdController } from "./controllers/FindByProviderIdController";
import { FindByContentServiceController } from "./controllers/FindByContentServiceController";

import { ServiceRepository } from "./implementation/ServiceRepository";

const serviceRepository = new ServiceRepository();

const createServiceUseCase = new CreateServiceUseCase(serviceRepository);
export const createServiceController = new CreateServiceController(createServiceUseCase);

const findByIdServiceUseCase = new FindByIdServiceUseCase(serviceRepository);
export const findByIdServiceController = new FindByIdServiceController(findByIdServiceUseCase);

const deleteServiceUseCase = new DeleteServiceUseCase(serviceRepository);
export const deleteServiceController = new DeleteServiceController(deleteServiceUseCase, findByIdServiceUseCase);

const findAllServiceUseCase = new FindAllServiceUseCase(serviceRepository);
export const findAllServiceController = new FindAllServiceController(findAllServiceUseCase);

const updateServiceUseCase = new UpdateServiceUseCase(serviceRepository);
export const updateServiceController = new UpdateServiceController(updateServiceUseCase, findByIdServiceUseCase);

const findByProviderIdUseCase = new FindByProviderIdUseCase(serviceRepository);
export const findByProviderIdController = new FindByProviderIdController(findByProviderIdUseCase);

const findByContentServiceUseCase = new FindByContentServiceUseCase(serviceRepository);
export const findByContentServiceController = new FindByContentServiceController(findByContentServiceUseCase);



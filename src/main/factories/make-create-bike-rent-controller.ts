import { CreateRentBikeController } from '@/presentation/controllers/create-rent-bike-controller';
import { Controller } from '@/presentation/controllers/ports/controller';
import { CreateRentBike } from '@/usecases/create-rent-bike';
import { makeBikeRepository } from '@/main/factories/make-bike-repository';

export const makeCreateBikeRentController = (): Controller => {
  const bikeRepository = makeBikeRepository();
  const createRentBikeUseCase = new CreateRentBike(bikeRepository);
  const createCourseController = new CreateRentBikeController(createRentBikeUseCase);
  return createCourseController;
};

import { UseCase } from '@/usecases/ports/use-case';
import { BikeRepository } from '@/usecases/ports/bike-repository';
import { BikeRent } from '@/usecases/datatypes/rent';

export class CreateRentBike implements UseCase {
  constructor(private bikeRepository: BikeRepository) {}

  async perform(body: BikeRent): Promise<void> {
    return await this.bikeRepository.update(body);
  }
}

import { CreateRentBike } from '@/usecases/create-rent-bike';
import { BikeBuilderRent } from '@test/builders/bike-rent-builder';
import { InMemoryBikeRepository } from '@test/doubles/in-memory-bike-repository';

describe('Update bike rent use case', () => {
  it('should update a new bike rent', async () => {
    const bikeRepository = new InMemoryBikeRepository();
    const useCase = new CreateRentBike(bikeRepository);

    const bike = new BikeBuilderRent().build();
    const returnedCandidate = await useCase.perform(bike);
    expect(returnedCandidate).toBeUndefined();
  });
});

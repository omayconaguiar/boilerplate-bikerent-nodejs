import { CreateRentBikeController } from '@/presentation/controllers/create-rent-bike-controller';
import { HttpRequest, HttpResponse } from '@/presentation/controllers/ports';
import { CreateRentBike } from '@/usecases/create-rent-bike';
import { BikeBuilder } from '@test/builders/bike-builder';
import { InMemoryBikeRepository } from '@test/doubles/in-memory-bike-repository';
import { currentDateTimeUserTimezone } from '../../helper';

describe('Update Bike Rent controller', () => {
  it('should update a bike data and book as rented with fake data', async () => {
    const bikeRepository = new InMemoryBikeRepository();
    const addedBike = new BikeBuilder().build();
    const useCase = new CreateRentBike(bikeRepository);
    const controller = new CreateRentBikeController(useCase);

    const bike = await bikeRepository.add(addedBike);

    const request: HttpRequest = {
      body: {
        startDate: currentDateTimeUserTimezone,
        endDate: currentDateTimeUserTimezone.clone().add(10, 'days'),
        rate: 74,
      },
      params: {
        bikeId: bike.id,
      },
    };

    const response: HttpResponse = await controller.handle(request);

    expect(response.statusCode).toEqual(200);
    expect(response.body.bikeId).toEqual(bike.id);
  });

  it('should return 400 if start date is before than today', async () => {
    const bikeRepository = new InMemoryBikeRepository();
    const addedBike = new BikeBuilder().build();
    const useCase = new CreateRentBike(bikeRepository);
    const controller = new CreateRentBikeController(useCase);

    const bike = await bikeRepository.add(addedBike);

    const request: HttpRequest = {
      body: {
        startDate: currentDateTimeUserTimezone.clone().subtract(10, 'days'),
        endDate: currentDateTimeUserTimezone,
        rate: 74,
      },
      params: {
        bikeId: bike.id,
      },
    };

    const response: HttpResponse = await controller.handle(request);

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual('The startDate it must be equal or greater than today');
  });

  it('should return 400 if end date is before than today', async () => {
    const bikeRepository = new InMemoryBikeRepository();
    const addedBike = new BikeBuilder().build();
    const useCase = new CreateRentBike(bikeRepository);
    const controller = new CreateRentBikeController(useCase);

    const bike = await bikeRepository.add(addedBike);

    const request: HttpRequest = {
      body: {
        startDate: currentDateTimeUserTimezone,
        endDate: currentDateTimeUserTimezone.clone().subtract(10, 'days'),
        rate: 74,
      },
      params: {
        bikeId: bike.id,
      },
    };

    const response: HttpResponse = await controller.handle(request);

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual('The endDate it must be equal or greater than today');
  });

  it('should return 400 if end date is before than today', async () => {
    const bikeRepository = new InMemoryBikeRepository();
    const addedBike = new BikeBuilder().build();
    const useCase = new CreateRentBike(bikeRepository);
    const controller = new CreateRentBikeController(useCase);

    const bike = await bikeRepository.add(addedBike);

    const request: HttpRequest = {
      body: {
        startDate: currentDateTimeUserTimezone,
        endDate: currentDateTimeUserTimezone,
        rate: 74,
      },
      params: {
        bikeId: bike.id,
      },
    };

    const response: HttpResponse = await controller.handle(request);

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual('The start and end date it must be different.');
  });
});

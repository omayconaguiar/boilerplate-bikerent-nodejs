import { BikeRent } from '@/usecases/datatypes/rent';

export class BikeBuilderRent {
  private bikeRent: BikeRent = {
    endDate: '2023-08-20',
    bikeId: 1,
    status: true,
  };

  build(): BikeRent {
    return this.bikeRent;
  }
}

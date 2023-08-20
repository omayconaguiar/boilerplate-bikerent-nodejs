import { Bike } from '@/usecases/datatypes/bike';
import { BikeRent } from '@/usecases/datatypes/rent';
export interface BikeRepository {
  list(candidateId: number): Promise<Bike[]>;
  listAvailable(candidateId: number): Promise<Bike[]>;
  add(bike: Bike): Promise<Bike>;
  update?(bike: BikeRent): Promise<void>;
}

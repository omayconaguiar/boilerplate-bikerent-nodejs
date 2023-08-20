import { Bike } from '@/usecases/datatypes/bike';
import { BikeRent } from '@/usecases/datatypes/rent';
import { BikeRepository } from '@/usecases/ports/bike-repository';
import prismaClient from '@/external/repository/prisma/prisma-client';
import moment from 'moment-timezone';
export class PrismaBikeRepository implements BikeRepository {
  async list(candidateId: number): Promise<Bike[]> {
    const bikes = await prismaClient.bike.findMany({
      where: {
        candidateId,
      },
    });
    const bikesWithImageUrls: Bike[] = [];
    for (const bike of bikes) {
      const imageUrlRecords = await prismaClient.imageUrl.findMany({
        where: {
          bikeId: bike.id,
        },
      });
      const imageUrls = imageUrlRecords.map((imageUrlRecord) => imageUrlRecord.url);
      bikesWithImageUrls.push({ ...bike, imageUrls });
    }
    return bikesWithImageUrls;
  }

  async listAvailable(candidateId: number): Promise<Bike[]> {
    const openRents = [];
    const allBikes = await this.list(candidateId);
    const availableBikes: Bike[] = [];
    allBikes.forEach((bike) => {
      const bikeIsAvailable = !openRents.some((rent) => rent.bikeId === bike.id);
      if (bike.rented_untill != null) {
        const providedDateTime = moment(bike.rented_untill);
        const providedDateTimeUTC = moment(providedDateTime);

        const userTimezone = 'America/Sao_Paulo';
        const providedDateTimeUserTimezone = providedDateTimeUTC.tz(userTimezone);
        const currentDateTimeUserTimezone = moment().tz(userTimezone);

        if (currentDateTimeUserTimezone.isAfter(providedDateTimeUserTimezone)) {
          this.update({ status: true, bikeId: bike.id });
        }
      }
      if (bikeIsAvailable && bike.is_available === true) {
        availableBikes.push(bike);
      }
    });
    return availableBikes;
  }

  async add(bike: Bike): Promise<Bike> {
    const { candidateId, ...bikeData } = bike;
    const bikeImageUrls = bike.imageUrls;
    const createdBike = await prismaClient.bike.create({
      data: {
        ...bikeData,
        candidate: {
          connect: {
            id: bike.candidateId,
          },
        },
        imageUrls: {
          create: bikeImageUrls.map((imageUrl) => ({ url: imageUrl })),
        },
      },
    });
    return { ...createdBike, imageUrls: bikeImageUrls };
  }

  async update(bike: BikeRent): Promise<void> {
    const { endDate, bikeId, status } = bike;
    let date = null;
    if (status === false) {
      date = new Date(endDate);
    }
    await prismaClient.bike.update({
      where: { id: bikeId },
      data: { is_available: status, rented_untill: date },
    });
  }
}

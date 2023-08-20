import prismaClient from '@/external/repository/prisma/prisma-client';
import app from '@/main/config/app';
import request from 'supertest';
import { clearPrismaDatabase } from './clear-database';
import { currentDateTimeUserTimezone, bikeInput, candidateInput } from '../../helper';

describe('Update bike rent', () => {
  it('should update bike rent', async () => {
    await clearPrismaDatabase();

    const candidate = await prismaClient.candidate.create({
      data: candidateInput(),
    });

    const bike = await prismaClient.bike.create({
      data: {
        ...bikeInput(),
        candidate: {
          connect: {
            id: candidate.id,
          },
        },
        imageUrls: {
          create: bikeInput().imageUrls.map((imageUrl) => ({ url: imageUrl })),
        },
      },
    });

    await request(app)
      .put(`/api/rent-bike/${bike.id}`)
      .send({
        startDate: currentDateTimeUserTimezone,
        endDate: currentDateTimeUserTimezone.clone().add(10, 'days'),
        rate: 74,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.token).not.toBeDefined();
      });
  });
});

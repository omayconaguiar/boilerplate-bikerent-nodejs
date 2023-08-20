import { Controller, HttpRequest, HttpResponse } from '@/presentation/controllers/ports';
import { UseCase } from '@/usecases/ports/use-case';
import moment from 'moment-timezone';

export class CreateRentBikeController implements Controller {
  constructor(private readonly createRentBikeController: UseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const bikePayload = request.body;
      const { bikeId } = request.params;

      const amountDaysOfWeek = 7;

      const startDate = moment(bikePayload.startDate);
      const endDate = moment(bikePayload.endDate);

      const bodyStarDate = startDate.format('YYYY-MM-DD');
      const bodyEndDate = endDate.format('YYYY-MM-DD');
      const currentHour = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD');

      if (bodyStarDate < currentHour || bodyEndDate < currentHour) {
        const errorMessage =
          bodyStarDate < currentHour
            ? 'The startDate it must be equal or greater than today'
            : 'The endDate it must be equal or greater than today';

        return {
          statusCode: 400,
          body: { message: errorMessage },
        };
      } else if (bodyStarDate === bodyEndDate) {
        return {
          statusCode: 400,
          body: { message: 'The start and end date it must be different.' },
        };
      }

      const getDiffBetweenStartAndEnd = endDate.diff(startDate, 'days');

      const subTotal = bikePayload.rate;
      const percentage = 0.15;

      const total = {
        subTotal: subTotal * getDiffBetweenStartAndEnd,
        serviceFee: '15%',
        total:
          subTotal * getDiffBetweenStartAndEnd + percentage * subTotal * getDiffBetweenStartAndEnd,
        week: subTotal * amountDaysOfWeek + percentage * subTotal * amountDaysOfWeek,
        endDate: moment(bikePayload.endDate).format('YYYY-MM-DD HH:mm:ss'),
        bikeId: parseInt(bikeId),
        status: false,
      };

      await this.createRentBikeController.perform(total);
      return {
        statusCode: 200,
        body: total,
      };
    } catch (error) {
      if (error?.meta?.cause === 'Record to update not found.') {
        new Error('Bikeid doesnt exist, try a new one');
        return {
          statusCode: 404,
          body: { message: 'BikeId doesnt exist, try a new one' },
        };
      }
      return {
        statusCode: 500,
        body: error,
      };
    }
  }
}

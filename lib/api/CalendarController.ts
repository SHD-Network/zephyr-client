import { ApiController } from './ApiController';

class CalendarController extends ApiController {
  public readonly SWR = {
    listCalendars: 'CalendarController-listCalendars',
  };

  public async listCalendars() {
    const response = await this.get<any>('calendar');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }
}

export const calendarController = new CalendarController();

import { ApiController } from './ApiController';

class CalendarController extends ApiController {
  public readonly SWR = {
    listCalendars: 'CalendarController-listCalendars',
    listEvents: 'CalendarController-listEvents',
    listSelectedCalendars: 'CalendarController-listSelectedCalendars',
  };

  public async listCalendars() {
    const response = await this.get<any>('calendar');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async listEvents(
    calendarIds: string[],
    startDate: Date,
    endDate: Date,
  ) {
    const response = await this.post<any>(`calendar/events`, {
      calendarIds: calendarIds.join(','),
      startDate,
      endDate,
    });

    if (response.status !== 201) {
      throw new Error(response.message);
    }

    return response;
  }

  public async createCalendar(name: string, color: string) {
    const response = await this.post<any>('calendar', {
      name,
      color,
    });

    if (response.status !== 201) {
      throw new Error(response.message);
    }

    return response;
  }

  public async createEvent(
    calendarId: string,
    name: string,
    allDay: boolean,
    start: Date,
    end: Date,
    description?: string,
  ) {
    const response = await this.post<any>(`calendar/${calendarId}/event`, {
      name,
      allDay,
      start,
      end,
      description,
    });

    if (response.status !== 201) {
      throw new Error(response.message);
    }

    return response;
  }

  public async listSelectedCalendars() {
    const response = await this.get<any>('calendar/selected');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async updateSelectedCalendars(calendarIds: string, configId?: string) {
    const response = await this.post<any>('calendar/selected', {
      calendarIds,
      configId,
    });

    if (response.status !== 201) {
      throw new Error(response.message);
    }

    return response;
  }
}

export const calendarController = new CalendarController();

'use client';

import { Dropdown, Modal } from '@/components';
import { calendarController } from '@/lib/api';
import styles from '@/styles/Pages/Calendar.module.scss';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TbCalendarPlus, TbPlus } from 'react-icons/tb';
import useSWR from 'swr';

function getWeek(thisDate: Date) {
  const dt = new Date(thisDate);
  const thisDay = dt.getDate();

  const newDate = dt;
  newDate.setDate(1); // first day of month
  const digit = newDate.getDay();

  const Q = (thisDay + digit) / 7;

  const R = (thisDay + digit) % 7;

  if (R !== 0) return Math.ceil(Q);
  else return Q;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type CalendarDropdown = {
  id: string;
  color: string;
  name: string;
  shared: boolean;
};

type CalendarViewDropdown = {
  id: string;
  name: string;
};

const calendarViews: CalendarViewDropdown[] = [
  {
    id: 'day',
    name: 'Day View',
  },
  {
    id: 'week',
    name: 'Week View',
  },
  {
    id: 'month',
    name: 'Month View',
  },
];

function Calendar() {
  const [newCalendarModal, setNewCalendarModal] = useState(false);
  const [newEventModal, setNewEventModal] = useState(false);
  const [allCalendars, setAllCalendars] = useState<CalendarDropdown[]>([]);
  const [selectedCalendars, setSelectedCalendars] = useState<
    CalendarDropdown[]
  >([]);
  const [selectedView, setSelectedView] = useState<CalendarViewDropdown>(
    calendarViews[2],
  );

  const { data: calendars } = useSWR(calendarController.SWR.listCalendars, () =>
    calendarController.listCalendars(),
  );

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (calendars === undefined) {
      return;
    }
    const ownCalendars = calendars.own.map((cal: CalendarDropdown) => {
      return {
        id: cal.id,
        color: cal.color,
        name: cal.name,
        shared: false,
      };
    });
    const sharedCalendars = calendars.shared.map((cal: CalendarDropdown) => {
      return {
        id: cal.id,
        color: cal.color,
        name: cal.name,
        shared: true,
      };
    });

    setAllCalendars([...ownCalendars, ...sharedCalendars]);
  }, [calendars]);

  async function createCalendar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const calendarName = e.target[0].value;
    const calendarColor = e.target[1].value;

    if (
      calendarName === '' ||
      calendarName === undefined ||
      calendarName === null
    ) {
      throw new Error('Calendar name is empty');
    }

    if (
      calendarColor === '' ||
      calendarColor === undefined ||
      calendarColor === null
    ) {
      throw new Error('Calendar color is empty');
    }

    await calendarController.createCalendar(calendarName, calendarColor);
  }

  return (
    <section className={styles.calendarPage}>
      <div className={styles.tabBar}>
        <div className={styles.left}>
          {allCalendars.length > 0 && (
            <Dropdown<CalendarDropdown>
              options={allCalendars}
              value={selectedCalendars}
              setValue={(value) => {
                setSelectedCalendars(
                  Array.isArray(value) ? [...value] : [value],
                );
              }}
              multiple
              labelKey="name"
              valueKey="id"
              width={300}
              placeholder="Calendars"
              checkmarks
              forcePlaceholder
            />
          )}
          <button onClick={() => setNewCalendarModal(true)}>
            <TbPlus />
            Create calendar
          </button>
          {allCalendars.length > 0 && (
            <button onClick={() => setNewEventModal(true)}>
              <TbCalendarPlus />
              Create event
            </button>
          )}
          {/* <Dropdown<CalendarViewDropdown>
            options={calendarViews}
            value={selectedView}
            setValue={(value) => {
              setSelectedView(Array.isArray(value) ? value[0] : value);
            }}
            labelKey="name"
            valueKey="id"
            placeholder="View"
            width={150}
          /> */}
        </div>
        <div className={styles.right}>
          <h2>
            {months[now.getMonth()]}
            <span>{now.getFullYear()}</span>
          </h2>
        </div>
      </div>
      {selectedView.id === 'month' && <MonthlyView date={now} />}
      <Modal open={newCalendarModal} onToggle={setNewCalendarModal}>
        <h1>Create calendar</h1>
        <form onSubmit={createCalendar}>
          <input type="text" placeholder="Calendar name" />
          <section>
            <span>Calendar colour</span>
            <input type="color" defaultValue="#DA0037" />
          </section>
          <button type="submit">Create</button>
        </form>
      </Modal>
      <Modal open={newEventModal} onToggle={setNewEventModal}>
        <h1>Create event</h1>
        <form>
          <Dropdown<CalendarDropdown>
            options={allCalendars}
            value={selectedCalendars}
            setValue={(value) => {
              setSelectedCalendars(Array.isArray(value) ? [...value] : [value]);
            }}
            labelKey="name"
            valueKey="id"
            width={300}
            placeholder="Calendars"
          />
        </form>
      </Modal>
    </section>
  );
}

type CalendarViewProps = {
  date: Date;
};

function MonthlyView({ date }: CalendarViewProps) {
  const thisMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const daysInMonth = thisMonth.getDate();
  const numOfWeeks = getWeek(thisMonth);

  return (
    <div
      className={`${styles.calendar} ${styles.month}`}
      style={{ gridTemplateRows: `40px repeat(${numOfWeeks}, 1fr)` }}
    >
      <div className={styles.labels}>
        {[...Array(7)].map((_, i) => (
          <span key={i} className={styles.label}>
            {
              [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
              ][i]
            }
          </span>
        ))}
      </div>
      {[...Array(daysInMonth)].map((_, i) => (
        <MonthlyDate
          key={i}
          date={new Date(date.getFullYear(), date.getMonth(), i + 1)}
        />
      ))}
    </div>
  );
}

type MonthlyDateProps = {
  date: Date;
};

function MonthlyDate({ date }: MonthlyDateProps) {
  const day = date.getDay();
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return (
    <div
      className={`${
        day === 1
          ? styles.monday
          : day === 2
          ? styles.tuesday
          : day === 3
          ? styles.wednesday
          : day === 4
          ? styles.thursday
          : day === 5
          ? styles.friday
          : day === 6
          ? styles.saturday
          : styles.sunday
      } ${styles.day} ${isToday ? styles.today : ''}`}
    >
      <span className={styles.dayNumber}>{date.getDate()}</span>
      <Link href={`/calendar/${date.getTime()}`} />
    </div>
  );
}

export default Calendar;

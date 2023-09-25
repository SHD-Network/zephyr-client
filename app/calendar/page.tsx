'use client';

import { calendarController } from '@/lib/api';
import { useEffect, useMemo, useState } from 'react';
import {
  TbCalendarPlus,
  TbChevronLeft,
  TbChevronRight,
  TbPencil,
  TbPlus,
} from 'react-icons/tb';
import useSWR from 'swr';
import { DatePickerInput, DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import {
  ActionIcon,
  AspectRatio,
  Badge,
  Box,
  Button,
  Checkbox,
  ColorInput,
  Container,
  Flex,
  Modal,
  MultiSelect,
  Select,
  SimpleGrid,
  TextInput,
  Textarea,
  Title,
  Text,
} from '@mantine/core';

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

type CalendarType = {
  id: string;
  color: string;
  name: string;
  shared: boolean;
  events?: CalendarEvent[];
};

type CalendarDropdown = {
  value: string;
  color: string;
  label: string;
  shared: boolean;
};

type CalendarViewDropdown = {
  id: string;
  name: string;
};

type CalendarEvent = {
  allDay: boolean;
  calendarId: string;
  createdAt: string;
  createdById: string;
  description: string;
  end: string;
  id: string;
  name: string;
  start: string;
  updatedAt: string;
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
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  // const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [selectedView, setSelectedView] = useState<CalendarViewDropdown>(
    calendarViews[2],
  );
  const [firstDate, setFirstDate] = useState(new Date());
  const [lastDate, setLastDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const first = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1,
    );
    const last = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0,
    );

    setFirstDate(first);
    setLastDate(last);
  }, [selectedDate]);

  const { data: calendars, mutate: revalidateCalendars } = useSWR(
    calendarController.SWR.listCalendars,
    () => calendarController.listCalendars(),
  );

  const { data: selectedCalendars, mutate: revalidateSelectedCalendars } =
    useSWR(calendarController.SWR.listSelectedCalendars, () =>
      calendarController.listSelectedCalendars(),
    );

  const { data: events, mutate: revalidateEvents } = useSWR(
    selectedCalendars === undefined ||
      selectedCalendars.value.calendarIds.length < 1
      ? null
      : calendarController.SWR.listEvents,
    () =>
      calendarController.listEvents(
        selectedCalendars.value.calendarIds,
        firstDate,
        lastDate,
      ),
  );

  useEffect(() => {
    if (selectedCalendars === undefined) {
      return;
    }

    if (selectedCalendars.value.calendarIds.length < 1) {
      setAllEvents([]);
    }
  }, [selectedCalendars]);

  useEffect(() => {
    revalidateEvents();

    if (selectedCalendars === undefined || selectedCalendars.length < 1) {
      setAllEvents([]);
    }
  }, [selectedCalendars, revalidateEvents]);

  useEffect(() => {
    if (calendars === undefined) {
      return;
    }

    const ownCalendars = calendars.own.map((cal: CalendarType) => {
      return {
        value: cal.id,
        color: cal.color,
        label: cal.name,
        shared: false,
      };
    });
    const sharedCalendars = calendars.shared.map((cal: CalendarType) => {
      return {
        value: cal.id,
        color: cal.color,
        label: cal.name,
        shared: true,
      };
    });

    setAllCalendars([...ownCalendars, ...sharedCalendars]);
  }, [calendars]);

  useEffect(() => {
    if (events === undefined) {
      return;
    }

    const ownEvents = [];
    const sharedEvents = [];

    events.own.map((cal: CalendarType) => {
      ownEvents.push(...cal.events);
    });

    events.shared.map((cal: CalendarType) => {
      sharedEvents.push(...cal.events);
    });

    setAllEvents([...ownEvents, ...sharedEvents]);
  }, [events]);

  const newCalendarForm = useForm({
    initialValues: {
      name: '',
      color: '#DA0037',
    },
    validate: {
      name: (value) =>
        value === null || value === undefined || value === ''
          ? 'Invalid calendar name'
          : null,
      color: (value) =>
        value === null || value === undefined || value === ''
          ? 'Invalid color'
          : null,
    },
  });

  async function createCalendar(values: { name: string; color: string }) {
    if (
      values.name === '' ||
      values.name === undefined ||
      values.name === null
    ) {
      throw new Error('Calendar name is empty');
    }

    if (
      values.color === '' ||
      values.color === undefined ||
      values.color === null
    ) {
      throw new Error('Calendar color is empty');
    }

    await calendarController.createCalendar(values.name, values.color);

    revalidateCalendars();
    setNewCalendarModal(false);

    newCalendarForm.reset();
  }

  const newEventForm = useForm({
    initialValues: {
      name: '',
      description: '',
      calendar: '',
      allDay: false,
      startTime: new Date(),
      endTime: new Date(),
    },
  });

  async function createEvent(values: {
    name: string;
    description: string;
    calendar: string;
    allDay: boolean;
    startTime: Date;
    endTime: Date;
  }) {
    if (
      values.name === '' ||
      values.name === undefined ||
      values.name === null
    ) {
      throw new Error('Event name is empty');
    }

    if (
      values.calendar === '' ||
      values.calendar === undefined ||
      values.calendar === null
    ) {
      throw new Error('Calendar is empty');
    }

    if (values.startTime === null || values.startTime === undefined) {
      throw new Error('Start time is empty');
    }

    if (values.endTime === null || values.endTime === undefined) {
      throw new Error('End time is empty');
    }

    if (values.startTime > values.endTime) {
      throw new Error('Start time is after end time');
    }

    await calendarController.createEvent(
      values.calendar,
      values.name,
      newEventAllDay,
      values.startTime,
      values.endTime,
      values.description,
    );

    // revalidate events
    setNewEventModal(false);

    newEventForm.reset();
  }

  function previousMonth() {
    if (selectedView.id === 'month') {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setSelectedDate(newDate);

      revalidateEvents();
      return;
    }
  }

  function nextMonth() {
    if (selectedView.id === 'month') {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setSelectedDate(newDate);

      revalidateEvents();
      return;
    }
  }

  function jumpToday() {
    setSelectedDate(new Date());
    revalidateEvents();
    return;
  }

  const [newEventAllDay, setNewEventAllDay] = useState(false);

  const [calendarDropdown, setCalendarDropdown] = useState(false);

  async function updateSelectedCalendars(calendarIds: string[]) {
    const calendarString =
      calendarIds.length === 0 ? '' : calendarIds.join(',');
    await calendarController.updateSelectedCalendars(
      calendarString,
      selectedCalendars.id,
    );
    revalidateSelectedCalendars();
  }

  const [editCalendarModal, setEditCalendarModal] = useState(false);

  return (
    <Container fluid>
      <Flex direction="column">
        <Flex align="flex-end" justify="space-between" mb="lg">
          <Flex align="flex-end" gap="xs">
            {selectedCalendars !== undefined && allCalendars.length > 0 && (
              <Box style={{ position: 'relative' }}>
                <MultiSelect
                  label="Calendars"
                  checkIconPosition="right"
                  data={allCalendars}
                  w={250}
                  h={61}
                  mah={61}
                  value={selectedCalendars.value.calendarIds}
                  onChange={(value) => updateSelectedCalendars(value)}
                  dropdownOpened={calendarDropdown}
                  onDropdownOpen={() => setCalendarDropdown(true)}
                  onDropdownClose={() => setCalendarDropdown(false)}
                  styles={{
                    input: {
                      opacity: 1,
                      maxHeight: '36px',
                    },
                  }}
                />
                <Button
                  variant="default"
                  w={250}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    zIndex: 5,
                  }}
                  onClick={() => setCalendarDropdown(true)}
                >
                  {selectedCalendars.value.calendarIds.length}{' '}
                  {selectedCalendars.value.calendarIds.length === 1
                    ? 'calendar'
                    : 'calendars'}{' '}
                  selected
                </Button>
              </Box>
            )}
            <Button
              onClick={() => setNewCalendarModal(true)}
              leftSection={<TbPlus />}
              variant="light"
            >
              Create calendar
            </Button>
            {allCalendars.length > 0 && (
              <Button
                leftSection={<TbPencil />}
                variant="light"
                onClick={() => setEditCalendarModal(true)}
              >
                Edit calendars
              </Button>
            )}
            {allCalendars.length > 0 && (
              <Button
                onClick={() => setNewEventModal(true)}
                leftSection={<TbCalendarPlus />}
                variant="light"
              >
                Create event
              </Button>
            )}
          </Flex>
          <Flex align="center" style={{ gap: '5px' }}>
            <Title order={2} style={{ userSelect: 'none' }} mr={10}>
              {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </Title>
            <ActionIcon variant="default" onClick={previousMonth}>
              <TbChevronLeft />
            </ActionIcon>
            <Button variant="default" size="xs" onClick={jumpToday}>
              Today
            </Button>
            <ActionIcon variant="default" onClick={nextMonth}>
              <TbChevronRight />
            </ActionIcon>
          </Flex>
        </Flex>
        {selectedView.id === 'month' && (
          <MonthlyView
            date={selectedDate}
            events={allEvents}
            calendars={allCalendars}
          />
        )}
      </Flex>
      <Modal
        opened={editCalendarModal}
        onClose={() => setEditCalendarModal(false)}
        centered
        title="Edit calendars"
      ></Modal>
      <Modal
        opened={newCalendarModal}
        onClose={() => setNewCalendarModal(false)}
        centered
        title="Create calendar"
      >
        <form
          onSubmit={newCalendarForm.onSubmit((values) =>
            createCalendar(values),
          )}
        >
          <Flex direction="column" gap="xs">
            <TextInput
              label="Calendar name"
              withAsterisk
              {...newCalendarForm.getInputProps('name')}
            />
            <ColorInput
              label="Calendar color"
              withAsterisk
              {...newCalendarForm.getInputProps('color')}
            />
            <Button type="submit" variant="light">
              Create
            </Button>
          </Flex>
        </form>
      </Modal>
      <Modal
        opened={newEventModal}
        onClose={() => setNewEventModal(false)}
        centered
        title="Create event"
      >
        <form onSubmit={newEventForm.onSubmit((values) => createEvent(values))}>
          <Flex direction="column" gap="xs">
            <TextInput
              label="Event name"
              withAsterisk
              {...newEventForm.getInputProps('name')}
            />
            <Textarea
              label="Event description"
              {...newEventForm.getInputProps('description')}
            />
            {allCalendars.length > 0 && (
              <Select
                label="Calendar"
                data={allCalendars}
                withAsterisk
                {...newEventForm.getInputProps('calendar')}
              />
            )}
            <Checkbox
              label="All-day event"
              checked={newEventAllDay}
              onChange={(evt) => setNewEventAllDay(evt.currentTarget.checked)}
            />
            {newEventAllDay && (
              <Flex direction="row" gap="xs">
                <DatePickerInput
                  label="Start date"
                  style={{ flex: 1 }}
                  placeholder="Select a date"
                  withAsterisk
                  {...newEventForm.getInputProps('startTime')}
                />
                <DatePickerInput
                  label="End date"
                  style={{ flex: 1 }}
                  placeholder="Select a date"
                  withAsterisk
                  {...newEventForm.getInputProps('endTime')}
                />
              </Flex>
            )}
            {!newEventAllDay && (
              <Flex direction="row" gap="xs">
                <DateTimePicker
                  label="Start time"
                  style={{ flex: 1 }}
                  placeholder="Select a date & time"
                  withAsterisk
                  {...newEventForm.getInputProps('startTime')}
                />
                <DateTimePicker
                  label="End time"
                  style={{ flex: 1 }}
                  placeholder="Select a date & time"
                  withAsterisk
                  {...newEventForm.getInputProps('endTime')}
                />
              </Flex>
            )}
            <Button type="submit" variant="light">
              Create
            </Button>
          </Flex>
        </form>
      </Modal>
    </Container>
  );
}

type CalendarViewProps = {
  date: Date;
  events: CalendarEvent[];
  calendars: CalendarDropdown[];
};

function MonthlyView({ date, events, calendars }: CalendarViewProps) {
  const [thisMonth, setThisMonth] = useState(
    new Date(date.getFullYear(), date.getMonth() + 1, 0),
  );

  useEffect(() => {
    setThisMonth(new Date(date.getFullYear(), date.getMonth() + 1, 0));
  }, [date]);

  return (
    <SimpleGrid cols={7} spacing="xs" verticalSpacing="xs">
      {[...Array(7)].map((_, i) => (
        <span key={i}>
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
      {[...Array(thisMonth.getDate())].map((_, i) => (
        <MonthlyDate
          calendars={calendars}
          key={`${i}-${thisMonth.getMonth()}-${thisMonth.getFullYear()}`}
          date={new Date(date.getFullYear(), date.getMonth(), i + 1)}
          events={events.filter((evt) => {
            const dayStart = new Date(
              date.getFullYear(),
              date.getMonth(),
              i + 1,
            );
            const dayEnd = new Date(date.getFullYear(), date.getMonth(), i + 2);
            dayEnd.setMilliseconds(dayEnd.getMilliseconds() - 1);
            const start = new Date(evt.start);
            const end = new Date(evt.end);

            if (evt.allDay && dayStart >= start && dayEnd <= end) {
              return true;
            }

            if (!evt.allDay && dayStart <= start && dayEnd >= end) {
              return true;
            }

            return false;
          })}
        />
      ))}
    </SimpleGrid>
  );
}

type MonthlyDateProps = {
  date: Date;
  events: CalendarEvent[];
  calendars: CalendarDropdown[];
};

function MonthlyDate({ date, events, calendars }: MonthlyDateProps) {
  const [day, setDay] = useState(date.getDay());
  const today = useMemo(() => new Date(), []);
  const [isToday, setIsToday] = useState(
    date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear(),
  );

  useEffect(() => {
    setDay(date.getDay());
    setIsToday(
      date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
    );
  }, [date, today]);

  return (
    <AspectRatio
      ratio={1}
      style={{ gridColumn: day === 0 ? 7 : day, borderRadius: '5px' }}
      bg="dark.6"
    >
      <Flex align="flex-start" direction="column" justify="flex-start" p="xs">
        <Flex justify="flex-end" w="100%">
          <Flex
            h={30}
            bg={isToday ? 'red.8' : 'transparent'}
            w={30}
            align="center"
            justify="center"
            style={{ borderRadius: '50%', fontWeight: 600 }}
          >
            {date.getDate()}
          </Flex>
        </Flex>
        <Flex direction="column" style={{ gap: '5px', marginTop: '5px' }}>
          {events
            .sort((a, b) => {
              if (a.allDay && !b.allDay) {
                return -1;
              }

              if (!a.allDay && b.allDay) {
                return 1;
              }

              if (a.start < b.start) {
                return -1;
              }

              if (a.start > b.start) {
                return 1;
              }

              return 0;
            })
            .map((evt, index) => {
              const eventCalendar = calendars.find(
                (cal) => cal.value === evt.calendarId,
              );
              if (evt.allDay) {
                return (
                  <Badge key={index} color={eventCalendar.color}>
                    <Flex wrap="wrap">
                      <Text truncate="end" size="xs" style={{ flex: 1 }}>
                        {evt.name}
                      </Text>
                    </Flex>
                  </Badge>
                );
              }

              return (
                <Badge
                  variant="dot"
                  color={eventCalendar.color}
                  key={index}
                  bg="dark.5"
                  tt="none"
                >
                  <Flex
                    wrap="wrap"
                    style={{
                      gap: '5px',
                    }}
                    align="center"
                  >
                    <Text truncate="end" size="sm" style={{ flex: 1 }}>
                      {evt.name}
                    </Text>
                    <Text size="xs" c="dark.1">
                      {new Date(evt.start).getHours()}:
                      {new Date(evt.start).getMinutes()}
                    </Text>
                  </Flex>
                </Badge>
              );
            })}
        </Flex>
      </Flex>
    </AspectRatio>
  );
}

export default Calendar;

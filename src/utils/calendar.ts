import NepaliDate from 'nepali-datetime'

const DAYS_IN_WEEK = 7

export interface ICalendarDate {
  index: number
  active: boolean
  year: number
  month: number
  date: number | null
}

const getMonthData = (year: number, month: number) => {
  try {
    return NepaliDate.getDaysOfMonth(year, month)
  } catch {
    return null
  }
}

export const getCalendarTableArray = (year: number, month: number): ICalendarDate[] => {
  const currentMonthDays = getMonthData(year, month)
  if (!currentMonthDays) {
    return []
  }

  const startWeekDay = new NepaliDate(year, month, 1).getDay()

  const [prevMonthYear, prevMonth] = month === 0 ? [year - 1, 11] : [year, month - 1]
  const prevMonthDays = getMonthData(prevMonthYear, prevMonth)

  const [nextMonthYear, nextMonth] = month === 11 ? [year + 1, 0] : [year, month + 1]

  const totalCalendarDays =
    Math.ceil((startWeekDay + currentMonthDays) / DAYS_IN_WEEK) * DAYS_IN_WEEK

  const calendar: ICalendarDate[] = Array(totalCalendarDays)
    .fill(null)
    .map((_, index) => {
      let calendarDate, calendarMonth, calendarYear, active

      if (index < startWeekDay) {
        // Previous month
        calendarDate = prevMonthDays ? prevMonthDays - (startWeekDay - index - 1) : null
        calendarMonth = prevMonth
        calendarYear = prevMonthYear
        active = false
      } else if (index < startWeekDay + currentMonthDays) {
        // Current month
        calendarDate = index - startWeekDay + 1
        calendarMonth = month
        calendarYear = year
        active = true
      } else {
        // Next month
        calendarDate = index - (startWeekDay + currentMonthDays) + 1
        calendarMonth = nextMonth
        calendarYear = nextMonthYear
        active = false
      }

      return {
        index,
        active,
        year: calendarYear,
        month: calendarMonth,
        date: calendarDate,
      }
    })

  return calendar
}

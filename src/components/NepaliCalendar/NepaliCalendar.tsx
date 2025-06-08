import { useEffect, useState } from 'react'
import NepaliDate from 'nepali-datetime'

import YearSelector from '../core/YearMonthSelector/YearSelector'
import MonthSelector from '../core/YearMonthSelector/MonthSelector'
import {
  DEFAULT_LOCALE,
  LOCALE_NE,
  MAX_NEPALI_YEAR,
  MIN_NEPALI_YEAR,
  WEEKDAYS_SHORT_EN,
  WEEKDAYS_SHORT_NE,
} from '../../constants'
import { getCalendarTableArray, ICalendarDate } from '../../utils/calendar'
import classNames from '../../utils/classNames'
import type { Locale } from '../../types'

import styles from './NepaliCalendar.module.scss'
import { nepaliNumber } from '../../utils/nepaliNumber'

export interface INepaliCalendarProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  selectedNepaliDate?: NepaliDate | null
  onDateSelect?: ((nepaliDate: NepaliDate) => void) | null
  locale?: Locale
}

const NepaliCalendar: React.FC<INepaliCalendarProps> = ({
  selectedNepaliDate,
  onDateSelect = null,
  locale = DEFAULT_LOCALE,
}) => {
  const now = new NepaliDate()
  const weekDays = locale === LOCALE_NE ? WEEKDAYS_SHORT_NE : WEEKDAYS_SHORT_EN

  const [selectedYear, setSelectedYear] = useState(now.getYear())
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())

  useEffect(() => {
    if (!selectedNepaliDate) {
      return
    }
    setSelectedYear(selectedNepaliDate?.getYear())
    setSelectedMonth(selectedNepaliDate?.getMonth())
  }, [selectedNepaliDate])

  const isCurrentDate = (calendarDate: ICalendarDate) =>
    calendarDate.year === now.getYear() &&
    calendarDate.month === now.getMonth() &&
    calendarDate.date === now.getDate()

  const isSelectedDate = (calendarDate: ICalendarDate) =>
    selectedNepaliDate &&
    calendarDate.year === selectedNepaliDate.getYear() &&
    calendarDate.month === selectedNepaliDate.getMonth() &&
    calendarDate.date === selectedNepaliDate.getDate()

  const handleDateSelect = (calendarDate: ICalendarDate) => {
    if (!calendarDate.active || !calendarDate.date || !onDateSelect) {
      return
    }

    onDateSelect(new NepaliDate(selectedYear, selectedMonth, calendarDate.date))
  }

  const setPrevMonth = () => {
    if (selectedYear === MIN_NEPALI_YEAR && selectedMonth === 0) {
      return
    }

    const [prevMonthYear, prevMonth] =
      selectedMonth === 0 ? [selectedYear - 1, 11] : [selectedYear, selectedMonth - 1]
    setSelectedYear(prevMonthYear)
    setSelectedMonth(prevMonth)
  }

  const setNextMonth = () => {
    if (selectedYear === MAX_NEPALI_YEAR && selectedMonth === 11) {
      return
    }

    const [prevMonthYear, prevMonth] =
      selectedMonth === 11 ? [selectedYear + 1, 0] : [selectedYear, selectedMonth + 1]
    setSelectedYear(prevMonthYear)
    setSelectedMonth(prevMonth)
  }

  //function used by the home icon to get to the current date
  const getToCurrentDate = () => {
    const currentDate = new NepaliDate()
    setSelectedYear(currentDate.getYear())
    setSelectedMonth(currentDate.getMonth())

    if (onDateSelect) {
      onDateSelect(currentDate)
    }
  }

  const calendarArray = getCalendarTableArray(selectedYear, selectedMonth)

  return (
    <div className="ndt-calendar">
      <div className={`ndt-calendar-controls ${styles.calendarControls}`}>
        <div className={`ndt-prev ${styles.prevNext}`}>
          <span onClick={setPrevMonth}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                fillRule="evenodd"
                stroke="currentcolor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.4"
                d="M16.283 18.907L9.6 12l6.683-5.438"
              ></path>
            </svg>
          </span>
        </div>
        <div className={`ndt-prev ${styles.prevNext}`}>
          <span onClick={setPrevMonth}>
            <div className={`ndt-prev ${styles.prevNext}`}>
              <span onClick={getToCurrentDate}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 1024 1024"
                >
                  <path d="M946.5 505L534.6 93.4a31.93 31.93 0 0 0-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3 0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8 24.9-25 24.9-65.5-.1-90.5z" />
                </svg>
              </span>
            </div>
          </span>
        </div>
        <div>
          <YearSelector
            selectedYear={selectedYear}
            onChange={newYear => setSelectedYear(newYear)}
            locale={locale}
          />
          <MonthSelector
            selectedMonth={selectedMonth}
            onChange={newMonth => setSelectedMonth(newMonth)}
            locale={locale}
          />
        </div>
        <div className={`ndt-next ${styles.prevNext}`}>
          <span onClick={setNextMonth}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
            >
              <path
                transform="rotate(180 12 12)"
                fill="none"
                fillRule="evenodd"
                stroke="currentcolor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.4"
                d="M16.283 18.907L9.6 12l6.683-5.438"
              ></path>
            </svg>
          </span>
        </div>
      </div>
      <div className={`ndt-calendar-container ${styles.calendarContainer}`}>
        <div className={`ndt-calendar-grid ${styles.calendarGrid}`}>
          {weekDays.map(weekShort => (
            <div
              key={weekShort}
              className={classNames(
                'ndt-calendar-cell-header',
                styles.calendarCellHeader,
                styles.calendarCell
              )}
            >
              {weekShort}
            </div>
          ))}
        </div>
        <div className={`ndt-calendar-grid ${styles.calendarGrid}`}>
          {calendarArray.map(calendarDate => (
            <div
              onClick={() => handleDateSelect(calendarDate)}
              key={calendarDate.index}
              className={classNames(
                'ndt-calendar-cell',
                styles.calendarCell,
                isSelectedDate(calendarDate) &&
                  classNames('ndt-calendar-cell-selected', styles.calendarCellSelected),
                isCurrentDate(calendarDate) &&
                  classNames('ndt-calendar-cell-current', styles.calendarCellCurrent),
                !calendarDate.active && styles.calendarCellInactive
              )}
            >
              {calendarDate.date && locale === LOCALE_NE
                ? nepaliNumber(calendarDate.date)
                : calendarDate.date}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NepaliCalendar

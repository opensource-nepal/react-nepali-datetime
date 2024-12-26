import { useState } from 'react'
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

  const [selectedYear, setSelectedYear] = useState(
    selectedNepaliDate?.getYear() ?? now.getYear()
  )
  const [selectedMonth, setSelectedMonth] = useState(
    selectedNepaliDate?.getMonth() ?? now.getMonth()
  )

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
              className={classNames('ndt-calendar-header', styles.calendarCell)}
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

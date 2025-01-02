import React, { useState, ReactElement, useEffect } from 'react'
import NepaliCalendar from './NepaliCalendar'
import Popover from './core/Popover'
import NepaliDate from 'nepali-datetime'
import { DEFAULT_LOCALE, LOCALE_NE } from '../constants'
import type { Locale } from '../types'
import { englishNumber } from '../utils/nepaliNumber'
import classNames from '../utils/classNames'
import NepaliDateInput from './NepaliDateInput'

interface INepaliDatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string
  format?: string
  inputElement?: ReactElement | null
  locale?: Locale
  onDateSelect?: ((value: string, nepaliDate?: NepaliDate) => void) | null
}

const getNepaliDateOrNull = (
  nepaliDateStr: string,
  format: string,
  locale: Locale
): NepaliDate | null => {
  const value = locale === LOCALE_NE ? englishNumber(nepaliDateStr) : nepaliDateStr

  try {
    return new NepaliDate(value, format)
  } catch {
    return null
  }
}

const NepaliDatePicker: React.FC<INepaliDatePickerProps> = ({
  value = '',
  format = 'YYYY-MM-DD',
  inputElement,
  onDateSelect,
  locale = DEFAULT_LOCALE,
  ...rest
}) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [npDate, setNpDate] = useState<NepaliDate | null>()

  useEffect(() => {
    setInputValue(value)
    setNpDate(getNepaliDateOrNull(value, format, locale))
  }, [value, locale, format])

  const updateDate = (nepaliDate: NepaliDate) => {
    const formattedValue =
      locale === LOCALE_NE ? nepaliDate.formatNepali(format) : nepaliDate.format(format)
    setInputValue(formattedValue)
    setNpDate(nepaliDate)
    onDateSelect?.(formattedValue)
  }

  const handleDateSelect = (nepaliDate: NepaliDate) => {
    updateDate(nepaliDate)
    setIsPopoverVisible(false)
  }

  const handleDateChange = (_: string, nepaliDate: NepaliDate | null) => {
    if (!nepaliDate) {
      return
    }

    updateDate(nepaliDate)
  }

  return (
    <Popover
      className={classNames('ndt-date-picker')}
      open={isPopoverVisible}
      onOpenChange={newOpen => setIsPopoverVisible(newOpen)}
      content={
        <NepaliCalendar
          locale={locale}
          selectedNepaliDate={npDate}
          onDateSelect={handleDateSelect}
        />
      }
    >
      <NepaliDateInput
        value={inputValue}
        format={format}
        inputElement={inputElement}
        onDateChange={handleDateChange}
        locale={locale}
        {...rest}
      />
    </Popover>
  )
}

export default NepaliDatePicker

import React, { useState, ReactElement, cloneElement, useEffect } from 'react'
import NepaliCalendar from './NepaliCalendar'
import Popover from './core/Popover'
import NepaliDate from 'nepali-datetime'
import PickerInput from './core/PickerInput'
import { DEFAULT_LOCALE, LOCALE_NE } from '../constants'
import type { Locale } from '../types'
import { englishNumber } from '../utils/nepaliNumber'

interface INepaliDatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string
  format?: string
  inputElement?: ReactElement | null
  locale?: Locale
  onDateSelect?: ((value: string) => void) | null
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
  inputElement = null,
  onDateSelect = null,
  locale = DEFAULT_LOCALE,
  ...rest
}) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  const inputProps = { value: inputValue, readOnly: true }

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const setDateValue = (dateValue: string) => {
    setInputValue(dateValue)
    if (onDateSelect) {
      onDateSelect(dateValue)
    }
  }

  const handleSetDate = (nepaliDate: NepaliDate) => {
    const inputValue =
      locale === LOCALE_NE ? nepaliDate.formatNepali(format) : nepaliDate.format(format)
    setDateValue(inputValue)
    setIsPopoverVisible(false)
  }

  // updating props to custom input element
  const customInputElement =
    inputElement && cloneElement(inputElement, { ...rest, ...inputProps })

  return (
    <Popover
      className="ndt-date-picker"
      open={isPopoverVisible}
      onOpenChange={newOpen => setIsPopoverVisible(newOpen)}
      content={
        <NepaliCalendar
          locale={locale}
          selectedNepaliDate={getNepaliDateOrNull(inputValue, format, locale)}
          onDateSelect={handleSetDate}
        />
      }
    >
      {customInputElement || <PickerInput {...rest} {...inputProps} />}
    </Popover>
  )
}

export default NepaliDatePicker

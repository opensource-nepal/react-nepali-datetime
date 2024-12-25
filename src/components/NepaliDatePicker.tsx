import React, { useState, ReactElement, cloneElement, useEffect } from 'react'
import NepaliCalendar from './NepaliCalendar'
import Popover from './core/Popover'
import NepaliDate from 'nepali-datetime'
import PickerInput from './core/PickerInput'
import { DEFAULT_LOCALE, LOCALE_NE } from '../constants'
import type { Locale } from '../types'
import { englishNumber } from '../utils/nepaliNumber'
import classNames from '../utils/classNames'
import styles from './NepaliDatePicker.module.scss'

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
  inputElement = null,
  onDateSelect = null,
  locale = DEFAULT_LOCALE,
  ...rest
}) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [npDate, setNpDate] = useState<NepaliDate | null>()

  const isDateValueError = inputValue && !npDate

  useEffect(() => {
    setInputValue(value)
    setNpDate(getNepaliDateOrNull(value, format, locale))
  }, [value, locale, format])

  const callOnDateSelect = (dateValue: string, nepaliDate?: NepaliDate) =>
    onDateSelect && onDateSelect(dateValue, nepaliDate)

  const emptyDateValue = () => {
    setInputValue('')
    setNpDate(null)
    callOnDateSelect('')
  }

  const updateDateByNepaliDate = (nepaliDate: NepaliDate) => {
    const formattedValue =
      locale === LOCALE_NE ? nepaliDate.formatNepali(format) : nepaliDate.format(format)
    setInputValue(formattedValue)
    setNpDate(nepaliDate)
    callOnDateSelect(formattedValue, nepaliDate)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value

    const npDateObj = getNepaliDateOrNull(dateValue, format, locale)
    setInputValue(dateValue)
    setNpDate(npDateObj)
  }

  const handleDateSelect = (nepaliDate: NepaliDate) => {
    updateDateByNepaliDate(nepaliDate)
    setIsPopoverVisible(false)
  }

  const setFinalValue = () => {
    if (isDateValueError) {
      // setting empty value if the user input date is invalid
      emptyDateValue()
    } else if (npDate) {
      // not every user input date are in format, so reformatting the date again
      updateDateByNepaliDate(npDate)
    }
  }

  const handlePopoverOpenChange = (newOpen: boolean) => {
    setIsPopoverVisible(newOpen)
    if (!newOpen) {
      setFinalValue()
    }
  }

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      setFinalValue()
    }
  }

  const inputProps = {
    value: inputValue,
    onChange: handleInputChange,
    onKeyDown: handleEnter,
  }

  // updating props to custom input element
  const customInputElement =
    inputElement && cloneElement(inputElement, { ...rest, ...inputProps })

  return (
    <Popover
      className={classNames(
        'ndt-date-picker',
        isDateValueError && styles.datePickerInputError
      )}
      open={isPopoverVisible}
      onOpenChange={handlePopoverOpenChange}
      content={
        <NepaliCalendar
          locale={locale}
          selectedNepaliDate={npDate}
          onDateSelect={handleDateSelect}
        />
      }
    >
      {customInputElement || <PickerInput {...rest} {...inputProps} />}
    </Popover>
  )
}

export default NepaliDatePicker

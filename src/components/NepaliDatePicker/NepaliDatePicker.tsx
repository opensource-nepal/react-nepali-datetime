import React, { useState, ReactElement, useEffect, useRef, useCallback } from 'react'
import NepaliCalendar from '../NepaliCalendar'
import Popover from '../core/Popover'
import NepaliDate from 'nepali-datetime'
import { DEFAULT_LOCALE } from '../../constants'
import type { Locale } from '../../types'
import classNames from '../../utils/classNames'
import NepaliDateInput from '../core/NepaliDateInput'
import { formatNepaliDate, getNepaliDateOrNull } from '../../utils/nepaliDate'

interface INepaliDatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string
  format?: string
  inputElement?: ReactElement | null
  locale?: Locale
  onDateSelect?: ((value: string, nepaliDate: NepaliDate | null) => void) | null
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
  const [nepaliDate, setNepaliDate] = useState<NepaliDate | null>()

  const isCalendarClicked = useRef<boolean>(false)

  const hasInputValueError = Boolean(inputValue && !nepaliDate)

  /**
   * Reformats the `inputValue` based on the current `nepaliDate`.
   * This function is triggered when the date input loses focus or when the user hovers
   * on the calendar.
   *
   * Purpose:
   * Case 1: The user enters random text that is not a valid date.
   * If the input contains an invalid date, the value should be cleared to prevent form
   * submission in cases where the field is required. To notify the user of the invalid
   * input, the text is displayed in red.
   *
   * Case 2: The date format is YYYY-MM-DD, but the user types '2081-4-9'.
   * While '2081-4-9' is correctly parsed by `NepaliDate` into the NepaliDate object
   * `2081-04-09`, it does not match the expected format. To ensure consistency, the
   * date is reformatted into the specified format.
   */
  const reformatInputValue = useCallback(() => {
    if (hasInputValueError) {
      // Case 1
      setInputValue('')
      onDateSelect?.('', null)
      return
    }

    if (nepaliDate) {
      // Case 2
      const formattedValue = formatNepaliDate(nepaliDate, format, locale)
      setInputValue(formattedValue)
      onDateSelect?.(formattedValue, nepaliDate)
    }
  }, [format, hasInputValueError, locale, nepaliDate, onDateSelect])

  useEffect(() => {
    setInputValue(value)
    setNepaliDate(getNepaliDateOrNull(value, format, locale))
  }, [value, locale, format])

  const handleDateSelect = (npDate: NepaliDate) => {
    const formattedValue = formatNepaliDate(npDate, format, locale)
    setInputValue(formattedValue)
    setNepaliDate(npDate)
    onDateSelect?.(formattedValue, npDate)
    setIsPopoverVisible(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    const npDate = getNepaliDateOrNull(dateValue, format, locale)
    setInputValue(dateValue)
    setNepaliDate(npDate)
    if (npDate) {
      // call onDateSelect if user inputs the valid date
      onDateSelect?.(dateValue, npDate)
    }
  }

  const handleInputComplete = () => {
    if (isCalendarClicked.current) {
      // This function is triggered when the input loses focus.
      // But, if the calendar was clicked, the input loses the focus too, but the user
      // is still interacting with the NepaliDatePicker. Therefore, 'isCalendarClicked'
      // flag is set to true when the calendar is clicked, preventing the calendar from
      // closing on a focusout event of input.
      isCalendarClicked.current = false
      return
    }

    reformatInputValue()
    setIsPopoverVisible(false)
  }

  return (
    <Popover
      className={classNames('ndt-date-picker')}
      open={isPopoverVisible}
      onOpenChange={newOpen => setIsPopoverVisible(newOpen)}
      onContentMouseDown={() => {
        // NepaliDateInput onComplete (blur) will use the value of isCalendarClicked (ref handleInputComplete)
        isCalendarClicked.current = true
      }}
      onContentBlur={() => {
        // reset isCalendarClicked if the user leaving the calendar
        isCalendarClicked.current = false
      }}
      onContentMouseEnter={() => reformatInputValue()}
      content={
        <NepaliCalendar
          locale={locale}
          selectedNepaliDate={nepaliDate}
          onDateSelect={handleDateSelect}
        />
      }
    >
      <NepaliDateInput
        value={inputValue}
        inputElement={inputElement}
        hasError={hasInputValueError}
        onChange={handleInputChange}
        onComplete={handleInputComplete}
        onFocus={() => setIsPopoverVisible(true)}
        {...rest}
      />
    </Popover>
  )
}

export default NepaliDatePicker

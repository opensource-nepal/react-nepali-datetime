import NepaliDate from 'nepali-datetime'
import { cloneElement, ReactElement, useEffect, useState } from 'react'
import { Locale } from '../../types'
import { DEFAULT_LOCALE, LOCALE_NE } from '../../constants'
import classNames from '../../utils/classNames'

import styles from './NepaliDateInput.module.scss'
import getNepaliDateOrNull from '../../utils/getNepaliDateOrNull'

const KEY_ENTER = 'Enter'

const formatNepaliDate = (nepaliDate: NepaliDate, format: string, locale: Locale) =>
  locale === LOCALE_NE ? nepaliDate.formatNepali(format) : nepaliDate.format(format)

interface INepaliDateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string
  format?: string
  inputElement?: ReactElement | null
  locale?: Locale
  onDateChange?: ((value: string, nepaliDate: NepaliDate | null) => void) | null
}

const NepaliDateInput: React.FC<INepaliDateInputProps> = ({
  value = '',
  format = 'YYYY-MM-DD',
  inputElement,
  onDateChange,
  locale = DEFAULT_LOCALE,
  className,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState(value)
  const [npDate, setNpDate] = useState<NepaliDate | null>()
  const isDateValueError = inputValue && !npDate

  useEffect(() => {
    setInputValue(value)
    setNpDate(getNepaliDateOrNull(value, format, locale))
  }, [value, locale, format])

  const emptyDateValue = () => {
    setInputValue('')
    setNpDate(null)
    onDateChange?.('', null)
  }

  const reformatDateValue = (nepaliDate: NepaliDate) => {
    const formattedValue = formatNepaliDate(nepaliDate, format, locale)

    setInputValue(formattedValue)
    setNpDate(nepaliDate)
    onDateChange?.(formattedValue, nepaliDate)
  }

  const setFinalValue = () => {
    if (isDateValueError) {
      // setting empty value if the user input date is invalid
      emptyDateValue()
    } else if (npDate) {
      // not every user input date are in format, so reformatting the date again
      reformatDateValue(npDate)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value

    const npDateObj = getNepaliDateOrNull(dateValue, format, locale)
    setInputValue(dateValue)
    setNpDate(npDateObj)
    if (npDateObj) {
      const newFormattedDate = formatNepaliDate(npDateObj, format, locale)
      if (dateValue === newFormattedDate) {
        onDateChange?.(dateValue, npDateObj)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEY_ENTER) {
      setFinalValue()
    }
  }

  const handleBlur = () => {
    setFinalValue()
  }

  const inputProps = {
    value: inputValue,
    onChange: handleInputChange,
    onKeyDown: handleKeyDown,
    onBlur: handleBlur,
    className: classNames(
      'ndt-picker-input',
      styles.nepaliDateInput,
      isDateValueError && styles.nepaliDateInputError,
      className
    ),
  }

  if (inputElement) {
    return cloneElement(inputElement, { ...rest, ...inputProps })
  }

  return <input type="text" {...rest} {...inputProps} />
}

export default NepaliDateInput

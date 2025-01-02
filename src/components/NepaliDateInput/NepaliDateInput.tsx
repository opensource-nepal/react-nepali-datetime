import NepaliDate from 'nepali-datetime'
import {
  cloneElement,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
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
  const npDateRef = useRef<NepaliDate | null>()

  // for caching, only use updateDate for updating the value
  const npDateFormatted = useRef<string>('')

  const isDateValueError = inputValue && !npDateRef.current

  const updateDate = useCallback(
    (dateValue: string, npDate: NepaliDate | null) => {
      setInputValue(dateValue)
      // TODO: check the time of both dates
      npDateRef.current = npDate
      npDateFormatted.current = npDate ? formatNepaliDate(npDate, format, locale) : ''
    },
    [format, locale]
  )

  useEffect(() => {
    // re-update the states when the props get changed

    const npDateObj = getNepaliDateOrNull(value, format, locale)
    if (!npDateObj) {
      updateDate(value, null)
      return
    }

    const npDate = npDateRef.current
    // TODO: use npDateFormatted for comparison
    const currentFormattedDate = npDate && formatNepaliDate(npDate, format, locale)
    if (value !== currentFormattedDate) {
      updateDate(value, npDateObj)
    }
  }, [format, locale, value, updateDate])

  const setFinalValue = () => {
    if (isDateValueError) {
      // setting empty value if the user input date is invalid
      updateDate('', null)
      onDateChange?.('', null)
    } else if (npDateRef.current) {
      // user can input incorrect format date(but), so reformatting the date again
      setInputValue(npDateFormatted.current)
      onDateChange?.(npDateFormatted.current, npDateRef.current)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value

    const npDateObj = getNepaliDateOrNull(dateValue, format, locale)
    updateDate(dateValue, npDateObj)
    if (npDateObj) {
      onDateChange?.(dateValue, npDateObj)
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

import { cloneElement, ReactElement } from 'react'
import classNames from '../../../utils/classNames'

import styles from './NepaliDateInput.module.scss'

const KEY_ENTER = 'Enter'

interface INepaliDateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputElement?: ReactElement | null
  onComplete?: () => void
  hasError?: boolean
}

const NepaliDateInput: React.FC<INepaliDateInputProps> = ({
  value,
  inputElement,
  className,
  hasError,
  onComplete,
  onChange,
  ...rest
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) =>
    e.key === KEY_ENTER && onComplete?.()

  const handleBlur = () => onComplete?.()

  const inputProps = {
    ...rest,
    value,
    onChange,
    autoComplete: 'off',
    onKeyDown: handleKeyDown,
    onBlur: handleBlur,
    className: classNames(
      'ndt-date-input',
      styles.nepaliDateInput,
      hasError && styles.nepaliDateInputError,
      className
    ),
  }

  if (inputElement) {
    return cloneElement(inputElement, inputProps)
  }

  return <input type="text" {...inputProps} />
}

export default NepaliDateInput

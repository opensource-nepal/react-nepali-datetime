import React from 'react'
import { MAX_NEPALI_YEAR, MIN_NEPALI_YEAR } from '../../constants'
import styles from './Selector.module.scss'

const YEARS = Array.from(
  { length: MAX_NEPALI_YEAR - MIN_NEPALI_YEAR + 1 },
  (_, i) => i + MIN_NEPALI_YEAR
)

interface IYearSelectionProps {
  selectedYear: number
  onChange?: (newYear: number) => void
}

const YearSelector: React.FC<IYearSelectionProps> = ({
  selectedYear,
  onChange: onYearChange,
}) => (
  <select
    value={selectedYear}
    onChange={e => onYearChange && onYearChange(Number(e.target.value))}
    className={`${styles.selector}`}
  >
    {YEARS.map(year => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>
)

export default YearSelector

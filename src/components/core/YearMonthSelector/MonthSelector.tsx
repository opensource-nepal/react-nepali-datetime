import styles from './YearMonthSelector.module.scss'
import {
  DEFAULT_LOCALE,
  LOCALE_NE,
  NEPALI_MONTHS_EN,
  NEPALI_MONTHS_NE,
} from '../../../constants'
import { Locale } from '../../../types'

interface IMonthSelectionProps {
  selectedMonth: number
  onChange?: (newMonth: number) => void
  locale?: Locale
}

const getNepaliMonths = (locale: Locale) =>
  locale === LOCALE_NE ? NEPALI_MONTHS_NE : NEPALI_MONTHS_EN

const MonthSelector: React.FC<IMonthSelectionProps> = ({
  selectedMonth,
  onChange: onMonthChange,
  locale = DEFAULT_LOCALE,
}) => (
  <select
    value={selectedMonth}
    onChange={e => onMonthChange && onMonthChange(Number(e.target.value))}
    className={styles.selector}
  >
    {getNepaliMonths(locale).map((month, monthIndex) => (
      <option key={month} value={monthIndex}>
        {month}
      </option>
    ))}
  </select>
)

export default MonthSelector

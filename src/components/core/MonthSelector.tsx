import { NEPALI_MONTHS_EN } from '../../constants'
import styles from './Selector.module.scss'

interface IMonthSelectionProps {
  selectedMonth: number
  onChange?: (newMonth: number) => void
}

const MonthSelector: React.FC<IMonthSelectionProps> = ({
  selectedMonth,
  onChange: onMonthChange,
}) => (
  <select
    value={selectedMonth}
    onChange={e => onMonthChange && onMonthChange(Number(e.target.value))}
    className={`${styles.selector} ${styles.monthSelector}`}
  >
    {NEPALI_MONTHS_EN.map((month, month0) => (
      <option key={month} value={month0}>
        {month}
      </option>
    ))}
  </select>
)

export default MonthSelector

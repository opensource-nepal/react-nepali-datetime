import {
  DEFAULT_LOCALE,
  LOCALE_NE,
  MAX_NEPALI_YEAR,
  MIN_NEPALI_YEAR,
} from '../../constants'
import { Locale } from '../../types'
import { nepaliNumber } from '../../utils/nepaliNumber'

const YEARS = Array.from(
  { length: MAX_NEPALI_YEAR - MIN_NEPALI_YEAR + 1 },
  (_, i) => i + MIN_NEPALI_YEAR
)

interface IYearSelectionProps {
  selectedYear: number
  onChange?: (newYear: number) => void
  locale?: Locale
}

const YearSelector: React.FC<IYearSelectionProps> = ({
  selectedYear,
  onChange: onYearChange,
  locale = DEFAULT_LOCALE,
}) => (
  <select
    value={selectedYear}
    onChange={e => onYearChange && onYearChange(Number(e.target.value))}
  >
    {YEARS.map(year => (
      <option key={year} value={year}>
        {locale === LOCALE_NE ? nepaliNumber(year) : year}
      </option>
    ))}
  </select>
)

export default YearSelector

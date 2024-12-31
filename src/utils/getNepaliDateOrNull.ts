import NepaliDate from 'nepali-datetime'
import { Locale } from '../types'
import { LOCALE_NE } from '../constants'
import { englishNumber } from './nepaliNumber'

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

export default getNepaliDateOrNull

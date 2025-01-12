import NepaliDate from 'nepali-datetime'
import { Locale } from '../types'
import { LOCALE_NE } from '../constants'
import { englishNumber } from './nepaliNumber'

export const formatNepaliDate = (
  nepaliDate: NepaliDate,
  format: string,
  locale: Locale
) =>
  locale === LOCALE_NE ? nepaliDate.formatNepali(format) : nepaliDate.format(format)

export const getNepaliDateOrNull = (
  nepaliDateStr: string,
  format: string,
  locale: Locale
): NepaliDate | null => {
  if (nepaliDateStr.trim() === '') {
    return null
  }

  const value = locale === LOCALE_NE ? englishNumber(nepaliDateStr) : nepaliDateStr

  try {
    return new NepaliDate(value, format)
  } catch {
    return null
  }
}

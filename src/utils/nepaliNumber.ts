import { NEPALI_NUMBERS } from '../constants'

export const nepaliNumber = (num: number | string) => {
  return num
    .toString()
    .split('')
    .map(digit => (!isNaN(Number(digit)) ? NEPALI_NUMBERS[Number(digit)] : digit))
    .join('')
}

export const englishNumber = (num: number | string) => {
  return num
    .toString()
    .split('')
    .map(char => (NEPALI_NUMBERS.includes(char) ? NEPALI_NUMBERS.indexOf(char) : char))
    .join('')
}

import NepaliDate from 'nepali-datetime'

export const NEPALI_NUMBERS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']

export const LOCALE_EN = 'en'
export const LOCALE_NE = 'ne'
export const DEFAULT_LOCALE = LOCALE_EN

export const MIN_NEPALI_YEAR = NepaliDate.minSupportedNepaliDate().getYear()
export const MAX_NEPALI_YEAR = NepaliDate.maxSupportedNepaliDate().getYear()

export const NEPALI_MONTHS_EN = [
  'Baisakh',
  'Jestha',
  'Asar',
  'Shrawan',
  'Bhadra',
  'Aswin',
  'Kartik',
  'Mangsir',
  'Poush',
  'Magh',
  'Falgun',
  'Chaitra',
]

export const NEPALI_MONTHS_NE = [
  'बैशाख',
  'जेठ',
  'असार',
  'श्रावण',
  'भाद्र',
  'आश्विन',
  'कार्तिक',
  'मंसिर',
  'पौष',
  'माघ',
  'फाल्गुण',
  'चैत्र',
]

export const WEEKDAYS_SHORT_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const WEEKDAYS_SHORT_NE = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि']

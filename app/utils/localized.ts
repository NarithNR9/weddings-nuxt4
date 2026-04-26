export function localized(obj: object, field: string, locale: string): string {
  const key = `${field}_${locale}`
  return ((obj as Record<string, unknown>)[key] as string) ?? ''
}

export function toKhmerDigits(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => '\u17E0\u17E1\u17E2\u17E3\u17E4\u17E5\u17E6\u17E7\u17E8\u17E9'[+d]!)
}

const KM_WEEKDAYS = [
  'ថ្ងៃអាទិត្យ',    // Sunday
  'ថ្ងៃច័ន្ទ',      // Monday
  'ថ្ងៃអង្គារ',     // Tuesday
  'ថ្ងៃពុធ',        // Wednesday
  'ថ្ងៃព្រហស្បតិ៍', // Thursday
  'ថ្ងៃសុក្រ',      // Friday
  'ថ្ងៃសៅរ៍',       // Saturday
]

const KM_MONTHS = [
  '\u1798\u1780\u179A\u17B6',       // org org org org
  '\u1780\u17BB\u1798\u17D2\u1797\u17C8',  // org org org org org org
  '\u1798\u17B8\u1793\u17B6',       // org org org org
  '\u1798\u17C1\u179F\u17B6',       // org org org org
  '\u17A7\u179F\u1797\u17B6',       // org org org org
  '\u1798\u17B7\u1790\u17BB\u1793\u17B6',  // org org org org org org
  '\u1780\u1780\u17D2\u1780\u178A\u17B6',  // org org org org org org
  '\u179F\u17B8\u17A0\u17B6',       // org org org org
  '\u1780\u1789\u17D2\u1789\u17B6',    // org org org org org
  '\u178F\u17BB\u179B\u17B6',       // org org org org
  '\u179C\u17B7\u1785\u17D2\u1786\u17B7\u1780\u17B6', // org org org org org org org org
  '\u1792\u17D2\u1793\u17BC',       // org org org org
]

export function formatFullDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr)
  const paddedDay = String(date.getDate()).padStart(2, '0')
  if (locale === 'km') {
    const weekday = KM_WEEKDAYS[date.getDay()]
    const day = toKhmerDigits(paddedDay)
    const month = KM_MONTHS[date.getMonth()]
    const year = toKhmerDigits(date.getFullYear())
    return `${weekday} \u1791\u17B8 ${day} \u1781\u17C2 ${month} \u1786\u17D2\u1793\u17B6\u17C6 ${year}`
  }
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(date)
}

export function formatTime(time: string, locale: string): string {
  const [hStr, mStr] = time.split(':')
  const h = parseInt(hStr!, 10)
  const m = parseInt(mStr ?? '0', 10)
  const mm = String(m).padStart(2, '0')

  if (locale === 'km') {
    let period = 'ព្រឹក'
    if (h >= 12 && h < 17) period = 'រសៀល'
    else if (h >= 17) period = 'ល្ងាច'
    const h12 = h % 12 || 12
    return `\u1798\u17C9\u17C4\u1784 ${toKhmerDigits(h12)}:${toKhmerDigits(mm)}\u1793\u17B6\u1791\u17B8 ${period}`
  }

  const period = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 || 12
  return `${h12}:${mm} ${period}`
}

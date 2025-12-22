import { differenceInDays } from 'date-fns'

/**
 * Parse Thai month abbreviation to month number
 */
const THAI_MONTHS: Record<string, number> = {
  'ม.ค.': 1,
  'ก.พ.': 2,
  'มี.ค.': 3,
  'เม.ย.': 4,
  'พ.ค.': 5,
  'มิ.ย.': 6,
  'ก.ค.': 7,
  'ส.ค.': 8,
  'ก.ย.': 9,
  'ต.ค.': 10,
  'พ.ย.': 11,
  'ธ.ค.': 12,
}

/**
 * Parse Thai date format to ISO date
 * Examples:
 * - "13-20 ก.พ." => { departure: "2026-02-13", return: "2026-02-20" }
 * - "29 ธ.ค. - 6 ม.ค." => { departure: "2024-12-29", return: "2025-01-06" } (handles year transition)
 */
export function parseThaiDateRange(
  dateStr: string,
  defaultYear: number = 2026
): { departure: string; return: string } | null {
  try {
    // Handle format: "29 ธ.ค. - 6 ม.ค." (year transition)
    const yearTransitionMatch = dateStr.match(/(\d+)\s+([ก-๙\.]+)\s*-\s*(\d+)\s+([ก-๙\.]+)/)
    if (yearTransitionMatch) {
      const [, day1, month1Abbr, day2, month2Abbr] = yearTransitionMatch
      const month1 = THAI_MONTHS[month1Abbr]
      const month2 = THAI_MONTHS[month2Abbr]

      if (!month1 || !month2) return null

      // If month2 < month1, it's a year transition
      const year1 = month1 === 12 ? defaultYear - 1 : defaultYear
      const year2 = month2 < month1 ? defaultYear : year1

      const departure = `${year1}-${String(month1).padStart(2, '0')}-${day1.padStart(2, '0')}`
      const returnDate = `${year2}-${String(month2).padStart(2, '0')}-${day2.padStart(2, '0')}`

      return { departure, return: returnDate }
    }

    // Handle format: "13-20 ก.พ." (same month)
    const sameMonthMatch = dateStr.match(/(\d+)-(\d+)\s+([ก-๙\.]+)/)
    if (sameMonthMatch) {
      const [, day1, day2, monthAbbr] = sameMonthMatch
      const month = THAI_MONTHS[monthAbbr]

      if (!month) return null

      const departure = `${defaultYear}-${String(month).padStart(2, '0')}-${day1.padStart(2, '0')}`
      const returnDate = `${defaultYear}-${String(month).padStart(2, '0')}-${day2.padStart(2, '0')}`

      return { departure, return: returnDate }
    }

    // Handle format: "25 ก.พ. - 6 มี.ค." (different months, same year)
    const diffMonthMatch = dateStr.match(/(\d+)\s+([ก-๙\.]+)\s*-\s*(\d+)\s+([ก-๙\.]+)/)
    if (diffMonthMatch) {
      const [, day1, month1Abbr, day2, month2Abbr] = diffMonthMatch
      const month1 = THAI_MONTHS[month1Abbr]
      const month2 = THAI_MONTHS[month2Abbr]

      if (!month1 || !month2) return null

      const departure = `${defaultYear}-${String(month1).padStart(2, '0')}-${day1.padStart(2, '0')}`
      const returnDate = `${defaultYear}-${String(month2).padStart(2, '0')}-${day2.padStart(2, '0')}`

      return { departure, return: returnDate }
    }

    return null
  } catch (error) {
    console.error('Error parsing Thai date:', dateStr, error)
    return null
  }
}

/**
 * Parse slots text to number
 * Examples:
 * - "รับ 6 ท่าน" => 6
 * - "เต็ม" => 0
 * - "เหลือ 4 ที่" => 4
 */
export function parseSlots(slotsStr: string): number {
  if (slotsStr === 'เต็ม') return 0

  const match = slotsStr.match(/\d+/)
  return match ? parseInt(match[0], 10) : 0
}

/**
 * Calculate trip duration in days and nights
 */
export function calculateDuration(departureDate: Date | string, returnDate: Date | string): {
  days: number
  nights: number
} {
  const departure = typeof departureDate === 'string' ? new Date(departureDate) : departureDate
  const returnD = typeof returnDate === 'string' ? new Date(returnDate) : returnDate

  const days = differenceInDays(returnD, departure) + 1
  const nights = days - 1

  return { days, nights }
}

/**
 * Format available seats for display
 */
export function formatSlotsDisplay(availableSeats: number, totalSeats?: number): string {
  if (availableSeats === 0) return 'เต็ม'
  if (totalSeats && availableSeats === totalSeats) return `รับ ${totalSeats} ท่าน`
  return `เหลือ ${availableSeats} ที่`
}

/**
 * Format duration in Thai
 */
export function formatDurationThai(days: number, nights: number): string {
  return `${days} วัน ${nights} คืน`
}

/**
 * Parse price string to number
 * Example: "฿165,900" => 165900
 */
export function parsePrice(priceStr: string): number {
  const cleaned = priceStr.replace(/[฿,]/g, '')
  return parseFloat(cleaned) || 0
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return `฿${price.toLocaleString('en-US')}`
}

/**
 * Format Thai date for display
 * Example: "2026-02-13" to "2026-02-20" => "13-20 ก.พ."
 */
export function formatThaiDateRange(departureDate: string, returnDate: string): string {
  const departure = new Date(departureDate)
  const returnD = new Date(returnDate)

  const day1 = departure.getDate()
  const day2 = returnD.getDate()
  const month1 = departure.getMonth() + 1
  const month2 = returnD.getMonth() + 1

  const monthAbbr1 = Object.keys(THAI_MONTHS).find(key => THAI_MONTHS[key] === month1) || ''
  const monthAbbr2 = Object.keys(THAI_MONTHS).find(key => THAI_MONTHS[key] === month2) || ''

  if (month1 === month2) {
    return `${day1}-${day2} ${monthAbbr1}`
  } else {
    return `${day1} ${monthAbbr1} - ${day2} ${monthAbbr2}`
  }
}

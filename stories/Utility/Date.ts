export const startOfTheDay = (date: Date) => {
  const clonedDate = new Date(date.toISOString())
  clonedDate.setHours(0, 0, 0, 0)
  return clonedDate
}

export const datesAreTheSame = (dateOne: Date, dateTwo: Date): boolean => {
  return dateOne.getUTCDate() === dateTwo.getUTCDate()
    && dateOne.getUTCMonth() === dateTwo.getUTCMonth()
    && dateOne.getUTCFullYear() === dateTwo.getUTCFullYear()
}

/**
 * Get the formatted date.
 *
 * @param {Date} date
 *   The date to use
 *
 * @return {string}
 */
export const dateGetFormatted = (date: Date): string => {
  return date.toLocaleDateString('en-gb',
    { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
  )
}

/**
 * Get the day in text format.
 *
 * @param {Date} date
 *   The date to use
 *
 * @return {string}
 */
export const dateGetDay = (date: Date): string => {
  switch (date.getUTCDay()) {
    case 0:
      return 'Sun'
    case 1:
      return 'Mon'
    case 2:
      return 'Tue'
    case 3:
      return 'Wed'
    case 4:
      return 'Thu'
    case 5:
      return 'Fir'
    case 6:
      return 'Sat'
  }
}

/**
 * Get the month in text format.
 *
 * @param {Date} date
 *   The date to use
 *
 * @return {string}
 */
export const dateGetMonth = (date: Date): string => {
  switch (date.getUTCMonth()) {
    case 0:
      return 'Jan'
    case 1:
      return 'Feb'
    case 2:
      return 'Mar'
    case 3:
      return 'Apr'
    case 4:
      return 'May'
    case 5:
      return 'Jun'
    case 6:
      return 'Jul'
    case 7:
      return 'Aug'
    case 8:
      return 'Sep'
    case 9:
      return 'Oct'
    case 10:
      return 'Nov'
    case 11:
      return 'Dec'
  }
}
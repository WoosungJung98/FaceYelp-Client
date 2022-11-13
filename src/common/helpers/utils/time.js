import dayjs from 'dayjs'

export const curDate = () => {
  return dayjs().second(0).millisecond(0)
}

export const parseDate = (dateStr) => {
  if (typeof(dateStr) === 'string') {
    return dayjs(dateStr).second(0).millisecond(0)
  } else {
    return dateStr
  }
}

export const shortWeekDayStr = (date) => {
  date = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat('ko-KR', { weekday: 'short'}).format(date)
}

export const padZero = (num) => {
  return num < 10 ? '0' + num.toString() : num.toString()
}

export const isSameDay = (dateA, dateB) => {
  return (
    dateA.year() === dateB.year() &&
    dateA.month() === dateB.month() &&
    dateA.date() === dateB.date()
  )
}

import { format, add, sub, getMonth, getYear, startOfMonth, lastDayOfMonth, previousMonday, nextSunday, getDate } from 'date-fns'

export default class datePicker {
    constructor() {
        this.currentDate = format(new Date(), "yyyy-MM-dd")
        this.defaultDate = this.currentDate
        this.displayedDate = this.defaultDate
    }

    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    months = ['January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December']

    createHTML () {
        const monthSelector = this.createMonthSelector()
        const calendar = this.createCalendar()

        return [ monthSelector, calendar ]
    }
    createMonthSelector () {
        const div = () => document.createElement('div')
        const span = () => document.createElement('span')
        const button = () => document.createElement('button')

        const displayMonth = this.months[getMonth(this.displayedDate)],
              displayYear = getYear(this.displayedDate)

        const monthSelector = Object.assign(div(), {classList: 'month-selector'})
        monthSelector.appendChild(Object.assign(
            button(), {
                id: 'month-left',
                classList: 'material-symbols-rounded',
                textContent: 'chevron_left'
            }
        ))
        monthSelector.appendChild(Object.assign(
            span(), {
                id: 'current-month',
                textContent: `${displayMonth} ${displayYear}`
            }
        ))
        monthSelector.appendChild(Object.assign(
            button(), {
                id: 'month-right',
                classList: 'material-symbols-rounded',
                textContent: 'chevron_right'
            }
        ))

        return monthSelector
    }
    createCalendar () {
        const div = () => document.createElement('div')
        const span = () => document.createElement('span')
        const button = () => document.createElement('button')

        const calendar = Object.assign(div(), {classList: 'calendar'})
        
        // Append day headings
        for (let i = 0; i < 7; i++) {
            calendar.appendChild(Object.assign(
                span(), {
                    classList: 'day',
                    textContent: this.days[i].substring(0, 2),
                }
            ))
        }

        // Append dates
        const firstOfMonth = startOfMonth(this.displayedDate)
        const lastOfMonth = lastDayOfMonth(this.displayedDate)
        const lastMonday = previousMonday(firstOfMonth)
        const followingSunday = nextSunday(lastOfMonth)
        let startDay = '',
            endDay = ''

        // Obtain starting point for the while loop (a Monday)
        if (firstOfMonth.getDay() !== 1) {
            startDay = lastMonday
        } else {
            startDay = firstOfMonth
        }

        // Obtain ending point for the while loop (a Sunday)
        if (lastOfMonth.getDay() !== 0) {
            endDay = followingSunday
        } else {
            endDay = lastOfMonth
        }

        // Loop over days to create
        let loopedDay = startDay

        while (loopedDay <= endDay) {
            const formattedLoopedDay = format(loopedDay, "yyyy-MM-dd")

            // Create element
            const newElement = Object.assign(
                button(), {
                    classList: 'date',
                    textContent: format(loopedDay, 'd')    // Get the date value
                }
            )

            // Flag today
            if (this.currentDate == formattedLoopedDay) {
                newElement.classList.add('current')
            }

            // Flag days not in current month
            if (loopedDay < firstOfMonth || loopedDay > lastOfMonth) {
                newElement.classList.add('faded')
            }

            calendar.appendChild(newElement)        // Append element
            loopedDay = add(loopedDay, {days: 1})   // Push loop forwards
        }
        
        return calendar
    }
    displayDateNextMonth () {
        return this.displayedDate = add(this.displayedDate, {months: 1})
    }
    displayDatePrevMonth () {
        return this.displayedDate = sub(this.displayedDate, {months: 1})
    }
    displayDateReset () {
        return this.displayedDate = this.defaultDate
    }
    getSelectedDate (element) {
        // Get selected date
        let date = element.textContent

        // Force format to 'dd'
        if (date.length == 1) date = `0${date}`

        // Return selected date
        return `${format(this.displayedDate, "yyyy-MM")}-${date}`
    }
}
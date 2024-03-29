import { format, add, sub, getMonth, getYear, startOfMonth, lastDayOfMonth, previousMonday, nextSunday, getDate } from 'date-fns'

export default class datePicker {
    constructor() {
        this.currentDate = format(new Date(), "yyyy-MM-dd") // format(add(new Date(), {months: 7}), "yyyy-MM-dd")
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

        // Debugging
        console.log('Starting day for current month: ', startDay)
        console.log('Ending day for current month: ', endDay)

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
                // Debugging
                console.log('Looped Day is todays date!')

                newElement.classList.add('current')
            }

            // Flag days not in current month
            if (loopedDay < firstOfMonth || loopedDay > lastOfMonth) {
                // Debugging
                console.log('This day is not in the current month: ', loopedDay)
                
                newElement.classList.add('faded')
            }

            calendar.appendChild(newElement)        // Append element
            loopedDay = add(loopedDay, {days: 1})   // Push loop forwards
        }
        
        return calendar
    }
}
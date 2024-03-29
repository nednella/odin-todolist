import { format } from 'date-fns'

export function parseDueDate(date) {
    // Take format of '2024-01-01'
    // Return format of '01 Jan 24'
    // Do not return the year if it is equal to the current year

    const currentYear = format(new Date(), "yyyy"),
          months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    let parts = date.split('-'),
        day = parts[2],
        month = months[Number(parts[1] - 1)],
        year = parts[0]

    if (year == currentYear) return `${day} ${month}`
    else return `${day} ${month} ${year}`
}
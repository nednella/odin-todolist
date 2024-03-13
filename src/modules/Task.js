import { format } from 'date-fns'

export default class task {
    constructor (title, dueDate, isComplete, creationDate) {
        this.title = title
        this.dueDate = dueDate ?? ''
        this.isComplete = isComplete ?? false
        this.creationDate = creationDate ?? format(new Date(),  "eee d MMM y, HH:mm").toString()
    }
    setTitle (title) {
        this.title = title
    }
    getTitle () {
        return this.title
    }
    markComplete () {
        this.isComplete == false
            ? this.isComplete = true
            : this.isComplete = false
    }
    getStatus () {
        return this.isComplete
    }
}
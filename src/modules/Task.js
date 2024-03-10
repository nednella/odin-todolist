export default class task {
    constructor (title, dueDate) {
        this.title = title
        this.dueDate = dueDate
        this.isComplete = false
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
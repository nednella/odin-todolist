export default class task {
    constructor (title, dueDate, isComplete) {
        this.title = title
        this.dueDate = dueDate ?? ''
        this.isComplete = isComplete ?? false
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
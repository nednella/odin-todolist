export default class task {
    constructor (title, dueDate) {
        this.title = title
        this.dueDate = dueDate
    }
    setTitle (title) {
        this.title = title
    }
    getTitle () {
        return this.title
    }
}
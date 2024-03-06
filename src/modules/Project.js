import task from './Task'

export default class project {
    constructor (title) {
        this.title = title
        this.id = this.title.toLowerCase()
        this.tasks = []
    }
    setTitle (title) {
        this.title = title
        // this.id = title.toLowerCase() // Change ID to reflect new title
    }
    getTitle () {
        return this.title
    }
    getID () {
        return this.id
    }
    addTask (title, dueDate) {
        this.tasks.push(new task(title, dueDate))
        // console.log('New Task: ' + JSON.stringify(this.tasks[(this.tasks.length - 1)]))
        // return this.tasks.push(new task(title, dueDate))
    }
    getTasks () {
        return this.tasks
    }
}
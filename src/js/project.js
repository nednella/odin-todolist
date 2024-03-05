import task from './task'

export default class project {
    constructor (title) {
        this.title = title
        this.tasks = []
    }
    setTitle (title) {
        this.title = title
    }
    getTitle () {
        return this.title
    }
    addTask (title, dueDate) {
        this.tasks.push(new task(title, dueDate))
        console.log('New Task: ' + JSON.stringify(this.tasks[(this.tasks.length - 1)]))
    }
    getTasks () {
        return this.tasks
    }
}
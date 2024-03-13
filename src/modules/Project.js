import task from './Task'

export default class project {
    constructor (title) {
        this.title = title
        this.id = title.toLowerCase()
        this.tasks = []
    }
    setTitle (title) {
        this.title = title
        this.id = title.toLowerCase() // Change ID to reflect new title
    }
    getTitle () {
        return this.title
    }
    getID () {
        return this.id
    }
    addTask (title, dueDate, isComplete, creationDate) {
        return this.tasks.push(new task(title, dueDate, isComplete, creationDate))
    }
    getTask (taskTitle) {
        return this.tasks.find((task) => task.getTitle() == taskTitle)
    }
    getTasks () {
        return this.tasks
    }
    taskCount () {
        return this.tasks.length
    }
}
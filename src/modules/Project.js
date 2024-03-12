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
    addTask (title, dueDate, isComplete) {
        this.tasks.push(new task(title, dueDate, isComplete))
        // console.log('New Task: ', this.tasks[(this.tasks.length - 1)])
        // return this.tasks.push(new task(title, dueDate))
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
import task from './Task'

export default class project {
    constructor (title) {
        this.title = title
        this.id = this.title.toLowerCase()
        this.tasks = []
    }
    setTitle (Title) {
        this.title = Title
        // this.id = title.toLowerCase() // Change ID to reflect new title
    }
    getTitle () {
        return this.title
    }
    getID () {
        return this.id
    }
    addTask (Title, dueDate) {
        this.tasks.push(new task(Title, dueDate))
        // console.log('New Task: ' + JSON.stringify(this.tasks[(this.tasks.length - 1)]))
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
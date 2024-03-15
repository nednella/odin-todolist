import Task from './Task'

export default class project {
    constructor (title) {
        this.title = title
        this.id = title.toLowerCase()
        this.tasks = []
        this.activeTask = undefined
    }
    setActiveTask (taskTitle) {
        this.activeTask = this.tasks.find((task) => task.getTitle() == taskTitle)

        // Debugging
        console.log('Active Task: ', this.activeTask)

        // return this.activeTask = this.tasks.find((task) => task.getTitle() == taskTitle)
    }
    removeActiveTask () {
        this.activeTask = undefined

        // Debugging
        console.log('Active Task: ', this.activeTask)

        //return this.activeTask = undefined
    }
    getActiveTask () {
        return this.activeTask
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
    addTask (title, dueDate, note, isComplete, creationDate) {
        if (this.tasks.find((task) => task.getTitle() == title)) return console.log(`${title} already exists.`)
        else this.tasks.push(new Task(title, dueDate, note, isComplete, creationDate))

        // Debugging
        // console.log('APP: New Task, ', this.tasks[(this.tasks.length - 1)])

        // else return this.tasks.push(new Task(title, dueDate, isComplete, creationDate))
    }
    deleteTask (taskTitle) {
        const selectedTask = this.tasks.find((task) => task.getTitle() == taskTitle)
        if (!selectedTask) return

        // Debugging
        console.log('Deleting Task, ', selectedTask)

        const index = this.tasks.indexOf(selectedTask)
        return this.tasks.splice(index, 1)
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
import Task from './Task'

export default class project {
    constructor (title, isDefault, icon) {
        this.title = title
        this.id = title.toLowerCase()
        this.default = isDefault ?? false
        this.icon = icon ?? 'menu'
        this.tasks = []
        this.activeTask = undefined
    }
    setTitle (title) {
        this.title = title
        this.id = title.toLowerCase()
        this.tasks.forEach(task => task.setParent(title))
    }
    getTitle () {
        return this.title
    }
    getID () {
        return this.id
    }
    isDefault () {
        return this.default
    }
    getIcon () {
        return this.icon
    }
    importTask (title, myDay, important, complete, dueDate, note, creationDate) {
        if (this.tasks.find((task) => task.getTitle() == title)) return console.log(`${title} already exists.`)
        else this.tasks.push(new Task(title, this.title, myDay, important, complete, dueDate, note, creationDate))
        // else return

        // Debugging
        // console.log('APP: New Task, ', this.tasks[(this.tasks.length - 1)])
    }
    addTask (title, myDay, important) {
        if (this.tasks.find((task) => task.getTitle() == title)) return console.log(`${title} already exists.`)
        else this.tasks.push(new Task(title, this.title, myDay, important, null, null, null, null))
        // else return

        // Debugging
        // console.log('APP: New Task, ', this.tasks[(this.tasks.length - 1)])
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
    setActiveTask (taskTitle) {
        this.activeTask = this.tasks.find((task) => task.getTitle() == taskTitle)

        // Debugging
        console.log('Active Task: ', this.activeTask)

        // return this.activeTask = this.tasks.find((task) => task.getTitle() == taskTitle)
    }
    removeActiveTask () {
        this.activeTask = undefined

        // Debugging
        // console.log('Active Task: ', this.activeTask)

        //return this.activeTask = undefined
    }
    getActiveTask () {
        return this.activeTask
    }
}
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
        if (this.isDefault()) return
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
    addTask (title, myDay, important) {
        if (this.tasks.find((task) => task.getTitle() == title)) return console.log(`${title} already exists.`)
        else this.tasks.push(new Task(title, this.title, myDay, important, null, null, null, null))
    }
    importTask (title, myDay, important, complete, dueDate, note, creationDate) {
        if (this.tasks.find((task) => task.getTitle() == title)) return console.log(`${title} already exists.`)
        else return this.tasks.push(new Task(title, this.title, myDay, important, complete, dueDate, note, creationDate))
    }
    pushTask (task) {
        return this.tasks.push(task)
    }
    deleteTask (taskTitle) {
        const selectedTask = this.tasks.find((task) => task.getTitle() == taskTitle)
        if (!selectedTask) return
        else return this.tasks.splice(this.tasks.indexOf(selectedTask), 1)
    }
    clearTasks () {
        return this.tasks = []
    }
    getTask (taskTitle) {
        return this.tasks.find((task) => task.getTitle() == taskTitle)
    }
    getTasks () {
        return this.tasks
    }
    taskCount () {
        let i = 0
        this.tasks.forEach(task => !task.isComplete() ? i++ : null)
        return i
    }
    setActiveTask (taskTitle) {
        return this.activeTask = this.tasks.find((task) => task.getTitle() == taskTitle)
    }
    removeActiveTask () {
        return this.activeTask = undefined
    }
    getActiveTask () {
        return this.activeTask
    }
}
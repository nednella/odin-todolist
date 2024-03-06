import Project from './Project'
import Task from './Task'

export default class toDoList {
    constructor() {
        this.list = []
        this.list.push(new Project('my day'))
        this.list.push(new Project('all tasks'))
    }
    addProject (projectTitle) {
        this.list.push(new Project(projectTitle))
    }
    getProject (projectTitle) {
        return this.list.find((title) => title.getTitle() == projectTitle.toLowerCase())
    }
}
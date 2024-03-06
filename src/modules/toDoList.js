import Project from './Project'
import Task from './Task'

export default class toDoList {
    constructor() {
        this.list = []
        this.activeProject = ''
        this.list.push(new Project('my day'))
        this.list.push(new Project('all tasks'))
    }
    setActiveProject (projectTitle) {
        return this.activeProject = this.list.find((title) => title.getTitle() == projectTitle.toLowerCase())
    }
    getActiveProject () {
        return this.activeProject
    }
    addProject (projectTitle) {
        if (this.list.find((title) => title.getTitle() == projectTitle.toLowerCase())) return
        else this.list.push(new Project(projectTitle.toLowerCase()))
        console.log('New Project: ' + JSON.stringify(this.list[(this.list.length - 1)]))
        // return this.list.push(new Project(projectTitle.toLowerCase()))
    }
    getProject (projectTitle) {
        return this.list.find((title) => title.getTitle() == projectTitle.toLowerCase())
    }
    getProjects () {
        return this.list
    }
}
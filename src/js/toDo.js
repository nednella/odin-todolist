import project from './project'
import task from './task'

export default class toDoList {
    constructor() {
        this.list = []
        this.list.push(new project('my day'))
        this.list.push(new project('all tasks'))
    }
    addProject (newProject) {
        this.list.push(new project(newProject))
        // console.log('New Project: ' + JSON.stringify(this.list[(this.list.length - 1)]))
    }
    getProject (projectTitle) {
        // console.log('title: ' + projectTitle)
        return this.list.find((title) => title.getTitle() == projectTitle.toLowerCase())
    }
}
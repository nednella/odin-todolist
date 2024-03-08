import Project from './Project'
import Task from './Task'

export default class toDoList {
    constructor() {
        this.list = []
        this.list.push(new Project('My Day'))
        this.list.push(new Project('All Tasks'))
        this.activeProject = this.list[0]
    }
    setActiveProject (projectTitle) {
        return this.activeProject = this.list.find((project) => project.getID() == projectTitle.toLowerCase())
    }
    getActiveProject () {
        return this.activeProject
    }
    addProject (projectTitle) {
        if (this.list.find((project) => project.getID() == projectTitle.toLowerCase())) return console.log('Project already exists.')
        else this.list.push(new Project(projectTitle))

        // Debugging
        console.log('New Project: ', this.list[(this.list.length - 1)])

        // return this.list.push(new Project(projectTitle.toLowerCase()))
    }
    getProject (projectTitle) {
        return this.list.find((project) => project.getID() == projectTitle.toLowerCase())
    }
    getProjects () {
        return this.list
    }
    deleteProject (projectTitle) {
        const selectedProject = this.list.find((project) => project.getID() == projectTitle.toLowerCase())
        if (selectedProject == undefined) return

        // Debugging
        console.log('Deleting Project: ', selectedProject)

        const index = this.list.indexOf(selectedProject)
        this.list.splice(index, 1)
        // else return this.list.splice(index, 1)
    }
}
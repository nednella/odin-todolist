import Project from './Project'

export default class toDoList {
    constructor() {
        this.list = []
        this.list.push(new Project('My Day', true, 'clear_day'))
        this.list.push(new Project('All Tasks', true, 'home'))
        this.activeProject = this.list[0]
    }
    setActiveProject (projectTitle) {
        return this.activeProject = this.list.find((project) => project.getID() == projectTitle.toLowerCase())
    }
    getActiveProject () {
        return this.activeProject
    }
    addProject (projectTitle) {
        if (this.list.find((project) => project.getID() == projectTitle.toLowerCase())) return console.log(`${projectTitle} already exists.`)
        else this.list.push(new Project(projectTitle))

        // Debugging
        console.log('APP: New Project, ', this.list[(this.list.length - 1)])

        // else return this.list.push(new Project(projectTitle.toLowerCase()))
    }
    deleteProject (projectTitle) {
        const selectedProject = this.list.find((project) => project.getID() == projectTitle.toLowerCase())
        if (!selectedProject) return

        // Debugging
        console.log('APP: Deleting Project, ', selectedProject)

        const index = this.list.indexOf(selectedProject)
        return this.list.splice(index, 1)
        // else return this.list.splice(index, 1)
    }
    getProject (projectTitle) {
        return this.list.find((project) => project.getID() == projectTitle.toLowerCase())
    }
    getProjects () {
        return this.list
    }
    importJSON (JSON) {
        console.log('APP: Importing Projects... ')
        console.log(JSON)
        JSON.forEach(project => {
            this.addProject(project.title)
            // console.log(`APP: Importing Tasks into ${project.title}...`)
            project.tasks.forEach(task => {     
                this.getProject(project.title).addTask(task.title, task.dueDate, task.note, task.isComplete, task.creationDate)
            })
        })
    }
}
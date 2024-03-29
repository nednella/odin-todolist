import Project from './Project'

export default class toDoList {
    constructor() {
        this.list = []
        this.list.push(new Project('My Day', true, 'clear_day'))
        this.list.push(new Project('Important', true, 'priority_high'))
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
        else return this.list.push(new Project(projectTitle.toLowerCase()))
    }
    deleteProject (projectTitle) {
        const selectedProject = this.list.find((project) => project.getID() == projectTitle.toLowerCase())
        if (!selectedProject || selectedProject.isDefault()) return
        else return this.list.splice(this.list.indexOf(selectedProject), 1)
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

            project.tasks.forEach(task => {     
                this.getProject(project.title)
                    .importTask(task.title, task.myDay, task.important, task.complete, task.dueDate, task.note, task.creationDate)
            })
        })
    }
    populateMyDay () {
        const myDay = this.list[0]
        myDay.clearTasks()

        this.list.forEach(project => {
            if (project.getTitle() !== 'My Day' && project.getTitle() !== 'Important') {
                project.getTasks().forEach(task => {
                    if (task.isMyDay()) {
                        myDay.pushTask(task)        // Push instead of copy to retain pointer to the original
                    }
                })
            }   
        }) 
    }
    populateImportant () {
        const important = this.list[1]
        important.clearTasks()

        this.list.forEach(project => {
            if (project.getTitle() !== 'My Day' && project.getTitle() !== 'Important') {
                project.getTasks().forEach(task => {
                    if (task.isImportant()) {
                        important.pushTask(task)    // Push instead of copy to retain pointer to the original
                    }
                })
            }
        }) 
    }
}
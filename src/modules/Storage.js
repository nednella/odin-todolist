import Project from "./Project"
import toDoList from "./toDoList"

export default class Storage {
    constructor () {

    }

    static clear () {
        return localStorage.clear()
    }

    static saveApp (projects) {
        console.log('Saving Projects...')
        Storage.clear()
        return localStorage.setItem('projects', JSON.stringify(projects))
    }
    
    static loadApp () {
        // this.clear()

        const app = new toDoList()

        let projects = JSON.parse(localStorage.getItem('projects'))

        if (projects == null) {
            console.log('No projects found.')
            return this.populateNewApp(app)
        } else {
            console.log('Projects found!')
            console.log('Stored Projects: ', projects)
            
            
            // TODO: Figure out how to import these stored projects and assign them the Project methods
            // https://stackoverflow.com/questions/30584476/object-properties-are-undefined-after-localstorage




            // I ALREADY HAVE THE APP AND THE PROJECTS
            // I JUST NEED TO ASSIGN THE PROJECTS AS NEW PROJECTS
            // AND THE TASKS INSIDE THE PROJECTS AS NEW TASKS
            // THEN ASSIGN THE ENTIRE ARRAY INTO THE APP


            
            

            // return app
        }
        



        // return this.populateNewApp(app)
        // if (app == null) {
        //     console.log('No app found.')
        //     return this.populateNewApp(new toDoList())
        // } else {
        //     console.log('App found!')

        //     app = Object.assign(new toDoList(), JSON.parse(app))
        //     return app
        // }
    }

    static populateNewApp (app) {
        // Testing
        console.log('Populating new app.')
        app.getProject('My Day').addTask('Test 1')
        app.getProject('My Day').addTask('Test 2')
        app.getProject('My Day').addTask('Test 3')
        app.getProject('All Tasks').addTask('Another Test')
        app.getProject('All Tasks').addTask('And Another')
        app.getProject('All Tasks').addTask('Yep, Another')
        app.addProject('2024 Goals')
        app.getProject('2024 Goals').addTask('Complete this To Do List app!')
        app.getActiveProject().getTask('Test 3').markComplete()
        console.log('Stored Projects: ', app.getProjects())

        return app
    }
}
import toDoList from "./toDoList"

export default class Storage {
    constructor () {
        if (this instanceof Storage) {
            throw Error ('Error: static class, cannot be instantiated.')
        }
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

        let projects = JSON.parse(localStorage.getItem('projects'))
        let testJSON = JSON.parse(
        `[
            {
                "title":"Shopping List",
                "id":"my day",
                "tasks": [
                    {
                        "title":"Bread"
                    },
                    {
                        "title":"Cheese"
                    },
                    {
                        "title":"Wine"
                    }
                ]
            }
        ]`)

        const app = new toDoList()

        if (!projects) {
            console.log('No projects found.')
            return Storage.populateNewApp(app)
        } else {
            console.log('Projects found!')
            app.importJSON(projects)
            // app.importJSON(testJSON)
            return app
        }
    }

    static populateNewApp (app) {
        // Testing
        console.log('Populating new app.')
        console.log(app)
        app.getProject('My Day').addTask('Test 1')
        app.getProject('My Day').addTask('Test 2')
        app.getProject('My Day').addTask('Test 3')
        app.getProject('All Tasks').addTask('Another Test')
        app.getProject('All Tasks').addTask('And Another')
        app.getProject('All Tasks').addTask('Yep, Another')
        app.addProject('March 2024')
        app.getProject('March 2024').addTask('Solve the localStorage problem')
        app.getProject('March 2024').addTask('Add a task modal to edit task properties')
        app.getProject('March 2024').addTask('Extend Task() class to include more properties')
        app.getProject('March 2024').addTask('Add checklist to Task()')
        app.getProject('March 2024').addTask('Refactor completed tasks as per notepad')
        app.getProject('March 2024').addTask('Complete the To Do List app!')
        app.getProject('March 2024').getTask('Solve the localStorage problem').markComplete()

        console.log('Stored Projects: ', app.getProjects())

        return app
    }
}
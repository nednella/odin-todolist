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
        console.log('STORAGE: Projects saved.')
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
            console.log('STORAGE: No projects found.')
            return Storage.populateNewApp(app)
        } else {
            console.log('STORAGE: Projects found!')
            app.importJSON(projects)
            // app.importJSON(testJSON)
            return app
        }
    }

    static populateNewApp (app) {
        // Testing
        console.log('STORAGE: Populating new app with placeholder content.')
        console.log(app)
        app.getProject('My Day').addTask('Test 1')
        app.getProject('My Day').addTask('Test 2')
        app.getProject('My Day').addTask('Test 3')

        app.getProject('All Tasks').addTask('Another test')
        app.getProject('All Tasks').addTask('And another!')
        app.getProject('All Tasks').addTask('Yep, another...')

        app.addProject('March 2024')
        app.getProject('March 2024').addTask('Solve the localStorage problem')
        app.getProject('March 2024').addTask('Add a task modal')
        app.getProject('March 2024').addTask('Add task delete functionality')
        app.getProject('March 2024').addTask('Add editable task modal boxes (title etc.)')
        app.getProject('March 2024').addTask('Add dueDate functionality to task modal')
        app.getProject('March 2024').addTask('Update task with changes on task modal close')
        app.getProject('March 2024').addTask('Add note method to Task()')
        app.getProject('March 2024').addTask('Refactor completed tasks to preserve order-of-completion')
        app.getProject('March 2024').addTask('Complete the To Do List app!')
        app.getProject('March 2024').addTask('Publish the To Do List app!')

        app.addProject('Shopping List')
        app.getProject('Shopping List').addTask('Cheese')
        app.getProject('Shopping List').addTask('Wine')
        app.getProject('Shopping List').addTask('Bread')

        console.log('Stored Projects: ', app.getProjects())

        return app
    }
}
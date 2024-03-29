import toDoList from "./toDoList"
import { format } from 'date-fns'

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
        // Debugging
        this.clear()

        const app = new toDoList()

        let projects = JSON.parse(localStorage.getItem('projects'))
        if (!projects) {
            console.log('STORAGE: No projects found.')
            return Storage.populateNewApp(app)
        } else {
            console.log('STORAGE: Projects found!')
            app.importJSON(projects)
            return app
        }
    }

    static populateNewApp (app) {
        console.log('STORAGE: Populating new app with placeholder content...')

        app.getProject('All Tasks').addTask('A nice looking To Do application! (I might be biased)')
        app.getProject('All Tasks').addTask('Heavily inspired by the Microsoft To Do app')
        app.getProject('All Tasks').addTask('Check out the App Features project for additional info!')

        app.getProject('All Tasks').getTask('A nice looking To Do application! (I might be biased)').toggleMyDay()
        app.getProject('All Tasks').getTask('Heavily inspired by the Microsoft To Do app').toggleMyDay()

        app.addProject('App Features')
        app.getProject('App Features').addTask('Custom projects with rename/delete (try clicking the project title above!)')
        app.getProject('App Features').addTask('Tasks with rename/delete (try clicking this task and editing the title in the modal!)')
        app.getProject('App Features').addTask('Task completion toggle w/ separate rendering')
        app.getProject('App Features').addTask('My Day/Important flags per task with category filtering')
        app.getProject('App Features').addTask('Task due date selector with custom date picker')
        app.getProject('App Features').addTask('This task is a part of my day!')
        app.getProject('App Features').addTask('This task is really important!')
        app.getProject('App Features').addTask('This task is way overdue!')
        app.getProject('App Features').addTask('Ability to add notes to your tasks')
        app.getProject('App Features').addTask('Try some of them out yourself!')
        
        app.getProject('App Features').getTask('Task completion toggle w/ separate rendering').toggleComplete()
        app.getProject('App Features').getTask('This task is a part of my day!').toggleMyDay()
        app.getProject('App Features').getTask('This task is really important!').toggleImportant()
        app.getProject('App Features').getTask('Task due date selector with custom date picker').setDueDate(format(new Date(), "yyyy-MM-dd"))
        app.getProject('App Features').getTask('This task is way overdue!').setDueDate(format(new Date("2024-03-15"), "yyyy-MM-dd"))
        app.getProject('App Features').getTask('Ability to add notes to your tasks').setNote('Like this one!')

        app.addProject('Shopping List')
        app.getProject('Shopping List').addTask('Cheese')
        app.getProject('Shopping List').addTask('Wine')
        app.getProject('Shopping List').addTask('Bread')
        app.getProject('Shopping List').addTask('Chocolate!')

        return app
    }
}
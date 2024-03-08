import toDoList from './toDoList'
import { format } from 'date-fns'

String.prototype.toTitleCase = function() {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

export default class UI {
    constructor() {
        if (this instanceof UI) {
            throw Error ('Error: static class, cannot be isntantiated.')
        }
    }

    static app = new toDoList()     // TODO: Implement 'Storage' module that:
                                    // 1. Pulls stored toDoList() class from storage, or
                                    // 2. Generates a new toDoList()

    static initApp() {

        // Debugging
        console.log('App Initialising...')
        
        UI.app.getActiveProject().addTask('Test 1')
        UI.app.getActiveProject().addTask('Test 2')
        UI.app.getActiveProject().addTask('Test 3')
        UI.app.getProject('All Tasks').addTask('Another Test')
        UI.app.getProject('All Tasks').addTask('And Another')
        UI.app.getProject('All Tasks').addTask('Yep, Another')
        UI.app.addProject('2024 Goals')

        // Debugging
        console.log('Stored Projects: ', UI.app.getProjects())

        UI.init()
        UI.initEventListeners()
    }

    static init() {
        UI.clear()
        UI.app.getProjects().forEach((Project, index) => {
            index > 1
                ? UI.appendProject(Project.getTitle())
                : null
        })
        UI.loadNavTaskCounters()
        UI.loadProject(UI.app.getActiveProject())


        // ... Post storage implementation
            // Load all projects into nav
            // Populate projects with their stored tasks
            // Activate a project
                // Set nav class to active
                // Load project into project display

         
    }

    static clear() {
        // Clear the active project
        const navItems = document.querySelectorAll('.nav-item')
        navItems.forEach(item => item.classList.remove('active'))

        // Wipe the UI
        document.querySelector('.custom-projects').textContent = ''
        document.getElementById('project-title-1').textContent = ''
        document.getElementById('project-title-2').textContent = ''
        document.getElementById('active-project').textContent = ''
    }

    static loadNavTaskCounters() {
        const navCounters = document.querySelectorAll('.project-task-count')
        const Projects = UI.app.getProjects()

        for (let i = 0; i < navCounters.length; i++) {
            navCounters[i].textContent = Projects[i].taskCount()
        }
    }

    static loadProject(Project) {
        const projectTitle1 = document.getElementById('project-title-1')
        const projectTitle2 = document.getElementById('project-title-2')
        const navItems = document.querySelectorAll('.nav-item')

        // Debugging
        console.log('Loading Project: ', Project)

        // Set project as active in nav menu
        navItems.forEach(item => {
            if (item.children[0].children[1].textContent == Project.getTitle()) {
                item.classList.add('active')
            }
        })

        // Load project title
        projectTitle1.textContent = Project.getTitle().toUpperCase()

        // If My Day, load current date
        if (Project.getTitle() == 'My Day') projectTitle2.textContent = format(new Date(), "eeee, d MMM y").toUpperCase()

        // Load project tasks
        Project.getTasks().forEach(Task => UI.appendTask(Task.getTitle()))
    }

    static initEventListeners() {
        const nav = document.getElementById('nav')
        const navOpen = document.getElementById('nav-open')
        const themeToggle = document.getElementById('theme-toggle')
        
        nav.addEventListener('click', (e) => UI.handleNavigationInput(e))
        nav.addEventListener('cancel', (e) => e.preventDefault())
        navOpen.addEventListener('click', () => UI.toggleNav())
        themeToggle.addEventListener('click', () => UI.toggleTheme())
        window.addEventListener('keydown', (e) => UI.handleKeyboardInput(e))
    }

    static toggleTheme() {
        const html = document.querySelector('html')
        const currentTheme = html.getAttribute('data-theme')

        currentTheme == 'light'
            ? html.setAttribute('data-theme', 'dark')
            : html.setAttribute('data-theme', 'light')
    }

    static toggleNav() {
        const nav = document.getElementById('nav')
        const projectInput = document.getElementById('add-project-input')

        projectInput.value = ''
        nav.hasAttribute('open')
            ? nav.close()
            : nav.showModal()
    }

    static handleNavigationInput(e) {
        if (e.target.nodeName == 'DIALOG' || e.target.id == 'nav-close') UI.toggleNav() 

        if (e.target.classList.contains('nav-item')) {
            const selectedProject = e.target.children[0].children[1].textContent
            UI.app.setActiveProject(selectedProject)
            UI.toggleNav()
            UI.init()
        }

        if (e.target.classList.contains('project-delete')) {
            const selectedProject = e.target.parentElement.parentElement.children[0].children[1].textContent
            UI.deleteProject(selectedProject)
        }
    }

    static handleKeyboardInput(e) {
        const taskInput = document.getElementById('add-task-input')
        const projectInput = document.getElementById('add-project-input')

        switch(document.activeElement) {
            case taskInput:
                if (e.key == 'Escape') taskInput.value = ''
                if (e.key == 'Enter' && taskInput.value !== '') {
                    UI.createTask(taskInput.value)
                    taskInput.value = ''
                }
                break

            case projectInput:
                if (e.key == 'Escape') projectInput.value = ''
                if (e.key == 'Enter' && projectInput.value !== '') {
                    UI.createProject(projectInput.value)
                    projectInput.value = ''
                }
                break
        }
    }

    static createTask(Title) {
        UI.app.getActiveProject().addTask(Title)
        UI.init()
        return
    }

    static deleteTask(Title) {
        // TODO
        return
    }

    static createProject(Title) {
        UI.app.addProject(Title)
        UI.app.setActiveProject(Title)
        UI.toggleNav()
        UI.init()
    }
    
    static deleteProject(Title) {
        if (UI.app.getActiveProject().getTitle() == Title) UI.app.setActiveProject('My Day')
        UI.app.deleteProject(Title)
        UI.init()
    }

    static appendTask(Title) {
        const projectDisplay = document.getElementById('active-project')
        projectDisplay.innerHTML += `
        <div class="task">
            <input 
                class="task-checkbox"
                type="checkbox"
            >
            <p class="task-content">${Title}</p>
            <div class="task-project">Tasks</div>
        </div>`
    }

    static appendProject(Title) {
        const projectsList = document.querySelector('.custom-projects')
        projectsList.innerHTML += `
        <span href="" class="nav-item">
            <span class="nav-item-left">
                <span class="material-symbols-rounded">menu</span>
                    <h3>${Title}</h3>
            </span>
            <span class="nav-item-right">
                <span class="project-task-count">0</span>
                <span class="project-delete material-symbols-rounded">delete</span>
            </span>
        </span>`
    }
}
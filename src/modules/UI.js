import toDoList from './toDoList'
import Storage from './Storage'
import { format } from 'date-fns'

String.prototype.toTitleCase = function() {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

export default class UI {
    constructor() {
        if (this instanceof UI) {
            throw Error ('Error: static class, cannot be instantiated.')
        }
    }

    static app = Storage.loadApp()  // TODO: Implement 'Storage' module that:
                                    // 1. Pulls stored toDoList() class from storage, or
                                    // 2. Generates a new toDoList()

    static initApp() {

        // Debugging
        console.log('App Initialising...')
        console.log('UI - app: ', UI.app)

        // Debugging
        console.log('Stored Projects: ', UI.app.getProjects())
        console.log('Active Project', UI.app.getActiveProject())


        UI.init()
        UI.initEventListeners()
    }

    static init() {
        UI.clear()
        UI.app.getProjects().forEach((Project, index) => {
            index > 1
                ? UI.appendProject(Project)
                : null
        })
        UI.loadNavTaskCounters()
        UI.loadProject(UI.app.getActiveProject()) 

        Storage.saveApp(UI.app.getProjects())
    }

    static clear() {
        // Clear the active project
        const navItems = document.querySelectorAll('.nav-item')
        navItems.forEach(item => item.classList.remove('active'))

        // Wipe the UI
        document.querySelector('.custom-projects').textContent = ''
        document.getElementById('project-title-1').textContent = ''
        document.getElementById('project-title-2').textContent = ''
        document.getElementById('active-tasks').textContent = ''
        document.getElementById('completed-tasks-title').style.display = 'none'
        document.getElementById('completed-tasks').textContent = ''
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
        Project.getTasks().forEach(Task => UI.appendTask(Task))
    }

    static initEventListeners() {
        const taskModal = document.getElementById('task')
        const navModal = document.getElementById('nav')
        const navOpen = document.getElementById('nav-open')
        const themeToggle = document.getElementById('theme-toggle')
        const projectDisplay = document.getElementById('project-display')
        
        taskModal.addEventListener('click', (e) => UI.handleTaskModalInput(e))
        navModal.addEventListener('click', (e) => UI.handleNavigationInput(e))
        navModal.addEventListener('cancel', (e) => e.preventDefault())
        navOpen.addEventListener('click', () => UI.toggleNavModal())
        themeToggle.addEventListener('click', () => UI.toggleTheme())
        projectDisplay.addEventListener('click', (e) => UI.handleTaskInput(e))
        window.addEventListener('keydown', (e) => UI.handleKeyboardInput(e))
    }

    static handleTaskInput(e) {
        if (e.target.classList.contains('task')) {
            const selectedTask = e.target.children[1].textContent

            // TODO: Implement a dialog#task modal to expand on task details and edit them as required
            UI.toggleTaskModal()
            UI.populateTaskModal(UI.app.getActiveProject().getTask(selectedTask))

            // Debugging
            // console.log('Task Clicked: ', UI.app.getActiveProject().getTask(selectedTask))
        }

        if (e.target.classList.contains('task-checkbox')) {
            const selectedTask = e.target.parentElement.children[1].textContent

            UI.app.getActiveProject().getTask(selectedTask).markComplete()
            UI.init()

            // Debugging
            // console.log('Task Checked: ', UI.app.getActiveProject().getTask(selectedTask))     
        }
    }

    static handleTaskModalInput(e) {
        if (e.target.nodeName == 'DIALOG' || e.target.id == 'task-close') UI.toggleTaskModal()
        
    }

    static handleNavigationInput(e) {
        if (e.target.nodeName == 'DIALOG' || e.target.id == 'nav-close') UI.toggleNavModal() 

        if (e.target.classList.contains('nav-item')) {
            const selectedProject = e.target.children[0].children[1].textContent
            UI.app.setActiveProject(selectedProject)
            UI.toggleNavModal()
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

    static toggleTheme() {
        const html = document.querySelector('html')
        const currentTheme = html.getAttribute('data-theme')

        currentTheme == 'light'
            ? html.setAttribute('data-theme', 'dark')
            : html.setAttribute('data-theme', 'light')
    }

    static toggleNavModal() {
        const nav = document.getElementById('nav')
        const projectInput = document.getElementById('add-project-input')

        projectInput.value = ''
        nav.hasAttribute('open')
            ? nav.close()
            : nav.showModal()
    }

    static toggleTaskModal() {
        const task = document.getElementById('task')

        task.hasAttribute('open')
            ? task.close()
            : task.showModal()
    }

    static populateTaskModal(Task) {
        
        console.log(Task)

        // TODO
        // Take Task info and populate the modal with it





    }

    static toggleTaskComplete(Task) {
        Task.classList.contains('task-complete')
            ? Task.classList.remove('task-complete')
            : Task.classList.add('task-complete')
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
        UI.toggleNavModal()
        UI.init()
    }
    
    static deleteProject(Title) {
        if (UI.app.getActiveProject().getTitle() == Title) UI.app.setActiveProject('My Day')
        UI.app.deleteProject(Title)
        UI.init()
    }

    static appendTask(Task) {
        const taskTitle = Task.getTitle()
        const taskComplete = Task.getStatus()

        const activeTasks = document.getElementById('active-tasks')
        const completedTasksTitle = document.getElementById('completed-tasks-title')
        const completedTasks = document.getElementById('completed-tasks')

        if (taskComplete) {
            completedTasksTitle.style.display = 'block'
            completedTasks.innerHTML += `
            <div class="task task-complete">
                <input 
                    class="task-checkbox"
                    type="checkbox"
                    checked
                >
                <p class="task-content">${taskTitle}</p>
                <div class="task-project">Tasks</div>
            </div>`    
        } else {
            activeTasks.innerHTML += `
            <div class="task">
                <input 
                    class="task-checkbox"
                    type="checkbox"
                >
                <p class="task-content">${taskTitle}</p>
                <div class="task-project">Tasks</div>
            </div>` 
        }
        
    }

    static appendProject(Project) {
        // console.log('Append Project Argument: ', Project)
        const projectTitle = Project.getTitle()

        const projectsList = document.querySelector('.custom-projects')
        projectsList.innerHTML += `
        <span href="" class="nav-item">
            <span class="nav-item-left">
                <span class="material-symbols-rounded">menu</span>
                    <h3>${projectTitle}</h3>
            </span>
            <span class="nav-item-right">
                <span class="project-task-count">0</span>
                <span class="project-delete material-symbols-rounded">delete</span>
            </span>
        </span>`
    }
}
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

    static app = Storage.loadApp()

    static initApp() {
        console.log('UI: App initialising...')

        // Debugging
        console.log('UI - App: ', UI.app)

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
        // Remove the active project
        const navItems = document.querySelectorAll('.nav-item')
        navItems.forEach(item => item.classList.remove('active'))

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
        const taskModal = document.getElementById('task'),
              navModal = document.getElementById('nav'),
              navOpen = document.getElementById('nav-open'),
              themeToggle = document.getElementById('theme-toggle'),
              projectDisplay = document.getElementById('project-display')

        taskModal.addEventListener('click', (e) => UI.handleTaskModalInput(e))
        navModal.addEventListener('click', (e) => UI.handleNavModalInput(e))
        navModal.addEventListener('cancel', (e) => e.preventDefault())
        navOpen.addEventListener('click', () => UI.toggleNavModal())
        themeToggle.addEventListener('click', () => UI.toggleTheme())
        projectDisplay.addEventListener('click', (e) => UI.handleTaskInput(e))
        window.addEventListener('keydown', (e) => UI.handleKeyboardInput(e))
    }

    static handleTaskInput(e) {
        if (e.target.classList.contains('task')) {
            const selectedTask = e.target.children[1].textContent
            UI.app.getActiveProject().setActiveTask(selectedTask)
            UI.toggleTaskModal()
        }

        if (e.target.classList.contains('task-checkbox')) {
            const selectedTask = e.target.parentElement.children[1].textContent
            UI.app.getActiveProject().getTask(selectedTask).toggleComplete()
            UI.init() 
        }
    }

    static handleTaskModalInput(e) {
        if (e.target.classList.contains('task-checkbox')) {
            // Toggle task-complete class on navModal task title
            const activeTaskTitleElement = e.target.parentElement.children[1]
            activeTaskTitleElement.classList.contains('task-complete')
                ? activeTaskTitleElement.classList.remove('task-complete')
                : activeTaskTitleElement.classList.add('task-complete')

            UI.app.getActiveProject().getActiveTask().toggleComplete()
            UI.init() 
        }
        
        if (e.target.classList.contains('task-delete')) {
            const selectedTask = UI.app.getActiveProject().getActiveTask()
            UI.deleteTask(selectedTask)
        }

        if (e.target.nodeName == 'DIALOG'
        || e.target.id == 'task-close'
        || e.target.id == 'task-delete') {
            UI.toggleTaskModal()
        }
    }

    static handleNavModalInput(e) {
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
        const taskInput = document.getElementById('add-task-input'),
              projectInput = document.getElementById('add-project-input')

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
        const html = document.querySelector('html'),
              currentTheme = html.getAttribute('data-theme')

        currentTheme == 'light'
            ? html.setAttribute('data-theme', 'dark')
            : html.setAttribute('data-theme', 'light')
    }

    static toggleNavModal() {
        const nav = document.getElementById('nav'),
              projectInput = document.getElementById('add-project-input')

        projectInput.value = ''                             // Clear input on close
        nav.hasAttribute('open')
            ? nav.close()
            : nav.showModal()
    }

    static toggleTaskModal() {
        const task = document.getElementById('task')

        if (task.hasAttribute('open')) {
            task.close()
            UI.checkModal()                                 // Check for task changes on modal close
            UI.app.getActiveProject().removeActiveTask()    // Remove active task on modal close
        } else {
            task.showModal()
            UI.populateTaskModal()
        }
    }

    static populateTaskModal() {
        console.log('Populating task modal...')
        // Get modal elements
        const taskCheckbox = document.getElementById('task-checkbox'),
              taskTitle = document.getElementById('task-title'),
              taskDue = document.getElementById('task-due'),
              taskNote = document.getElementById('task-note'),
              taskCreation = document.getElementById('task-creation')

        // Wipe modal elements to remove any persisting bugs with the placeholder feature
        taskTitle.textContent = ''
        taskDue.value = ''
        taskNote.textContent = ''
        taskCreation.textContent = ''
        
        // Get active task
        const activeTask = UI.app.getActiveProject().getActiveTask()

        // Populate modal elements
        taskTitle.textContent = activeTask.getTitle()
        if (activeTask.complete()) {
            taskCheckbox.checked = true
            taskTitle.classList.add('task-complete')
        } else {
            taskCheckbox.checked = false
            taskTitle.classList.remove('task-complete')
        }

        taskDue.value = activeTask.getDueDate()

        if (activeTask.getNote()) {
            taskNote.classList.remove('placeholder')
            taskNote.textContent = activeTask.getNote()
        } else taskNote.classList.add('placeholder')
        
        taskCreation.textContent = `Created on ${activeTask.getCreationDate()}`    
    }

    static checkModal() {
        
        // Get active task values
        const task = UI.app.getActiveProject().getActiveTask()
        const taskVals = [
            task.getTitle(),
            task.getDueDate(),
            task.getNote()
        ]

        // Get modal values
        const modalVals = [
            document.getElementById('task-title').textContent,
            document.getElementById('task-due').value,
            document.getElementById('task-note').textContent
        ]

        // Check for changes
        console.log('Checking for task changes...')
        for (let i = 0; i < 3; i++) {
            // console.log(taskVals[i])
            // console.log(modalVals[i])
            taskVals[i] !== modalVals[i]
                ? UI.updateTask(task, modalVals[i], i)
                : console.log('No change.')
        }
    }

    static updateTask(task, value, i) {
        console.log('Change detected.')
        switch(i) {
            case 0:
                if (value == '') return console.log('Cannot have a blank project title.')
                console.log('Updating title.')
                task.setTitle(value)
                break

            case 1:
                console.log('Updating due date.')
                task.setDueDate(value)
                break

            case 2:
                console.log('Updating note.')
                task.setNote(value)
                break
        }
        UI.init()
    }

    static createTask(Title) {
        UI.app.getActiveProject().addTask(Title)
        UI.init()
    }

    static deleteTask(Task) {
        UI.app.getActiveProject().deleteTask(Task.getTitle())
        UI.init()    
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
        const taskComplete = Task.complete()

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
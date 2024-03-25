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
        UI.app.getProjects().forEach(Project => UI.appendProject(Project))
        UI.loadProject(UI.app.getActiveProject()) 
        Storage.saveApp(UI.app.getProjects())
    }

    static clear() {
        document.querySelector('.default-projects').textContent = ''
        document.querySelector('.custom-projects').textContent = ''
        document.getElementById('project-title').textContent = ''
        document.getElementById('active-tasks').textContent = ''
        document.getElementById('completed-tasks-title').style.display = 'none'
        document.getElementById('completed-tasks').textContent = ''
    }

    static loadProject(Project) {
        const h1 = () => document.createElement('h1')
        const h3 = () => document.createElement('h3')

        // Grab title container
        const projectTitle = document.getElementById('project-title')

        // Create and populate title elements
        projectTitle.appendChild(
            Object.assign(h1(),
                {
                    id: 'project-title-1',
                    textContent: `${Project.getTitle()}`
                }
            )
        )

        // If project is 'My Day', create secondary element for the current date
        if (Project.getTitle() == 'My Day') {
            projectTitle.appendChild(
                Object.assign(h3(),
                    {
                        id: 'project-title-2',
                        textContent: `${format(new Date(), "eeee, d MMM y").toUpperCase()}`
                    }
                )
            )
        }

        // If project not default, enable title edit
        if (!Project.isDefault()) {
            const titleElement = document.getElementById('project-title-1')
            Object.assign(titleElement, 
                {
                    classList: 'title-editable',
                    contentEditable: true,
                    spellcheck: false
                }
            )
            titleElement.addEventListener('focusout', (e) => UI.updateProjectTitle(e.target.textContent))
        }  

        // Set project as active in nav menu
        const navItems = document.querySelectorAll('.nav-item')
        navItems.forEach(item => {
            if (item.children[0].children[1].textContent == Project.getTitle()) {
                item.classList.add('active')
            }
        })
         
        // Load project tasks
        Project.getTasks().forEach(Task => UI.appendTask(Task))
    }

    static initEventListeners() {
        // Page listeners
        const navOpen = document.getElementById('nav-open'),
              themeToggle = document.getElementById('theme-toggle'),
              projectDisplay = document.getElementById('project-display')

        navOpen.addEventListener('click', () => UI.toggleNavModal())
        themeToggle.addEventListener('click', () => UI.toggleTheme())
        projectDisplay.addEventListener('click', (e) => UI.handleTaskInput(e))
        window.addEventListener('keydown', (e) => UI.handleKeyboardInput(e))

        // Nav modal listeners
        const navModal = document.getElementById('nav')

        navModal.addEventListener('click', (e) => UI.handleNavModalInput(e))
        navModal.addEventListener('cancel', (e) => e.preventDefault())

        // Task modal listeners
        const taskModal = document.getElementById('task'),
              taskmodalTitle = document.getElementById('task-title'),
              taskModalNote = document.getElementById('task-note')
        
        taskModal.addEventListener('click', (e) => UI.handleTaskModalInput(e))
        taskmodalTitle.addEventListener('focusout', (e) => UI.checkModal())
        taskModalNote.addEventListener('focusout', (e) => UI.checkModal())
    }

    static handleTaskInput(e) {
        const target = e.target

        if (target.classList.contains('task')) {
            const selectedTask = target.children[1].textContent
            UI.app.getActiveProject().setActiveTask(selectedTask)
            UI.toggleTaskModal()
        }

        if (target.classList.contains('task-checkbox')) {
            const selectedTask = target.parentElement.children[1].textContent
            UI.app.getActiveProject().getTask(selectedTask).toggleComplete()
            UI.init() 
        }
    }

    static handleTaskModalInput(e) {
        const target = e.target

        if (target.id == 'task-checkbox') {
            UI.app.getActiveProject().getActiveTask().toggleComplete()
            UI.populateTaskModal()  // Push changes to the UI
            UI.init()               // Push changes to the UI
        }

        if (target.id == 'add-my-day') {
            console.log('Add to My Day clicked')                // Placeholder
        }

        if (target.id == 'remove-my-day') {
            console.log('Remove from My Day clicked')           // Placeholder
        }

        if (target.id == 'add-due') {
            console.log('Add due date clicked')                 // Placeholder
        }

        if (target.id == 'remove-due') {
            console.log('Remove due date clicked')              // Placeholder
        }

        if (target.classList.contains('menu-option')) {
            const classList = target.classList,
                  activeTask = UI.app.getActiveProject().getActiveTask()

            if (classList.contains('today')) {
                console.log('Due date menu - today clicked')        // Placeholder
            }
            if (classList.contains('tomorrow')) {
                console.log('Due date menu - tomorrow clicked')     // Placeholder
            }
            if (classList.contains('pick')) {
                console.log('Due date menu - pick clicked')         // Placeholder
                
            }

            UI.populateTaskModal()  // Push changes to the UI
            UI.init()               // Push changes to the UI
        }
        
        if (target.id == 'task-delete') {
            const selectedTask = UI.app.getActiveProject().getActiveTask()
            UI.deleteTask(selectedTask)
        }

        if (target.nodeName == 'DIALOG'
        || target.id == 'task-close'
        || target.id == 'task-delete') {
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

        // TODO: Refactor function



        // Placeholder task information
        // Get active task
        const activeTask = UI.app.getActiveProject().getActiveTask()

        // Get text-editable elements
        const title = document.getElementById('task-title'),
              note = document.getElementById('task-note'),
              creation = document.getElementById('task-creation')

        // Wipe text-editable modal elements to remove any persisting bugs
        title.textContent = ''
        note.textContent = ''
        creation.textContent = ''

        // Title
        title.textContent = activeTask.getTitle()

        // Note
        if (activeTask.getNote()) {
            note.classList.remove('placeholder')
            note.textContent = activeTask.getNote()
        } else note.classList.add('placeholder')
        
        // Creation date
        creation.textContent = `Created on ${activeTask.getCreationDate()}`  
    }

    static checkModal() {

        // TODO: Refactor function
        
    }

    static updateTask(task, value, i) {
        
        // TODO: Refactor function

    }

    static createTask(Title) {
        UI.app.getActiveProject().addTask(Title)
        UI.init()
    }

    static deleteTask(Task) {
        UI.app.getActiveProject().deleteTask(Task.getTitle())
        UI.init()    
    }

    static updateProjectTitle(Title) {
        console.log('Title: ', Title)
        if (Title == undefined || Title == null || Title == '') {
            console.log('ERROR: Cannot have a blank project title.')
            return UI.init()
        }
        else if (UI.app.getActiveProject().isDefault()) {
            console.log('ERROR: Cannot edit a default project title.')
            return UI.init()
        } else {
            console.log('Updating project title.')
            UI.app.getActiveProject().setTitle(Title)
            return UI.init()
        }
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
        const defaultProjects = document.querySelector('.default-projects'),
              customprojects = document.querySelector('.custom-projects')

        if (Project.isDefault()) {
            defaultProjects.innerHTML += `
                <span href="" class="nav-item">
                    <span class="nav-item-left">
                        <span class="material-symbols-rounded">${Project.getIcon()}</span>
                            <h3>${Project.getTitle()}</h3>
                    </span>
                    <span class="nav-item-right">
                        <span class="project-task-count">${Project.taskCount()}</span>
                        <span class="project-delete material-symbols-rounded">delete</span>
                    </span>
                </span>`
        } else {
            customprojects.innerHTML += `
                <span href="" class="nav-item">
                    <span class="nav-item-left">
                        <span class="material-symbols-rounded">${Project.getIcon()}</span>
                            <h3>${Project.getTitle()}</h3>
                    </span>
                    <span class="nav-item-right">
                        <span class="project-task-count">${Project.taskCount()}</span>
                        <span class="project-delete material-symbols-rounded">delete</span>
                    </span>
                </span>`
        }
    }
}
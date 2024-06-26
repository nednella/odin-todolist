import Storage from './Storage'
import datePicker from './datePicker';
import { format, add } from 'date-fns'
import { parseDueDate } from './Utilities'

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
    static datePicker = new datePicker()

    static initApp() {
        console.log('UI: App initialising...')

        // Debugging
        console.log('UI - App: ', UI.app)

        UI.init()
        UI.initEventListeners()
        UI.setTheme(Storage.getTheme())
    }

    static init() {
        Storage.saveApp(UI.app.getProjects())
        UI.clear()
        UI.app.populateMyDay()
        UI.app.populateImportant()
        UI.app.getProjects().forEach(Project => UI.appendProject(Project))
        UI.loadProject(UI.app.getActiveProject()) 
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
              taskModalTitle = document.getElementById('task-title'),
              taskModalNote = document.getElementById('task-note'),
              datePicker = document.getElementById('date-picker')

        taskModal.addEventListener('click', (e) => UI.handleTaskModalInput(e))
        taskModalTitle.addEventListener('focusout', (e) => UI.checkTaskModal())
        taskModalNote.addEventListener('focusout', (e) => UI.checkTaskModal())
        datePicker.addEventListener('click', (e) => UI.handleDatePickerInput(e))
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
        const target = e.target,
              activeTask = UI.app.getActiveProject().getActiveTask()
        
        if (target.id == 'task-checkbox') {
            activeTask.toggleComplete() 
            UI.populateTaskModal()  // Push changes to the UI
            UI.init()               // Push changes to the UI
        }

        if (target.id == 'add-my-day' || target.id == 'remove-my-day') {
            activeTask.toggleMyDay()
            UI.populateTaskModal()  // Push changes to the UI
            UI.init()               // Push changes to the UI
        }

        if (target.id == 'add-important' || target.id == 'remove-important') {
            activeTask.toggleImportant()
            UI.populateTaskModal()  // Push changes to the UI
            UI.init()               // Push changes to the UI
        }

        if (target.id == 'add-due') {
            if (!document.getElementById('date-picker').classList.contains('hidden')) {
                UI.toggleDatePicker()   // If date picker is open, close it
            }
            UI.toggleDueDateMenu()
        }

        if (target.id == 'remove-due') {
            UI.app.getActiveProject().getActiveTask().removeDueDate()
            UI.populateTaskModal()  // Push changes to the UI
            UI.init()               // Push changes to the UI
        }

        if (target.classList.contains('menu-option')) {
            const classList = target.classList

            if (classList.contains('today')) {
                activeTask.setDueDate(format(new Date(), "yyyy-MM-dd"))
                UI.populateTaskModal()  // Push changes to the UI
                UI.init()               // Push changes to the UI  
            }
            if (classList.contains('tomorrow')) {
                activeTask.setDueDate(format(add(new Date(), {days: 1}), "yyyy-MM-dd"))
                UI.populateTaskModal()  // Push changes to the UI
                UI.init()               // Push changes to the UI
            }
            if (classList.contains('pick')) {
                UI.datePicker.displayDateReset()    // Reset displayed month to current month
                UI.populateDatePicker()
                UI.toggleDatePicker()
            }

            UI.toggleDueDateMenu()  // Close the menu after option selected  
        } 

        if (target.id !== 'add-due' && !target.classList.contains('menu-option') 
         && target.id !== 'date-picker'
         && !target.parentElement.classList.contains('month-selector')
         && !target.parentElement.classList.contains('calendar')) {
            if (!document.getElementById('due-menu').classList.contains('hidden')) {
                UI.toggleDueDateMenu()  // If a click is outside of the due date menu when it's open, close
            }
            if (!document.getElementById('date-picker').classList.contains('hidden')) {
                UI.toggleDatePicker()   // If a click is outside of the date picker when it's open, close
            }
        }
        
        if (target.id == 'task-delete') {
            UI.deleteTask(activeTask)
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

    static handleDatePickerInput(e) {
        const target = e.target

        if(target.id == 'month-left') {
            UI.datePicker.displayDatePrevMonth()
            UI.populateDatePicker()
        }

        if(target.id == 'month-right') {
            UI.datePicker.displayDateNextMonth()
            UI.populateDatePicker()
        }

        if (target.parentElement.classList.contains('calendar')) {
            if (target.classList.contains('faded')) return  // Prevent clicks on days not in the displayed month

            const selectedDate = UI.datePicker.getSelectedDate(target)
            UI.app.getActiveProject().getActiveTask().setDueDate(selectedDate)
            UI.populateTaskModal()  // Push changes to the UI
            UI.init()               // Push changes to the UI
        }
    }

    static getTheme() {
        return document.querySelector('html').getAttribute('data-theme')
    }

    static setTheme(theme) {
        return document.querySelector('html').setAttribute('data-theme', theme)
    }

    static toggleTheme() {
        const html = document.querySelector('html'),
              currentTheme = html.getAttribute('data-theme')

        currentTheme == 'light'
            ? html.setAttribute('data-theme', 'dark')
            : html.setAttribute('data-theme', 'light')

        Storage.saveTheme(UI.getTheme())
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
            UI.app.getActiveProject().removeActiveTask()    // Remove active task on modal close
        } else {
            task.showModal()
            UI.populateTaskModal()
        }
    }

    static toggleDueDateMenu() {
        const dueMenu = document.getElementById('due-menu')

        dueMenu.classList.contains('hidden')
            ? dueMenu.classList.remove('hidden')
            : dueMenu.classList.add('hidden')
    }

    static toggleDatePicker() {
        const datePicker = document.getElementById('date-picker')

        datePicker.classList.contains('hidden')
            ? datePicker.classList.remove('hidden')
            : datePicker.classList.add('hidden')
    }

    static populateTaskModal() {
        // Get active task
        const activeTask = UI.app.getActiveProject().getActiveTask()

        // Get text-editable modal elements
        const title = document.getElementById('task-title'),
              note = document.getElementById('task-note'),
              creation = document.getElementById('task-creation')

        // Wipe text-editable modal elements to remove any persisting bugs
        title.textContent = ''
        note.textContent = ''
        creation.textContent = ''

        // Get modal elements
        const checkbox = document.getElementById('task-checkbox'),
              addMyDay = document.getElementById('add-my-day'),
              removeMyDay = document.getElementById('remove-my-day'),
              addImportant = document.getElementById('add-important'),
              removeImportant = document.getElementById('remove-important'),
              addDue = document.getElementById('add-due'),
              removeDue = document.getElementById('remove-due')
              
        // Populate modal elements
        // Title
        title.textContent = activeTask.getTitle()

        // Checkbox
        if (activeTask.isComplete()) {
            checkbox.checked = true
            title.classList.add('task-complete')
        } else {
            checkbox.checked = false
            title.classList.remove('task-complete')
        }
        
        // My day
        const addMyDayChildren = Array.from(addMyDay.children)

        if (activeTask.isMyDay()) {
            addMyDayChildren.forEach(child => child.style.color = 'var(--modal-option-active')
            addMyDay.children[1].textContent = 'Added to My Day'
            removeMyDay.style.display = 'block'
        } else {
            addMyDayChildren.forEach(child => child.style.color = 'grey')
            addMyDay.children[1].textContent = 'Add task to My Day'
            removeMyDay.style.display = 'none'
        }

        // Important
        const addImportantChildren = Array.from(addImportant.children)

        if (activeTask.isImportant()) {
            addImportantChildren.forEach(child => child.style.color = 'var(--modal-option-active')
            addImportant.children[1].textContent = 'Marked as Important'
            removeImportant.style.display = 'block'
        } else {
            addImportantChildren.forEach(child => child.style.color = 'grey')
            addImportant.children[1].textContent = 'Mark as Important'
            removeImportant.style.display = 'none'
        }

        // Due date
        const addDueChildren = Array.from(addDue.children)

        if (activeTask.getDueDate()) {
            addDueChildren.forEach(child => child.style.color = 'var(--modal-option-active')
            removeDue.style.display = 'block'

            const dueDate = activeTask.getDueDate(),
                  todayDate = format(new Date(), "yyyy-MM-dd"),
                  tomorrowDate = format(add(new Date(), {days: 1}), "yyyy-MM-dd")
            
            if (new Date(dueDate) < new Date(todayDate)) {
                addDueChildren.forEach(child => child.style.color = 'red')
                addDue.children[1].textContent = `Overdue ${parseDueDate(dueDate)}`
            } else if (dueDate == todayDate) {
                addDue.children[1].textContent = 'Due Today'
            } else if (dueDate == tomorrowDate) {
                addDue.children[1].textContent = 'Due Tomorrow'
            } else {
                addDue.children[1].textContent = `Due ${parseDueDate(dueDate)}`
            }
        } else {
            addDueChildren.forEach(child => child.style.color = 'grey')
            addDue.children[1].textContent = `Add a due date`  
            removeDue.style.display = 'none'
        }

        // Due date menu options
        UI.populateDueDateMenu()

        // Due date picker
        UI.populateDatePicker()
        
        // Note
        if (activeTask.getNote()) {
            note.classList.remove('placeholder')
            note.textContent = activeTask.getNote()
        } else note.classList.add('placeholder')
        
        // Creation date
        creation.textContent = `Created on ${activeTask.getCreationDate()}`   
    }

    static populateDueDateMenu() {
        const span = () => document.createElement('span')
        const menuOptions = document.querySelectorAll('.menu-option')

        menuOptions.forEach(option => {
            option.textContent = '' // Wipe element to prevent duplicates
            option.appendChild(
                Object.assign(span(),
                    {
                        classList: 'material-symbols-rounded',
                        textContent: 'calendar_month'
                    }
                )
            )
            if (option.classList.contains('today')) {
                option.appendChild(span()).textContent = `Today`
                option.appendChild(span()).textContent = `${format(new Date(), "eee")}`
            }
            if (option.classList.contains('tomorrow')) {
                option.appendChild(span()).textContent = `Tomorrow`
                option.appendChild(span()).textContent = `${format(add(new Date(), {days: 1}), "eee")}`
            }
            if (option.classList.contains('pick')) {
                option.appendChild(span()).textContent = `Pick a date`
            }
        })
    }

    static populateDatePicker() {
        // Get date picker container
        const datePicker = document.getElementById('date-picker')

        // Wipe container to prevent duplication
        datePicker.textContent = ''

        // Create and append elements
        const elements = UI.datePicker.createHTML()
        elements.forEach(element => datePicker.appendChild(element))
    }

    static checkTaskModal() {
        // Get current stored task values
        const task = UI.app.getActiveProject().getActiveTask()
        const taskVals = [
            task.getTitle(),
            task.getNote()
        ]

        // Get current task modal values
        const modalVals = [
            document.getElementById('task-title').textContent,
            document.getElementById('task-note').textContent
        ]

        // Check for changes
        modalVals.forEach((element, i) => {
            taskVals[i] !== element
                ? UI.updateTask(task, element, i)
                : null
        })
        
    }

    static updateTask(task, value, i) {
        if (i == 0) {   // Title element
            if (value == '') return console.log('ERROR: Cannot have a blank task title.')
            console.log('Updating title.')
            task.setTitle(value)
        }
        if (i == 1) {   // Note element
            console.log('Updating note.')
            task.setNote(value)
        }
        UI.populateTaskModal()  // Push changes to the UI
        UI.init()               // Push changes to the UI
    }

    static createTask(Title) {
        // Get active project
        const activeProject = UI.app.getActiveProject()

        // if default project, assign flag based on what project the task was added to
        if (activeProject.isDefault()) {
            const Tasks = UI.app.getProject('Tasks')

            switch (activeProject.getTitle()) {
                case 'My Day':
                    Tasks.addTask(Title, true, null)
                    break

                case 'Important':
                    Tasks.addTask(Title, null, true)
                    break
                
                case 'Tasks':
                    Tasks.addTask(Title)
                    break
            }
        } else {
            activeProject.addTask(Title)
        }
        UI.init()
    }

    static deleteTask(Task) {
        UI.app.getProject(Task.getParent()).deleteTask(Task.getTitle())
        UI.init()    
    }

    static updateProjectTitle(Title) {
        if (Title == undefined || Title == null || Title == '') {
            console.log('ERROR: Cannot have a blank project title.')
            return UI.init()
        }
        else if (UI.app.getActiveProject().getTitle() == Title) return
        else if (UI.app.getActiveProject().isDefault()) {
            console.log('ERROR: Cannot edit a default project title.')
            return UI.init()
        }
        else {
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
        const activeTasks = document.getElementById('active-tasks')
        const completedTasksTitle = document.getElementById('completed-tasks-title')
        const completedTasks = document.getElementById('completed-tasks')

        const taskHTML = `
            <div class="${Task.isComplete() ? 'task task-complete' : 'task'}">
                <input 
                    class="task-checkbox"
                    type="checkbox"
                    ${Task.isComplete() ? 'checked' : ''}
                >
                <p class="task-content">${Task.getTitle()}</p>
                <div class="task-info">
                    <span class="task-parent">${Task.getParent()}</span>
                    ${Task.isMyDay() ? '<span class="material-symbols-rounded">clear_day</span>' : ''}
                    ${Task.isImportant() ? '<span class="material-symbols-rounded">priority_high</span>' : ''}
                    ${Task.getDueDate() ? '<span class="material-symbols-rounded">calendar_month</span>' : ''}
                    ${Task.getNote() ? '<span class="material-symbols-rounded">sticky_note_2</span>' : ''}
                </div>
            </div>`

        if (Task.isComplete()) {
            completedTasksTitle.style.display = 'block'
            completedTasks.innerHTML += taskHTML
        } else {
            activeTasks.innerHTML += taskHTML
        }  
    }

    static appendProject(Project) {
        const defaultProjects = document.querySelector('.default-projects'),
              customprojects = document.querySelector('.custom-projects')

        const projectHTML = `
            <span href="" class="nav-item">
                <span class="nav-item-left">
                    <span class="material-symbols-rounded">${Project.getIcon()}</span>
                        <h3>${Project.getTitle()}</h3>
                </span>
                <span class="nav-item-right">
                    <span class="project-task-count">${Project.taskCount()}</span>
                    ${Project.isDefault() ? '' : '<span class="project-delete material-symbols-rounded">delete</span>'}
                </span>
            </span>`

        if (Project.isDefault()) {
            defaultProjects.innerHTML += projectHTML
        } else {
            customprojects.innerHTML += projectHTML
        }
    }
}
import '../scss/app.scss'
import toDoList from './toDo'

const ui = (() => {

    // Initialise application
    const toDo = new toDoList()



    // Buttons
    const themeToggle = document.getElementById('theme-toggle')
    const navOpen = document.getElementById('nav-open')
    const navClose = document.getElementById('nav-close')
    const navLinks = document.querySelector('.nav-links')
    
    // Inputs
    const taskInput = document.getElementById('add-task-input')
    const projectInput = document.getElementById('add-project-input')

    // Elements
    const html = document.querySelector('html')
    const nav = document.getElementById('nav')
    const projectsList = document.querySelector('.custom-projects')
    const projectDisplay = document.getElementById('active-project')

    // Variables
    let projectTitle = document.getElementById('project-title-1').textContent
    let activeProject = toDo.getProject(projectTitle)



    // Create some tasks for 'My Day'
    let myDay = toDo.getProject('My Day')
    myDay.addTask('My Day - Testing 1')
    myDay.addTask('My Day - Testing 2')
    myDay.addTask('My Day - Testing 3')

    // Create some tasks for 'All Tasks'
    let allTasks = toDo.getProject('All Tasks')
    allTasks.addTask('All Tasks - Testing 1')
    allTasks.addTask('All Tasks - Testing 2')
    allTasks.addTask('All Tasks - Testing 3')

    reloadProject()



    // UI Functions
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme')
        if (currentTheme == 'light') {
            html.setAttribute('data-theme', 'dark')
        } else {
            html.setAttribute('data-theme', 'light')
        }
    }

    function toggleNav() {
        if (nav.hasAttribute('open')) {
            nav.close()
            projectInput.value = '' // Clear project input on nav close
        } else {
            nav.showModal()
        }
    }

    function navSetActive(e) {
        const navOptions = document.querySelectorAll('.nav-item')
        navOptions.forEach(option => option.classList.remove('active'))

        e.target.classList.add('active')
        // toggleNav()                 // Close nav after selecting a nav link
    }

    function navHandleClick(e) {
        if (e.target && e.target.classList.contains('nav-item')) {
            const selectedProject = e.target.children[0].children[1].textContent
            activeProject = toDo.getProject(selectedProject)
            navSetActive(e)         // Set selected nav link as active
            reloadProject()         // Populate project display with selected link
        }
        if (e.target && e.target.classList.contains('project-delete')) {
            console.log('delete project')   // Delete selected project

            // If deleted project is active,
                // Set X as new active project
            // Reload UI

        }
    }






    function createTask(Title) {
        activeProject.addTask(Title)
        appendTask(Title)
    }

    function createProject(Title) {
        toDo.addProject(Title)
        appendProject(Title)
    }

    function reloadProject() {
        clearProject()

        const tasks = activeProject.getTasks()
        tasks.forEach(task => {
            appendTask(task.getTitle())
        })
    }

    function clearProject() {
        projectDisplay.innerHTML = ''
    }








    // Create DOM Elements
    function appendTask(value) {
        projectDisplay.innerHTML += `
            <div class="task">
                <input 
                    class="task-checkbox"
                    type="checkbox"
                >
                <p class="task-content">${value}</p>
                <div class="task-project">Tasks</div>
            </div>`
    }

    function appendProject(value) {
        projectsList.innerHTML += `
            <span href="" class="nav-item" data-custom-project>
                <span class="nav-item-left">
                    <span class="material-symbols-rounded">menu</span>
                        <h3>${value}</h3>
                </span>
                <span class="nav-item-right">
                    <span class="project-count">0</span>
                    <span class="project-delete material-symbols-rounded">delete</span>
                </span>
            </span>`
    }








    // Event Listeners
    themeToggle.addEventListener('click', () => toggleTheme())
    navOpen.addEventListener('click', () => toggleNav())
    navClose.addEventListener('click', () => toggleNav())
    navLinks.addEventListener('click', (e) => navHandleClick(e))
    nav.addEventListener('click', (e) => {
        if (e.target.nodeName == 'DIALOG') {
            nav.close()             // Close nav modal by clicking on backdrop
        }
    })
    nav.addEventListener('cancel', (e) => {
        e.preventDefault()          // Prevent ESC from closing nav modal to allow for clearing project input on ESC
    })
    window.addEventListener('keydown', (e) => {
        if (e.key == 'Escape') {    // Clear input on ESC
            if (document.activeElement == taskInput) {
                taskInput.value = ''
            }
            if (document.activeElement == projectInput) {
                projectInput.value = ''
            }
        }
        if (e.key == 'Enter') {     // Submit input on Enter
            if (document.activeElement == taskInput && taskInput.value !== '') {
                createTask(taskInput.value)
                taskInput.value = ''         
            }
            if (document.activeElement == projectInput  && projectInput.value !== '') {
                createProject(projectInput.value)
                projectInput.value = ''
            }
        }  
    })
})()




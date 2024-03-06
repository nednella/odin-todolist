import toDoList from './toDoList'

const ui = (() => {

    // Initialise application
    const app = new toDoList()

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
    const projectTitle1 = document.getElementById('project-title-1')
    const projectTitle2 = document.getElementById('project-title-2')
    const projectDisplay = document.getElementById('active-project')

    // Variables
    let projectTitle = projectTitle1.textContent,
        projectDate = projectTitle2.textContent,
        activeProject = app.getProject(projectTitle)


    

    // Application Functions
    const appFns = (() => {
        function reloadProject() {
            clearProject()

            const tasks = activeProject.getTasks()
            tasks.forEach(task => {
                dom.appendTask(task.getTitle())
            })
        }
        function createTask(Title) {
            activeProject.addTask(Title)
            dom.appendTask(Title)
        }

        function createProject(Title) {
            app.addProject(Title)
            dom.appendProject(Title)
        }

        

        function clearProject() {
            projectDisplay.innerHTML = ''
        }
        return {
            createTask,
            createProject,
            reloadProject,
        }


    })()

    // DOM Functions
    const dom = (() => {
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
            toggleNav()                 // Close nav after selecting a nav link
        }
        function navHandleClick(e) {
            if (e.target && e.target.classList.contains('nav-item')) {
                const selectedProject = e.target.children[0].children[1].textContent
                activeProject = app.getProject(selectedProject)
                navSetActive(e)         // Set selected nav link as active
                app.reloadProject()         // Populate project display with selected link
            }
            if (e.target && e.target.classList.contains('project-delete')) {
                console.log('delete project')   // Delete selected project

                // If deleted project is active,
                    // Set X as new active project
                // Reload UI
            }
        }
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
        return {
            toggleTheme,
            toggleNav,
            navSetActive,
            navHandleClick,
            appendTask,
            appendProject
        }
    })()
    

    
    
    // TESTING
    // Create some tasks for 'My Day'
    let myDay = app.getProject('My Day')
    myDay.addTask('My Day - Testing 1')
    myDay.addTask('My Day - Testing 2')
    myDay.addTask('My Day - Testing 3')

    // Create some tasks for 'All Tasks'
    let allTasks = app.getProject('All Tasks')
    allTasks.addTask('All Tasks - Testing 1')
    allTasks.addTask('All Tasks - Testing 2')
    allTasks.addTask('All Tasks - Testing 3')

    app.reloadProject()


    // Event Listeners
    themeToggle.addEventListener('click', () => dom.toggleTheme())
    navOpen.addEventListener('click', () => dom.toggleNav())
    navClose.addEventListener('click', () => dom.toggleNav())
    navLinks.addEventListener('click', (e) => dom.navHandleClick(e))
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
                app.createTask(taskInput.value)
                taskInput.value = ''         
            }
            if (document.activeElement == projectInput  && projectInput.value !== '') {
                app.createProject(projectInput.value)
                projectInput.value = ''
            }
        }  
    })
})()
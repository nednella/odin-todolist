import '../scss/app.scss'

const ui = (() => {

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
        navRemoveActive()
        e.target.classList.add('active')
        // toggleNav()                 // Close nav after selecting a nav link
    }

    function navRemoveActive() {
        const navOptions = document.querySelectorAll('.nav-item')
        navOptions.forEach(option => option.classList.remove('active'))
    }





    // Create DOM Elements
    function appendTask(value) {
        const taskList = document.getElementById('project-tasks')
        taskList.innerHTML += `
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
        const projectList = document.querySelector('.custom-projects')
        projectList.innerHTML += `
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
    navLinks.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('nav-item')) {
            navSetActive(e)         // Set selected nav link as active

            // Set nav link as active
            // Set selected project as active
            // Reload UI

        }
        if (e.target && e.target.classList.contains('project-delete')) {
            console.log('delete project')   // Delete selected project

            // If deleted project is active,
                // Set X as new active project
            // Reload UI

        }
    })
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
                appendTask(taskInput.value)
                taskInput.value = ''         
            }
            if (document.activeElement == projectInput  && projectInput.value !== '') {
                appendProject (projectInput.value)
                projectInput.value = ''
            }
        }  
    })
})()




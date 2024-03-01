import '../scss/app.scss'
import toggleTheme from './toggleTheme'
import toggleNav from './toggleNav'

// Theme toggle
const themeToggle = document.getElementById('theme-toggle')
themeToggle.addEventListener('click', toggleTheme)

// Nav buttons
const navOpen = document.getElementById('nav-open')
navOpen.addEventListener('click', toggleNav)

const navClose = document.getElementById('nav-close')
navClose.addEventListener('click', toggleNav)

// Close nav by clicking on backdrop
const nav = document.getElementById('nav')
nav.addEventListener('click', (e) => {
    if (e.target.nodeName == 'DIALOG') {
        nav.close()     // Close nav modal by clicking on backdrop
    }
})
nav.addEventListener('cancel', (e) => {
    e.preventDefault()  // Prevent ESC from closing nav modal
} )



// 1. Implement add task/project input functionality
// 2. Implement html constructor functions for producing tasks and projects


// Add task/project
const addTask = document.getElementById('add-task-input')
const addProject = document.getElementById('add-project-input')

window.addEventListener('keydown', (e) => {
    // Esc key for input clear
    if (e.key == 'Escape') {
        if (document.activeElement == addTask) {
            addTask.value = ''
        }
        if (document.activeElement == addProject) {
            addProject.value = ''
        }
    }

    // Enter key for input submission
    if (e.key == 'Enter') {
        if (document.activeElement == addTask && addTask.value !== '') {
            createNewTask(addTask.value)
            addTask.value = ''         
        }
        if (document.activeElement == addProject  && addProject.value !== '') {
            createNewProject (addProject.value)
            addProject.value = ''
        }
    }  
})



// HTML constructors for tasks/projects
function createNewTask (value) {
    console.log('add task')
    const projectTasks = document.getElementById('project-tasks')
    projectTasks.innerHTML += `
        <div class="task">
            <input 
                class="task-checkbox"
                type="checkbox"
            >
            <p class="task-content">${value}</p>
            <div class="task-project">Tasks</div>
        </div>`
}

function createNewProject (value) {
    console.log('add project')
    const navLinks = document.querySelector('.custom-projects')
    navLinks.innerHTML += `
        <a href="" class="nav-item" data-custom-project>
            <span class="nav-item-left">
                <span class="material-symbols-rounded">menu</span>
                    <h3>${value}</h3>
            </span>
            <span class="nav-item-right">
                <span class="project-count">0</span>
                <span class="project-delete material-symbols-rounded">delete</span>
            </span>
        </a>`
}



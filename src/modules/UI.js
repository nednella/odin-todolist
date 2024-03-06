export default class UI {
    constructor() {
        if (this instanceof UI) {
            throw Error ('Error: static class, cannot be isntantiated.')
        }
    }

    static init() {
        UI.initEventListeners()
    }

    static initEventListeners() {
        const nav = document.getElementById('nav')
        const navOpen = document.getElementById('nav-open')
        const navClose = document.getElementById('nav-close')
        const themeToggle = document.getElementById('theme-toggle')
        
        nav.addEventListener('click', (e) => e.target.nodeName == 'DIALOG' ? UI.toggleNav() : null)
        nav.addEventListener('cancel', (e) => e.preventDefault())
        navOpen.addEventListener('click', () => UI.toggleNav())
        navClose.addEventListener('click', () => UI.toggleNav())
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

    static handleKeyboardInput(e) {
        const taskInput = document.getElementById('add-task-input')
        const projectInput = document.getElementById('add-project-input')

        switch(document.activeElement) {
            case taskInput:
                if (e.key == 'Escape') taskInput.value = ''
                if (e.key == 'Enter') {
                    UI.createTask(taskInput.value)
                    taskInput.value = ''
                }
                break

            case projectInput:
                if (e.key == 'Escape') projectInput.value = ''
                if (e.key == 'Enter') {
                    UI.createProject(projectInput.value)
                    projectInput.value = ''
                }
                break
        }
    }

    static createTask(Title) {
        console.log('Creating Task...')
        return
    }

    static createProject(Title) {
        console.log('Creating Project...')
        return
    }
}
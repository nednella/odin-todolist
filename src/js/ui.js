import '../scss/app.scss'
import toggleTheme from './toggleTheme.js'
import toggleNav from './toggleNav.js'

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
        nav.close()
    }
})

import './scss/app.scss'

// Theme toggle
const themeToggle = document.getElementById('theme-toggle')
themeToggle.addEventListener('click', toggleTheme)

function toggleTheme() {
    const html = document.querySelector('html')
    const currentTheme = html.getAttribute('data-theme')

    if (currentTheme == 'light') {
        html.setAttribute('data-theme', 'dark')
    } else {
        html.setAttribute('data-theme', 'light')
    }
}

// Nav menu toggle
const navOpen = document.getElementById('nav-open')
navOpen.addEventListener('click', toggleModal)
const navClose = document.getElementById('nav-close')
navClose.addEventListener('click', toggleModal)

function toggleModal() {
    const nav = document.getElementById('nav')
    if (nav.hasAttribute('open')) {
        nav.close()
    } else {
        nav.showModal()
    }
}

const nav = document.getElementById('nav')
nav.addEventListener('click', (e) => {
    if (e.target.nodeName == 'DIALOG') {
        nav.close()
    }
})

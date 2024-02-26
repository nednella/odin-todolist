import './scss/main.scss'

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

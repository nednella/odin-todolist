
export default function toggleNav() {
    const nav = document.getElementById('nav')
    if (nav.hasAttribute('open')) {
        nav.close()
    } else {
        nav.showModal()
    }
}

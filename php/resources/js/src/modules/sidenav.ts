
export {}

// Scroll
let scroll: number = 0

// Scroll Function
document.getElementById("body").onscroll = () => {
    const nowScroll = document.documentElement.scrollTop
    const delta = nowScroll - scroll
    if (delta != 0) {
        // Calc Side Scroll
        let sideScroll = document.getElementById('div.sb-sidenav-menu').scrollTop
        sideScroll += delta
        if (sideScroll < 0) sideScroll = 0
        // Fix Navbar Overflow
        let navSize = document.getElementById('navBar').offsetHeight
        if (sideScroll > navSize) sideScroll = navSize
        // Assign Scroll
        document.getElementById('div.sb-sidenav-menu').scrollTop = sideScroll
        scroll = document.documentElement.scrollTop
    }
}

// Toggle Function
document.getElementById("sidebarToggle").onclick = () => {
    return document.getElementById('body')
        .classList.toggle('sb-sidenav-toggled')
}

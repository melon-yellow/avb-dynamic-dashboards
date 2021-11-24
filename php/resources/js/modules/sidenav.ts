
/*
##########################################################################################################################
*/

// Scroll
export let scroll: number = 0

/*
##########################################################################################################################
*/

// Scroll Function
const body = document.getElementById("body")
if (body) body.onscroll = () => {
    const nowScroll = document.documentElement.scrollTop
    const delta = nowScroll - scroll
    if (delta != 0) {
        // Calc Side Scroll
        let sideScroll = Number(document.getElementById('div.sb-sidenav-menu')?.scrollTop)
        sideScroll += delta
        if (sideScroll < 0) sideScroll = 0
        // Fix Navbar Overflow
        let navSize = Number(document.getElementById('navBar')?.offsetHeight)
        if (sideScroll > navSize) sideScroll = navSize
        // Assign Scroll
        const menu = document.getElementById('div.sb-sidenav-menu')
        if (menu) menu.scrollTop = sideScroll
        scroll = document.documentElement.scrollTop
    }
}

/*
##########################################################################################################################
*/

// Toggle Function
const toggle = document.getElementById("sidebarToggle")
if (toggle) toggle.onclick = () => {
    return document.getElementById('body')
        ?.classList.toggle('sb-sidenav-toggled')
}

/*
##########################################################################################################################
*/

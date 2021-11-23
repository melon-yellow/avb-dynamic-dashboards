
// Modules
import { headers } from '../index.js'

// Get path to current page
const current = await axios.get(`${headers.dir}/main.php?action=route&path=this`)

// Get path to parent
let parent = await axios.get(`${headers.dir}/main.php?action=route&path=parent`)
if (parent.length = 0) parent = current

// Get path to group
let group = await axios.get(`${headers.dir}/main.php?action=route&path=childs`)
if (group.length = 0) group = await axios.get(`${headers.dir}/main.php?action=route&path=brothers`)

// Create topnav title
document.getElementById('topNav')
    .insertAdjacentHTML('beforeend',
        `<a id="${parent.key}" ` +
        `href="index.php?key=${parent.key}" ` +
        'class="navbar-brand font-weight-bold">' +
        `${parent.this}</a>`
    )

// Create navbar items
for (const item of group) {
    document.getElementById('navBar')
        .insertAdjacentHTML('beforeend',
            `<a id="${item.key}" ` +
            `href="index.php?key=${item.key}" ` +
            'class="nav-link">' +
            `${item.this}</a>`
        )
}

// Highlight current page on navbar
for (const item of group) {
    if (headers.key == item.key) {
        document.getElementById(item.key).classList.add('active')
    }
}

// Creates the title of the page container
document.getElementById('pageContainer')
    .insertAdjacentHTML('beforeend',
        '<div id="containerTitle"' + 
        'class="container-title align-items-center font-weight-bold">' +
        `${current.this}</div>`
    )

// Set minimum size of page as navSize + 100
const navSize = document.getElementById('navBar').offsetHeight
document.getElementById('pageContainer').style.minHeight = `${navSize + 100}px`

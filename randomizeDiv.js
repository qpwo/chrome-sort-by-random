// chrome.browserAction.onClicked.addListener(function (tab) { alert("icon clicked") })

var CLASSNAME = "will_randomize"
var mouseDiv = null
var focusDiv = null
var upCount = 0

function updateFocusDiv(newDiv) {
    if (newDiv !== focusDiv) {
        if (focusDiv != null) {
            focusDiv.classList.remove(CLASSNAME)
        }
        newDiv.classList.add(CLASSNAME)
        focusDiv = newDiv
    }
}

function handleMouseMove(e) {
    upCount = 0
    mouseDiv = e.target
    updateFocusDiv(mouseDiv)
}


function nParent(div, n) {
    let result = div
    for (let i = 0; i < n; i++) {
        result = result.parentElement
    }
    return result
}

function handleKeyDown(event) {
    switch (event.key) {
        case "ArrowDown":
            upCount = Math.max(upCount - 1, 0)
            updateFocusDiv(nParent(mouseDiv, upCount))
            break
        case "ArrowUp":
            upCount = upCount + 1
            updateFocusDiv(nParent(mouseDiv, upCount))
            break
        case "Enter":
            shuffleChildren(focusDiv)
            finish()
            break
        case "Escape":
            finish()
            break
        default:
            return
    }
}

function handleKeyUp(event) {
    if (event.ctrlKey && event.altKey && (event.key == "r" || event.key == "®")) {
        start()
    }
}

function shuffleChildren(div) {
    for (var i = div.children.length; i >= 0; i--) {
        div.appendChild(div.children[Math.random() * i | 0])
    }
}

function finish() {
    if (focusDiv != null) {
        focusDiv.classList.remove(CLASSNAME)
        upCount = 0
    }
    document.removeEventListener("mousemove", handleMouseMove, false)
    document.removeEventListener("keydown", handleKeyDown, false)
    document.addEventListener("keyup", handleKeyUp, false)
}

function start() {
    document.addEventListener("keydown", handleKeyDown, false)
    document.addEventListener("mousemove", handleMouseMove, false)
    document.removeEventListener("keyup", handleKeyUp, false)
}

document.addEventListener("keyup", handleKeyUp, false)

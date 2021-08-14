chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: main
    })
})


function main() {
    var mouseDiv = null
    var focusDiv = null
    var upCount = 0

    function applyStyle(elm) {
        elm.oldBackground = elm.style.background
        elm.oldOutline = elm.style.outline
        elm.style.background = "#bcd5eb"
        elm.style.outline = "1px dashed red"
    }
    function removeStyle(elm) {
        elm.style.background = elm.oldBackground
        elm.style.outline = elm.oldOutline
    }

    function updateFocusDiv(newDiv) {
        if (newDiv !== focusDiv) {
            if (focusDiv != null) {
                removeStyle(focusDiv)
            }
            applyStyle(newDiv)
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
            if (result.parentElement == null) {
                break
            }
            result = result.parentElement
        }
        return result
    }

    function handleKeyDown(event) {
        switch (event.key) {
            case "ArrowDown":
                upCount = Math.max(upCount - 1, 0)
                updateFocusDiv(nParent(mouseDiv, upCount))
                event.preventDefault()
                break
            case "ArrowUp":
                upCount = upCount + 1
                updateFocusDiv(nParent(mouseDiv, upCount))
                event.preventDefault()
                break
            case "Enter":
                shuffleChildren(focusDiv)
                finish()
                event.preventDefault()
                break
            case "Escape":
                finish()
                event.preventDefault()
                break
            default:
                return
        }
    }


    function shuffleChildren(div) {
        for (var i = div.children.length; i >= 0; i--) {
            div.appendChild(div.children[Math.random() * i | 0])
        }
    }

    function finish() {
        if (focusDiv != null) {
            removeStyle(focusDiv)
            upCount = 0
        }
        document.removeEventListener("mousemove", handleMouseMove, false)
        document.removeEventListener("keydown", handleKeyDown, false)
    }

    function start() {
        document.addEventListener("keydown", handleKeyDown, false)
        document.addEventListener("mousemove", handleMouseMove, false)
    }

    start()

    // document.addEventListener("keyup", handleKeyUp, false)
}
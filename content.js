const isLinux = /Linux/.test(window.navigator?.userAgentData?.platform || window.navigator.platform)
if(isLinux) {
  setupScroller()
}

let SCROLL_STEP = 0.25

function setupScroller() {
  syncSensitivity()
  subscribeOnSensitivityChanges()

  const detectData = {
    direction: "",
    oldY: 0,
  }
  function detectDirection(event) {
    if (event.clientY > detectData.oldY) {
      detectData.direction="down";
    }
    else if (event.clientY < detectData.oldY) {
      detectData.direction="up";
    }
    detectData.oldY = event.clientY;

    return detectData.direction
  }

  const MAX_SCROLL_VALUE = 50

  const data = {
    intervalId: null,
    scrollChangingValue: 0,
    mouseMoveListening: false,
    handleMouseMove(event) {
      const direction = detectDirection(event)

      if(direction === "down") {
        if(data.scrollChangingValue >= MAX_SCROLL_VALUE) {
          return
        }
        data.scrollChangingValue += SCROLL_STEP
      }

      if(direction === "up") {
        if(data.scrollChangingValue <= MAX_SCROLL_VALUE * -1) {
          return
        }
        data.scrollChangingValue -= SCROLL_STEP
      }
    },
    handleScroll() {
      scroll(0, window.scrollY + data.scrollChangingValue)
    }
  }

  window.addEventListener("mousedown", (event) => {
    const isLinkClicked = !!event.target.closest("a")
    if(event.buttons !== 4 || isLinkClicked) {
      return
    }

    toggleCursorStyle()
    data.scrollChangingValue = 0

    if(data.mouseMoveListening) {
      data.mouseMoveListening = false
      window.removeEventListener("mousemove", data.handleMouseMove)
      clearInterval(data.intervalId)
    } else {
      data.mouseMoveListening = true
      window.addEventListener("mousemove", data.handleMouseMove)

      data.intervalId = setInterval(() => {
        if(data.scrollChangingValue === 0) {
          return
        }
        data.handleScroll()
      }, 20)
    }
  })

  window.addEventListener("click", () => {
    if(data.mouseMoveListening) {
      toggleCursorStyle()
      data.scrollChangingValue = 0
      data.mouseMoveListening = false
      window.removeEventListener("mousemove", data.handleMouseMove)
      clearInterval(data.intervalId)
    }
  })
}

function syncSensitivity() {
  chrome.storage.sync.get('sensitivity', ({ sensitivity }) => {
    if(!sensitivity) {
      console.log('sensitivity initilized', sensitivity)
      chrome.storage.sync.set({ sensitivity: SCROLL_STEP })
    } else {
      console.log('sensitivity updated', sensitivity)
      SCROLL_STEP = sensitivity
    }
  })
}
function subscribeOnSensitivityChanges() {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if(areaName === 'sync') {
      if('sensitivity' in changes) {
        SCROLL_STEP = changes.sensitivity.newValue
        console.log('sensitivity changed', SCROLL_STEP)
      }
    }
  })
}

function toggleCursorStyle() {
  if(document.body.style.cursor) {
    document.body.style.cursor = ""
  } else {
    document.body.style.cursor = "ns-resize"
  }
}

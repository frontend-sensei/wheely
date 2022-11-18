const isLinux = /Linux/.test(window.navigator?.userAgentData?.platform || window.navigator.platform)
if(isLinux) {
  setupScroller()
}

function setupScroller() {
  function toggleCursorStyle() {
    if(document.body.style.cursor) {
      document.body.style.cursor = ""
    } else {
      document.body.style.cursor = "ns-resize"
    }
  }
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
  const SCROLL_STEP = 0.25

  const data = {
    direction: "",
    intervalId: null,
    scrollChangingValue: 0,
    mouseMoveListening: false,
    handleMouseMove(event) {
      const direction = detectDirection(event)
      data.direction = direction
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
    if(event.buttons !== 4) {
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
}

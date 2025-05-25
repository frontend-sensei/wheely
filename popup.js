const slider = document.getElementById('sensitivity')

chrome.storage.sync.get('sensitivity', ({ sensitivity }) => {
  console.log('sensitivity', sensitivity)
  slider.value = sensitivity
  document.getElementById('sensitivity_value').textContent = sensitivity
})

slider.addEventListener('input', () => {
  document.getElementById('sensitivity_value').textContent = slider.value
})
slider.addEventListener('change', () => {
  chrome.storage.sync.set({ sensitivity: Number(slider.value) })
})

document.getElementById('reset_sensitivity').addEventListener('click', resetToDefault)

function resetToDefault() {
  chrome.storage.sync.set({ sensitivity: 0.25 })
  slider.value = 0.25
  document.getElementById('sensitivity_value').textContent = 0.25
}

const translationForm = document.getElementById('translation-form')
const userTextarea = document.getElementById('user-textarea')
const languageSelectionContainer = document.getElementById('language-selection-container')
const languageLabel = document.getElementById('language-label')
const radioContainer = document.getElementById('radio-container')
const translateBtn = document.getElementById('translate-btn')
const buttonText = document.getElementById('button-text')

function start() {
  translationForm.addEventListener('submit', handleTranslationRequest)
}

async function handleTranslationRequest(e){
  e.preventDefault()
  const userPrompt = userTextarea.value
  const targetLanguage = document.querySelector('input[name="language"]:checked')?.value

  console.log("userPrompt:", userPrompt)
  console.log("targetLanguage:", targetLanguage)
  if (!userPrompt || !targetLanguage) return

  if (buttonText.textContent !== 'Translate') {
    console.log('START OVER')
    startOver()
    
    return 
  }

  setLoading(true)
  try {
    const response = await fetch('/api/translation', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({userPrompt, targetLanguage})
    })
    
    const data = await response.json()
    const translation = data.translation

    languageLabel.textContent = `Translation in ${targetLanguage.toUpperCase()}:`
    document.querySelectorAll('.radio-row').forEach(row => row.classList.add('hide'))
    buttonText.textContent = 'Start Over'
    
    if (!radioContainer.querySelector('#translation-textarea')) {
      radioContainer.innerHTML += `<textarea id="translation-textarea">${translation}</textarea>`
    }
  } catch(err){
    console.error(err)
  } finally {
    setLoading(false)
  }
}

function setLoading(isLoading) {
  translateBtn.disabled = isLoading
  translateBtn.classList.toggle('is-loading', isLoading)
}

function startOver() {
  languageLabel.textContent = 'Select language 👇'
  document.querySelectorAll('.radio-row').forEach(row => row.classList.remove('hide'))
  radioContainer.querySelector('#translation-textarea').remove()
  buttonText.textContent = 'Translate'

}

start()
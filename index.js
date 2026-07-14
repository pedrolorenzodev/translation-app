const translationForm = document.getElementById('translation-form')
const userInput = document.getElementById('user-input')
// const translatedText = document.getElementById('translated-text') /// TODO:

function start() {
  translationForm.addEventListener('submit', handleTranslationRequest)
}

async function handleTranslationRequest(e){
  e.preventDefault()
  ////////// TODO
  const userPrompt = userInput.value
  const targetLanguage = document.querySelector('input[name="language"]:checked').value
  if (!userPrompt) return;
  
  try {
    
    const response = await fetch('/api/translation', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({userPrompt, targetLanguage})
    })
    
    const data = await response.json()
    console.log("FULL SERVER RESPONSE:", data)   // ← your logs, in the browser console

    if (!response.ok) {
      console.error("SERVER ERROR:", data.error)
      translatedText.textContent = "Error: " + data.error
      return
    }

    console.log("DEBUG:", data.debug)
    // const translation = data.translation
    
    // translatedText.textContent = translation /// TODO:
  } catch(err){
    console.error(err)
  }
}

start()
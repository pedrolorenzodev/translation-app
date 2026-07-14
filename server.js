console.log('Hi!')
import express from "express"
import OpenAI from 'openai'

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL
})

const messages = [{
  role: 'system',
  content: `
  You are the most accurate translator in the world.
  Your job is only to translate the user's input,
  into the requested language.
  
  Skip intro, outro, do not repeat the user's input.
  Only return the translation.
  `
}]

// '/api/translation' exist?
app.post('/api/translation', async (req, res) => {
  try {
    const {userPrompt, targetLanguage} = req.body
    
    messages.push({
      role: 'user',
      content: `Translate into ${targetLanguage}: ${userPrompt}`
    })
    
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages,
      // temperature: 1, // TODO
      // max_tokens: userPrompt.length * 2 // TODO
    })
    
    const translation = response.choices[0].message.content

    res.json({
      translation, 
      debug: {
          receivedBody: req.body,
          model: process.env.AI_MODEL,
          finishReason: response.choices[0].finish_reason
        }})
  } catch(err){
    res.status(500).json({ error: String(err) })
  }
})


// .env.PORT exist?
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
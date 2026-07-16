import express from "express"
import OpenAI from 'openai'

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL
})

const systemMessage = {
  role: 'system',
  content: `
You are an accurate translation engine.

Translate the user's text into the requested target language.

Return exactly two values:

1. translation:
   The natural translation in the target language.

2. readingGuide:
   A Latin-alphabet guide for reading the translation.

Rules:
- For Greek, return a strict romanized transliteration based on the written Greek letters, not a phonetic pronunciation.
  Example: Εκκλησία → Ekklēsía
- For Spanish, return a simple English-friendly phonetic pronunciation.
  Example: Iglesia → ee-GLEH-see-ah
- Never put the English meaning in readingGuide.
- Never repeat the original input.
- Do not add explanations, labels, introductions, or commentary.
`
}

app.post('/api/translation', async (req, res) => {
  try {
    const {userPrompt, targetLanguage} = req.body

    const messages = [
      systemMessage,
    {
      role: 'user',
      content: `
      Target language: ${targetLanguage},
      Text to translate: ${userPrompt}
      `
    }]
    
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages,
      temperature: 0,
      reasoning_effort: "minimal",
      max_completion_tokens: 512,

      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'translation_response',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              translation: {
                type: 'string',
                description: 'Natural translation in the target language.'
              },
              readingGuide: {
                type: 'string',
                description:
                  'For Greek: strict written-letter transliteration, not pronunciation. For Spanish: English-friendly phonetic pronunciation.'
              }
            },
            required: ['translation', 'readingGuide'],
            additionalProperties: false
          }
        }
      }
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error('The model returned an empty response.')
    }
    const result = JSON.parse(content)
    const translation = `${result.translation}\n(${result.readingGuide})`

    res.json({translation})
  } catch(err){
    console.error(err)
    res.status(500).json({ error: String(err) })
  }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
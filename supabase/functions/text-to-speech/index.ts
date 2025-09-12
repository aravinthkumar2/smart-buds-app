import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, language = 'en', voice_id, speed = 1.0 } = await req.json()
    
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY')
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not found')
    }

    // Voice mapping for different languages
    const voiceMap: Record<string, string> = {
      en: voice_id || 'EXAVITQu4vr4xnSDxMaL', // Sarah
      hi: voice_id || '9BWtsMINqrJLrRacOk9x', // Aria (multilingual)
      ta: voice_id || '9BWtsMINqrJLrRacOk9x', // Aria (multilingual)
      te: voice_id || '9BWtsMINqrJLrRacOk9x', // Aria (multilingual)  
      kn: voice_id || '9BWtsMINqrJLrRacOk9x', // Aria (multilingual)
    }

    const selectedVoiceId = voiceMap[language] || voiceMap.en

    // Model selection based on language
    const modelMap: Record<string, string> = {
      en: 'eleven_turbo_v2', // English only model for speed
      hi: 'eleven_multilingual_v2', // Multilingual for Hindi
      ta: 'eleven_multilingual_v2', // Multilingual for Tamil
      te: 'eleven_multilingual_v2', // Multilingual for Telugu
      kn: 'eleven_multilingual_v2', // Multilingual for Kannada
    }

    const selectedModel = modelMap[language] || modelMap.en

    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`
    
    const response = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: selectedModel,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true,
          speaking_rate: speed,
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs API error:', errorText)
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`)
    }

    const audioBuffer = await response.arrayBuffer()
    
    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    })

  } catch (error) {
    console.error('Error in text-to-speech function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
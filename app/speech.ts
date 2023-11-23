const API_KEY = process.env.ELEVEN_API_KEY!;

const VOICE_IDS: { [key: string]: string } = {
    "david": "REPLACE_THIS",
    "ricky": "REPLACE_THIS",
    "sarah": "REPLACE_THIS",
    "leslie": "REPLACE_THIS",
    "john": "REPLACE_THIS",
    "ron": "REPLACE_THIS"
};

export async function textToSpeech(text: string, voice: string) {
    const voiceID = VOICE_IDS[voice];
    if (!voiceID) {
        throw new Error(`Unsupported voice: ${voiceID}`);
    }

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceID}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'xi-api-key': API_KEY,
        }),
        body: JSON.stringify({
            text: text,
            model_id: "eleven_turbo_v2"
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} (${errorText})`);
    }

    return response.body;
}

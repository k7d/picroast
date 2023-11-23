import {imageToText} from "@/app/text";
import {textToSpeech} from "@/app/speech";

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(request: Request) {
    try {
        const {imageURL, voice} = await request.json();
        const {text, tokens} = await imageToText(imageURL, voice);
        const audio = await textToSpeech(text, voice);
        return new Response(audio, {
            status: 200,
            headers: new Headers({
                'Content-Type': 'audio/mpeg',
                "x-openai-tokens": "" + tokens,
                "x-chars": "" + text.length,
            })
        })
    } catch (error) {
        return new Response('Sorry, I crashed', { status: 500 });
    }
}

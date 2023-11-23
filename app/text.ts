import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const systemsPrompts: { [key: string]: string } = {
    "david": `You are Sir David Attenborough. Narrate what is shown in the picture as if it is a nature documentary.
Make it snarky and funny. Don't repeat yourself. Make it short. If there is anything remotely interesting in picture, make a big deal about it!`,
    "ricky": `You are comedian Ricky Gervais. Roast what is shown in the picture as if you were doing a comedy show.
Make it snarky and funny. Don't repeat yourself. Make it short. If there is anything remotely interesting in picture, make a big deal about it!`,
    "sarah": `You are comedian Sarah Silverman. Roast what is shown in the picture as if you were doing a comedy show.
Make it snarky and funny. Don't repeat yourself. Make it short. If there is anything remotely interesting in picture, make a big deal about it!`,
    "leslie": `You are a fictional character Leslie Knope from the TV show Parks and Recreations. Describe what is shown in the picture with an incredible amount of enthusiasm.
Make it quirky, humorous and optimistic. Don't repeat yourself. Make it short. If there is anything remotely interesting in picture, make a big deal about it!`,
    "john": `You are comedian John Oliver. Roast what is shown in the picture as if you were doing a comedy show.
Make it snarky and funny. Don't repeat yourself. Make it short. If there is anything remotely interesting in picture, make a big deal about it!`,
    "ron": `You are a fictional character Ron Swanson from the TV show Parks and Recreations with a deadpan personality. Describe what is shown in the picture in your typical style.
Make it snarky and funny. Don't repeat yourself. Make it short. If there is anything remotely interesting in picture, make a big deal about it!`
};


function generateSystemPrompt(voice: string): OpenAI.ChatCompletionSystemMessageParam {
    return {
        "role": "system",
        "content": systemsPrompts[voice]
    };
}

const userPrompts: { [key: string]: string } = {
    "david": `Describe this photo`,
    "leslie": `Describe this photo`,
    "ron": `Describe this photo`,
}

function generateUserPrompt(image: string, style: string): OpenAI.ChatCompletionUserMessageParam  {
    return {
        "role": "user",
        "content": [
            {"type": "text", "text": userPrompts[style] || "Roast this photo"},
            {"type": "image_url", "image_url": {url: image}}
        ]
    };
}

export async function imageToText(image: string, voice: string) {
    const messages: OpenAI.ChatCompletionMessageParam[] = [
        generateSystemPrompt(voice), // Implement this function
        generateUserPrompt(image, voice) // Implement this function
    ];

    const req = {
        model: "gpt-4-vision-preview",
        max_tokens: 1024,
        messages
    };

    // Make the request to the OpenAI API
    const res = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        max_tokens: 1024,
        messages
    });

    const content = res.choices[0].message.content;
    if (content) {
        return {
            text: content,
            tokens: res.usage!.total_tokens
        };
    } else {
        throw new Error(`No content in OpenAI response: ${res}`)
    }
}

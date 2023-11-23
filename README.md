# PicRoast

This repository contains code for [PicRoast](https://picroast.app) app.

PicRoast lets you capture a photo and turn into a comedy roast. It uses [OpenAI GPT-4 with vision](https://platform.openai.com/docs/guides/vision) and [ElevenLabs text-to-speech](https://elevenlabs.io/docs/api-reference/text-to-speech) APIs.

## How It Was Built

PicRoast was built an experiment to explore capabilites of GPT-4, and especially the new vision support, to generate code.

Most of the code was generate using GPT, with combo of text as well as visual instructions created with [Whimsical Wireframes](https://whimsical.com/wireframes).

For visual intructions the flow was pretty straight forward:
1. Create wireframes in Whimsical
2. Add some annotations and flows for logic
3. Select and copy as image (Cmd-Shift-C)
4. Paste it in ChatGPT and ask it to update code (assuming it was provided to ChatGPT earlier) based on diagram
5. Iterate and repeat as needed.

Here's some example Whimsical snapshots that were used in the process:

![image](https://github.com/k7d/picroast/assets/181645/8d13643e-7a13-4ca8-a23c-3a40990e773a)

All the bitmap images were also generate using new DALL·E 3 support in GPT-4.

## Running locally

1. Set API keys using environoment variables:

```bash
export OPENAI_API_KEY=YOUR_API_KEY
export ELEVEN_API_KEY=YOUR_API_KEY
```

2. Update voice IDs in speech.ts (these need to be added to your VoiceLab in ElevenLabs)

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


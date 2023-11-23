'use client'

import React, {useState, useRef, useEffect} from 'react';
import NImage from 'next/image'


// LOGO


const LogoView: React.FC<{ width?: number, className?: string }> = ({width = 290, className = ""}) => {
    return (
        <h1 className={className}>
            <a href="/">
                <NImage
                    src="/logo1.svg"
                    alt="PicRoast"
                    width={width}
                    height={(50 / 290) * width}/>
            </a>
        </h1>
    );
}

// State


enum State {
    TakePhoto,
    RoastOptions,
    PreparingRoast,
    ReadyToPlay,
    Playing,
    ReadyToReplay
}

// TAKE PHOTO


const TakePhotoView: React.FC<{
    onPhotoTaken: (photo: string) => void;
}> = ({onPhotoTaken}) => {
    const [supportsCapture, setSupportsCapture] = useState<boolean>(false);
    const photoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // check if the browser supports capture image from camera
        const testInput = document.createElement('input');
        testInput.setAttribute('capture', 'environment');
        setSupportsCapture('capture' in testInput);
    }, []);

    function takePhoto(upload = true) {
        if (upload) {
            // If upload is true, remove the "capture" attribute
            photoInputRef.current?.removeAttribute('capture');
        } else {
            // If upload is false, set the "capture" attribute to "environment"
            photoInputRef.current?.setAttribute('capture', 'environment');
        }
        photoInputRef.current?.click();
    }

    function limitImageSize(image: HTMLImageElement, maxSize: number) {
        // Check if resizing is necessary
        if (image.width <= maxSize && image.height <= maxSize) {
            return image.src; // Return original image data if no resizing is needed
        }

        const canvas = document.createElement('canvas');
        let width = image.width;
        let height = image.height;

        // Calculate the new dimensions while maintaining aspect ratio
        if (width > height) {
            if (width > maxSize) {
                height = Math.floor(height * maxSize / width);
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width = Math.floor(width * maxSize / height);
                height = maxSize;
            }
        }

        console.log(`Resizing image from ${image.width}x${image.height} to ${width}x${height}`);

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("Failed to get canvas context");
            return image.src;
        }
        ctx.drawImage(image, 0, 0, width, height);
        return canvas.toDataURL('image/jpeg', 0.5);
    }

    function takePhotoOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const image = new Image();
                image.onload = () => {
                    const resizedImage = limitImageSize(image, 1600);
                    console.log(`Image URL Size: ${(resizedImage.length/1024).toFixed(0)} KB`);
                    onPhotoTaken(resizedImage);
                };
                image.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <>
            <div className="fs-container mx-auto flex flex-col justify-center items-center p-8">
                <div
                    className="font-light text-lg w-[300px] text-center -mt-24 mb-2 bg-[url(/arrow.svg)] bg-bottom pb-[70px] bg-no-repeat"
                    style={{color: "rgba(0,0,0,0.5)"}}>
                    Snap a photo, and watch as PicRoast transforms it into a hilarious comedy roast using AI.
                </div>
                <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    capture={supportsCapture ? "environment" : undefined}
                    onChange={takePhotoOnChange}
                    className="hidden"
                />
                <button
                    onClick={() => takePhoto(!supportsCapture)}
                    className="bg-[url('/take-photo-bg@3x.png')] bg-100% h-[93px] text-3xl pl-10 pr-10 mb-8"
                >
                    {supportsCapture ? "Take a photo" : "Upload a photo"}
                </button>

                {supportsCapture ? (
                    <button
                        onClick={() => takePhoto(true)}
                        className="text-lg pt-2 pb-2 pl-4 pr-4 mb-10">
                        or upload from library
                    </button>
                ) : (<div className="h-20"/>)}
            </div>
            <div className="absolute font-light text-lg w-full bottom-0 right-0 text-center pb-4">
                <a className="simple-link" href="https://github.com/k7d/picroast">Code on GitHub</a>
            </div>
        </>
    );
};


// ROAST OPTIONS


const RoastOptionButton: React.FC<{
    voice: string,
    onSelectRoast?: (voice: string) => void
    className?: string
}> = ({voice, onSelectRoast, className}) => {
    return (
        <button
            className={className}
            onClick={onSelectRoast ? () => onSelectRoast(voice) : undefined}>
            <NImage
                src={"/avatar/" + voice + "@3x.png"}
                alt={voice}
                width={100}
                height={100}
            />
        </button>
    );
}

const voices = ["ricky", "sarah", "john", "leslie", "ron", "david"];

const RoastOptionsView: React.FC<{
    imageURL: string;
    onSelectRoast: (voice: string) => void;
    onRetakePhoto: () => void;
}> = ({imageURL, onSelectRoast, onRetakePhoto}) => {
    return (
        <div className="fs-container mx-auto flex flex-col items-center p-8">
            <div className='grow w-full bg-contain bg-no-repeat bg-center mb-6'
                 style={{backgroundImage: `url(${imageURL})`}}></div>
            <div className="mb-4 text-lg font-light">Brilliant! Now pick your roast:</div>
            <div className="grid grid-cols-3 gap-4 mb-6">
                {voices.map(voice => (
                    <RoastOptionButton key={voice} voice={voice} onSelectRoast={onSelectRoast}/>
                ))}
            </div>
            <button
                onClick={onRetakePhoto}
                className="button-outline font-light text-lg pt-2 pb-2 pl-4 pr-4"
            >
                or take another photo
            </button>
        </div>
    );
};


// ROASTING


const PlayButton: React.FC<{
    onPlay: () => void
}> = ({onPlay}) => {
    return (
        <button
            className="flex justify-center items-center w-full h-full group hover:opacity-100"
            onClick={onPlay}>
            <div
                className="rounded-full bg-white">
                <NImage
                    className="hover:opacity-80"
                    src="/play.svg"
                    alt="Play"
                    width={100}
                    height={100}
                />
            </div>
        </button>
    );
}

const RoastingView: React.FC<{
    voice: string;
    imageURL: string;
    state: State;
    onPlay: () => void;
    showRoastOptions: () => void;
}> = ({voice, imageURL, state, onPlay, showRoastOptions}) => {

    const statusStyle = "text-lg font-light pt-2 pb-2 pl-4 pr-4";
    let status;
    switch (state) {
        case State.PreparingRoast:
            status = <div className={statusStyle}>Preparing roast...</div>;
            break;
        case State.ReadyToPlay:
            status = <div className={statusStyle}>Ready!</div>;
            break;
        case State.ReadyToReplay:
            status =
                <button
                    onClick={showRoastOptions}
                    className={"button-outline " + statusStyle}>
                    Try another roast
                </button>
            break;
        case State.Playing:
            status = <div className={statusStyle}>Roasting 🔥</div>
            break;
    }

    return (
        <div className="fs-container mx-auto flex flex-col items-center p-8">
            <LogoView className='mb-6'/>
            <div
                className='grow w-full bg-contain bg-no-repeat bg-center flex justify-center'
                style={{backgroundImage: `url(${imageURL})`}}>
                {(state == State.ReadyToPlay || state == State.ReadyToReplay) && (
                    <PlayButton onPlay={onPlay}/>
                )}
            </div>

            <RoastOptionButton
                voice={voice}
                className='-mt-[50px] mb-6 hover:opacity-100 cursor-default'
            />

            {status}
        </div>
    );
};


// HOME PAGE


export default function Home() {
    const [state, setState] = useState<State>(State.TakePhoto);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [voice, setVoice] = useState<string | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    function onPhotoTaken(imageURL: string) {
        setImageURL(imageURL);
        setState(State.RoastOptions);
    }

    async function generate(voice: string, imageURL: string, ): Promise<string> {
        console.log("Generating...");
        const response = await fetch(`/api/generate`, {
            method: 'POST',
            body: JSON.stringify({
                voice: voice,
                imageURL: imageURL,
            })
        })

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error("Generate speech error " + response.status + ": " + errorText);
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }

    function createAudio(audioURL: string): HTMLAudioElement {
        const audio = new Audio(audioURL);
        audio.addEventListener('ended', () => {
            setState(State.ReadyToReplay);
        });
        audio.addEventListener('error', (e) => {
            console.error("Error playing audio", e);
            alert("Sorry, I can't play the audio 🤷‍");
            setState(State.ReadyToReplay);
        });
        return audio;
    }

    async function play(audio: HTMLAudioElement, state: State): Promise<void> {
        console.log("Playing...");
        try {
            await audio.play();
            setState(State.Playing);
        } catch (error) {
            if (state == State.PreparingRoast) {
                setState(State.ReadyToPlay);
            } else {
                console.error("Error playing audio", error);
                setState(State.ReadyToReplay);
            }
        }
    }

    async function roastImage(voice: string) {
        setVoice(voice);
        setState(State.PreparingRoast);
        try {
            const audioURL = await generate(voice, imageURL!);
            const audio = createAudio(audioURL);
            setAudio(audio);
            await play(audio, State.PreparingRoast);
        } catch (error) {
            console.error('Error during the roasting process:', error);
            setState(State.RoastOptions);
        }
    }

    let view;
    switch (state) {
        case State.TakePhoto:
            view = <TakePhotoView onPhotoTaken={onPhotoTaken}/>;
            break;
        case State.RoastOptions:
            view =
                <RoastOptionsView
                    imageURL={imageURL!}
                    onSelectRoast={roastImage}
                    onRetakePhoto={() => setState(State.TakePhoto)}
                />
            break;
        case State.PreparingRoast:
        case State.ReadyToPlay:
        case State.Playing:
        case State.ReadyToReplay:
            view =
                <RoastingView
                    imageURL={imageURL!}
                    voice={voice!}
                    state={state}
                    onPlay={() => play(audio!, state)}
                    showRoastOptions={() => setState(State.RoastOptions)}
                />
            break;
    }

    return (<>{view}</>)
}

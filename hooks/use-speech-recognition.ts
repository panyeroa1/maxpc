import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseSpeechRecognitionProps {
    onResult?: (transcript: string) => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
}

export function useSpeechRecognition({ onResult, onEnd, onError }: UseSpeechRecognitionProps = {}) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [permissionError, setPermissionError] = useState(false);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'en-US';

                recognitionRef.current.onstart = () => {
                    setIsListening(true);
                    setPermissionError(false);
                };

                recognitionRef.current.onresult = (event: any) => {
                    let final = '';
                    let interim = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            final += event.results[i][0].transcript;
                        } else {
                            interim += event.results[i][0].transcript;
                        }
                    }

                    if (final) {
                        setTranscript((prev) => {
                            const newTranscript = prev ? `${prev} ${final}` : final;
                            if (onResult) onResult(newTranscript);
                            return newTranscript;
                        });
                    }
                    setInterimTranscript(interim);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error);
                    if (event.error === 'not-allowed') {
                        setPermissionError(true);
                        if (onError) onError('Microphone permission denied');
                    } else {
                        if (onError) onError(`Speech recognition error: ${event.error}`);
                    }
                    setIsListening(false);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                    if (onEnd) onEnd();
                };
            }
        }
    }, [onResult, onEnd, onError]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                setTranscript('');
                setInterimTranscript('');
                recognitionRef.current.start();
            } catch (e) {
                console.error("Failed to start speech recognition", e);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    const isSupported = typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    return {
        isListening,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        toggleListening,
        isSupported,
        permissionError
    };
}

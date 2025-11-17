import { useState, useEffect, useRef } from 'react';

export function useTypingEffect(
  text: string,
  speed: number = 80,
  enabled: boolean = true
) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    // Ensure text is a valid string
    const safeText = text || '';

    if (!enabled) {
      setDisplayedText(safeText);
      setIsComplete(true);
      return;
    }

    // Reset state
    setDisplayedText('');
    setIsComplete(false);
    indexRef.current = 0;

    // Build the text character by character
    const interval = setInterval(() => {
      const currentIndex = indexRef.current;

      if (currentIndex < safeText.length) {
        const char = safeText[currentIndex];
        // Only append if character is valid
        if (char !== undefined) {
          setDisplayedText(safeText.substring(0, currentIndex + 1));
        }
        indexRef.current++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 1000 / speed);

    return () => {
      clearInterval(interval);
    };
  }, [text, speed, enabled]);

  return { displayedText, isComplete };
}

import { useTypingEffect } from '@/hooks/useTypingEffect';

interface TypingTextProps {
  text: string;
  speed?: number;
  enabled?: boolean;
  className?: string;
  onComplete?: () => void;
}

export default function TypingText({
  text,
  speed = 80,
  enabled = true,
  className = '',
  onComplete,
}: TypingTextProps) {
  const { displayedText, isComplete } = useTypingEffect(text, speed, enabled);

  if (isComplete && onComplete) {
    onComplete();
  }

  return <span className={className}>{displayedText}</span>;
}

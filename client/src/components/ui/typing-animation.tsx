import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypingAnimationProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenPhrases?: number;
  className?: string;
  initialText?: string;
  onlyAnimateAfterText?: boolean;
}

export function TypingAnimation({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenPhrases = 3000,
  className = "",
  initialText = "",
  onlyAnimateAfterText = false
}: TypingAnimationProps) {
  const [text, setText] = useState(initialText);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInInitialDelay, setIsInInitialDelay] = useState(true);

  useEffect(() => {
    // Initial delay before starting animation
    const initialTimer = setTimeout(() => {
      setIsInInitialDelay(false);
    }, delayBetweenPhrases);

    return () => clearTimeout(initialTimer);
  }, [delayBetweenPhrases]);

  useEffect(() => {
    if (isInInitialDelay) return;

    const currentPhrase = phrases[phraseIndex];
    let staticPart = "";
    let animatedPart = "";

    if (onlyAnimateAfterText) {
      const parts = currentPhrase.split(initialText);
      staticPart = initialText;
      animatedPart = parts[1] || "";
    } else {
      animatedPart = currentPhrase;
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing animation
        if (text.length < staticPart.length + animatedPart.length) {
          const nextChar = (staticPart + animatedPart).charAt(text.length);
          setText(prev => prev + nextChar);
        } else {
          // Wait before starting to delete
          setTimeout(() => {
            setIsDeleting(true);
          }, delayBetweenPhrases);
        }
      } else {
        // Delete animation, but preserve the static part
        if (text.length > staticPart.length) {
          setText(prev => prev.slice(0, -1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [
    text, 
    phrases, 
    phraseIndex, 
    isDeleting, 
    typingSpeed, 
    deletingSpeed, 
    delayBetweenPhrases, 
    isInInitialDelay,
    initialText,
    onlyAnimateAfterText
  ]);

  return (
    <AnimatePresence mode="wait">
      <motion.span 
        className={className}
        key={text}
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        {text}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="inline-block ml-1 w-1 h-6 bg-current"
        />
      </motion.span>
    </AnimatePresence>
  );
}
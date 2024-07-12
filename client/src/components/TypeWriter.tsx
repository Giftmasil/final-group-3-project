import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import ReactMarkdown from "react-markdown";

interface TypewriterProps {
  text: string;
  speed?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 10 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset the displayed text when a new text is received
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <Box>
      <ReactMarkdown>{displayedText}</ReactMarkdown>
    </Box>
  );
};

export default Typewriter;

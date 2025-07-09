// src/utils/textInterpolation.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface LinkPlaceholder {
  text: string;
  url: string;
}

interface ContentWithLinks {
  text: string;
  links?: {
    [key: string]: LinkPlaceholder;
  };
}

export function interpolateTextWithLinks(content: ContentWithLinks): React.ReactNode[]{
  if (!content.links) {
    return [content.text];
  }

  const parts: React.ReactNode[] = [];
  let currentText = content.text;

  // Regex to find placeholders like {linkName}
  const regex = /{(\w+)}/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(currentText)) !== null) {
    const placeholder = match[0]; // e.g., {aboutLink}
    const linkName = match[1]; // e.g., aboutLink

    // Add the text before the placeholder
    if (match.index > lastIndex) {
      parts.push(currentText.substring(lastIndex, match.index));
    }

    const linkData = content.links[linkName];
    if (linkData) {
      parts.push(
        <Link key={linkName} to={linkData.url} target="_blank" className='text-blue-500'>
          {linkData.text}
        </Link>
      );
    } else {
      // If link data is not found, keep the placeholder as is or handle error
      parts.push(placeholder);
    }
    lastIndex = regex.lastIndex;
  }

  // Add any remaining text after the last placeholder
  if (lastIndex < currentText.length) {
    parts.push(currentText.substring(lastIndex));
  }

  return parts;
};
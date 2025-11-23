import React from 'react';

interface Props {
  className?: string;
  title?: string;
}

// A simple stroke-only WhatsApp-like icon designed to match lucide's line weight.
// Uses stroke=currentColor so it inherits button coloring and hover styles.
export default function WhatsAppIcon({ className, title = 'WhatsApp' }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? 'false' : 'true'}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      {/* Chat bubble outline */}
      <path d="M21 12.1c0 4.9-4 8.9-8.9 8.9-1.5 0-2.9-.4-4.1-1.1L3 21l1.1-4.9A8.9 8.9 0 0 1 2.1 12C2.1 6 7 1.1 13 1.1S23 6 23 12c0 .4 0 .7-0.1 1.1z" />
      {/* Handset inside bubble (stylized) */}
      <path d="M16.2 14.6c-.4-.2-1-.4-1.6-.2-.4.1-.8.4-1 1-.1.4-.3.8-.6 1-.9.6-2.2 0-4.2-1.8-2-1.8-2.9-3.9-2.3-4.8.2-.3.6-.6 1-.9.4-.3.8-.4 1.2-.2.3.1.6.3.9.5.3.2.6.2.9.1.3-.1.6-.3.9-.5.3-.2.6-.2.9-.1.7.2 1.4.6 2 1.2.6.6 1.1 1.3 1.3 2 .1.3 0 .6-.2.9-.2.3-.4.6-.6.8z" />
    </svg>
  );
}

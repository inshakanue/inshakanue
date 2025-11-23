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
      fill="currentColor"
      className={className}
      aria-hidden={title ? 'false' : 'true'}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      {/* Official WhatsApp mark (single-path, monochrome) */}
      <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 .008 5.374.008 12c0 2.116.553 4.09 1.606 5.86L0 24l6.435-1.67A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12 0-3.198-1.25-6.21-3.48-8.52zM12 21.5c-1.77 0-3.427-.47-4.86-1.287l-.348-.198-3.82.99.995-3.718-.21-.375A8.25 8.25 0 013.75 12.0 8.25 8.25 0 1112 20.5zM17.02 14.24c-.27-.135-1.593-.786-1.84-.875-.246-.09-.426-.135-.605.135-.18.27-.695.875-.85 1.055-.155.18-.31.202-.575.068-.265-.135-1.12-.41-2.13-1.312-.79-.704-1.32-1.574-1.475-1.85-.155-.27-.017-.415.12-.55.123-.123.27-.31.405-.465.135-.155.18-.27.27-.45.09-.18 0-.337-.036-.472-.036-.135-.605-1.456-.83-1.99-.22-.535-.445-.46-.605-.47l-.515-.009c-.17 0-.445.064-.68.31-.235.245-.9.88-.9 2.145 0 1.264.925 2.485 1.055 2.656.135.17 1.82 2.78 4.41 3.9 3.085 1.33 3.85 1.07 4.54.995.69-.08 2.225-.905 2.54-1.776.315-.87.315-1.62.22-1.775-.09-.155-.315-.245-.585-.38z" />
    </svg>
  );
}

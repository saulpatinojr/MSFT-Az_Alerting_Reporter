import React, { useEffect, useState } from 'react';

interface ImageLightboxProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function ImageLightbox({ src, alt = '', className = '' }: ImageLightboxProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('keydown', onKey);
      // prevent body scroll
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = prev;
      };
    }
    return () => {};
  }, [open]);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className} cursor-zoom-in`}
        onClick={() => setOpen(true)}
      />

      {open && (
        <div
          role="dialog"
          aria-label={alt || 'Image preview'}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <div
            className="max-h-[90vh] max-w-[90vw] p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="w-full h-auto rounded shadow-lg transform transition-transform duration-200 scale-100 cursor-zoom-out"
            />
          </div>
        </div>
      )}
    </>
  );
}

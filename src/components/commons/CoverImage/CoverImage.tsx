"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type CoverImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  fallbackSrc: string;
};

export function CoverImage({ src, fallbackSrc, alt, ...props }: CoverImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const currentSrc = failedSrc === src ? fallbackSrc : src;

  return (
    <Image
      {...props}
      alt={alt}
      src={currentSrc}
      onError={() => {
        if (currentSrc !== fallbackSrc) setFailedSrc(src);
      }}
    />
  );
}

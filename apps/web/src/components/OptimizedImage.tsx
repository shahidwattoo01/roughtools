'use client'

// ============================================================
// ROUGHTOOLS â€” OptimizedImage Component (Phase 3.6)
// "Add next/image for all images"
// "Minimize layout shift (set dimensions on all media)"
// Prevents CLS by always requiring width/height or fill mode
// ============================================================

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  containerClassName?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  quality?: number
  sizes?: string
  onLoad?: () => void
  /** Aspect ratio in format "16/9", "4/3", "1/1" etc. Used when fill=true */
  aspectRatio?: string
  /** Show shimmer skeleton while loading */
  skeleton?: boolean
  /** Blur placeholder data URL */
  blurDataURL?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  containerClassName,
  objectFit = 'cover',
  quality = 85,
  sizes,
  onLoad,
  aspectRatio,
  skeleton = true,
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(true)
  }

  // Fill mode â€” needs a positioned container with aspect ratio
  if (fill) {
    return (
      <div
        className={cn(
          'relative overflow-hidden',
          aspectRatio && `aspect-[${aspectRatio}]`,
          containerClassName
        )}
        style={aspectRatio ? undefined : { position: 'relative' }}
      >
        {/* Shimmer skeleton while loading */}
        {skeleton && !isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400%_100%]" />
        )}

        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
            Image unavailable
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className={cn(
              'transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
              objectFit === 'contain' && 'object-contain',
              objectFit === 'cover' && 'object-cover',
              objectFit === 'fill' && 'object-fill',
              className
            )}
            quality={quality}
            sizes={sizes || '(max-width: 768px) 100vw, 50vw'}
            onLoad={handleLoad}
            onError={handleError}
            placeholder={blurDataURL ? 'blur' : 'empty'}
            blurDataURL={blurDataURL}
          />
        )}
      </div>
    )
  }

  // Fixed dimensions mode â€” always set width/height to prevent CLS
  if (!width || !height) {
    console.warn(
      `[OptimizedImage] "${alt}" â€” set width and height or use fill=true to prevent CLS`
    )
  }

  return (
    <div
      className={cn('relative overflow-hidden inline-block', containerClassName)}
      style={width && height ? { width, height } : undefined}
    >
      {skeleton && !isLoaded && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"
          style={width && height ? { width, height } : undefined}
        />
      )}

      {hasError ? (
        <div
          className="flex items-center justify-center bg-gray-100 text-gray-400 text-xs"
          style={{ width: width || 100, height: height || 100 }}
        >
          Image unavailable
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width || 100}
          height={height || 100}
          priority={priority}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          quality={quality}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          // loading attribute â€” 'lazy' for below-fold, 'eager' when priority=true
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  )
}

// â”€â”€â”€ TOOL ICON â€” Fixed 48x48 icon for tool cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface ToolIconProps {
  emoji: string
  size?: number
  className?: string
}

export function ToolIcon({ emoji, size = 48, className }: ToolIconProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100 flex-shrink-0',
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span style={{ fontSize: size * 0.5 }}>{emoji}</span>
    </div>
  )
}
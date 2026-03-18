import React, { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface LogoItem {
  src: string;
  alt: string;
  width: number;
  height: number;
  name?: string;
  href?: string;
}

interface Props {
  logos: LogoItem[];
}

export const LogoCarousel = ({ logos }: Props) => {
  // Performance consideration:
  // Using triplication to avoid Embla's visible wrap animation
  // Trade-off: 3x DOM nodes vs smooth visual experience
  // Suitable for simple logo content, reconsider for complex slides
  const duplicatedLogos = [...logos, ...logos, ...logos];

  // Check if we're in browser environment for window access
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const [isHovered, setIsHovered] = useState(false);
  const resumeTimeoutRef = useRef<number | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: false,
      watchDrag: true, // ✅ Allow dragging for accessibility
      containScroll: "trimSnaps",
      dragFree: false,
      skipSnaps: false,
    },
    [
      Autoplay({
        delay: 2000,
        stopOnInteraction: true, // ✅ Stop on drag for accessibility
        stopOnMouseEnter: true,
        playOnInit: !prefersReducedMotion,
      }),
    ],
  );

  const scheduleResume = () => {
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      if (emblaApi && emblaApi.plugins()?.autoplay) {
        emblaApi.plugins().autoplay.play();
      }
    }, 1);
  };

  // Fix memory leaks - cleanup carousel instance
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
      if (emblaApi) {
        emblaApi.destroy();
      }
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onAutoplayStop = () => {
      if (isHovered) {
        scheduleResume();
      }
    };

    const onSettle = () => {
      scheduleResume();
    };

    emblaApi.on("autoplay:stop", onAutoplayStop);
    emblaApi.on("settle", onSettle);

    return () => {
      emblaApi.off("autoplay:stop", onAutoplayStop);
      emblaApi.off("settle", onSettle);
    };
  }, [emblaApi, isHovered]);

  if (!logos || logos.length === 0) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          Warning: Logo carousel - No logos data available
        </div>
      );
    }
    return null;
  }

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (
      emblaApi &&
      emblaApi.plugins()?.autoplay &&
      !emblaApi.plugins().autoplay.isPlaying()
    ) {
      scheduleResume();
    }
  };

  return (
    <div
      className="overflow-hidden"
      ref={emblaRef}
      role="region"
      aria-label={`Client logos carousel, showing ${logos.length} logos for infinite scroll effect`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex touch-pan-y gap-2.5" aria-roledescription="carousel">
        {duplicatedLogos.map((logo, index) => {
          const isOriginal = index < logos.length;

          const slideContent = (
            <div className="w-full h-full flex items-center justify-center pointer-events-none">
              <img
                src={logo.src}
                alt={isOriginal ? logo.alt || logo.name || "Client logo" : ""}
                width={logo.width}
                height={logo.height}
                loading={isOriginal ? "eager" : "lazy"}
                decoding="async"
                className="max-h-20 w-auto object-contain py-4"
                aria-hidden={!isOriginal}
              />
            </div>
          );

          // For duplicated slides, don't render focusable links
          // This fixes the "aria-hidden elements contain focusable descendants" issue
          if (!isOriginal) {
            return (
              <div
                key={`${logo.src}-${index}`}
                className="flex-[0_0_calc((100%-20px)/3)] md:flex-[0_0_calc((100%-40px)/5)] min-w-0 bg-brand-surface rounded-[60px] h-50 flex items-center justify-center hover:grayscale-0 transition-all duration-500 grayscale"
                aria-hidden="true"
                tabIndex={-1}
              >
                {slideContent}
              </div>
            );
          }

          return (
            <div
              key={`${logo.src}-${index}`}
              className="flex-[0_0_calc((100%-20px)/3)] md:flex-[0_0_calc((100%-40px)/5)] min-w-0 bg-brand-surface rounded-[60px] h-50 flex items-center justify-center hover:grayscale-0 transition-all duration-500 grayscale"
            >
              {logo.href ? (
                <a
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full flex items-center justify-center"
                  aria-label={`Visit ${logo.name || "client"} website`}
                >
                  {slideContent}
                </a>
              ) : (
                slideContent
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

LogoCarousel.displayName = "LogoCarousel";

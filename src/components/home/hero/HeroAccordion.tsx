import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { useMediaQuery } from "@/hooks/use-media-query";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface Line {
  text: string;
  color: "white" | "dark";
}

interface Supplementary {
  text: string;
  position: "bottom-left" | "bottom-right";
}

interface Card {
  lines: Line[];
  alignment: "left" | "right";
  supplementary: Supplementary;
  image?: {
    src: string;
  };
  theme: "green" | "white" | "grey";
}

const getImagePositionFromAlignment = (alignment: "left" | "right") => {
  // Text on left = image on right, text on right = image on left
  return alignment === "left" ? "right" : "left";
};

interface HeroProps {
  cards: Card[];
  defaultActiveIndex?: number;
}

const LAYOUT_CONFIG = [
  [83.88, 7.5, 4.44, 2.5, 1.66],
  [19.44, 63.33, 10.27, 4.44, 2.5],
  [4.44, 13.88, 64.75, 13.88, 4.44],
  [2.5, 4.44, 10.27, 63.33, 19.44],
  [1.66, 2.5, 4.44, 7.5, 83.88],
];

const getColorClass = (color: string) => {
  return color === "white" ? "text-white" : "text-brand-dark";
};

const SupplementaryText = ({
  supplementary,
  isActive,
}: {
  supplementary: Supplementary;
  isActive: boolean;
}) => {
  const { text, position } = supplementary;

  const positionClasses = {
    "bottom-left": "left-6 bottom-6",
    "bottom-right": "right-6 bottom-6",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "absolute z-20 text-base font-brand-heading text-white",
        positionClasses[position],
      )}
    >
      {text}
    </motion.div>
  );
};

const HeroLines = ({
  lines,
  alignment,
  isMobile = false,
}: {
  lines: Line[];
  alignment: "left" | "right";
  isMobile?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-0",
        alignment === "right" ? "items-end" : "items-start",
      )}
    >
      {lines.map((line, index) => (
        <div
          key={index}
          className={cn(
            "font-brand-heading leading-[0.95]",
            isMobile ? "whitespace-normal" : "whitespace-nowrap",
            getColorClass(line.color),
          )}
          style={{
            fontSize: isMobile
              ? "clamp(36px, calc(36px + 64 * ((100vw - 320px) / 703)), 100px)" // Mobile: 36px-100px across 320px-1023px
              : "clamp(80px, calc(80px + 80 * (100vw - 1024px) / 896), 120px)", // Desktop
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
};

export const HeroAccordion = ({ cards, defaultActiveIndex = 0 }: HeroProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [isMounted, setIsMounted] = useState(false);
  const currentLayout =
    LAYOUT_CONFIG[activeIndex] || LAYOUT_CONFIG[defaultActiveIndex];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      containScroll: "trimSnaps",
      loop: true,
      skipSnaps: false,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  return (
    <>
      {/* Mobile Carousel */}
      <div className="block lg:hidden w-full h-[500px]">
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex gap-0 h-full mx-4">
            {cards.map((card, index) => (
              <motion.div
                key={`mobile-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  opacity: { duration: 0.6, delay: index * 0.15 },
                  y: {
                    type: "spring",
                    stiffness: 50,
                    damping: 12,
                    mass: 0.8,
                    delay: index * 0.15,
                  },
                }}
                className={cn(
                  "flex-[0_0_100%] min-w-0 mr-4 relative rounded-[40px] overflow-hidden h-full",
                  card.theme === "green" ? "bg-brand-green" : "bg-[#F5F5F5]",
                )}
                style={{
                  backgroundImage: card.image
                    ? `url(${card.image.src})`
                    : "none",
                  backgroundSize: "auto 100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                data-sb-field-path={`hero.cards.${index}`}
              >
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
                  <div className="relative z-10">
                    <HeroLines
                      lines={card.lines}
                      alignment={card.alignment}
                      isMobile={true}
                    />
                  </div>
                  <SupplementaryText
                    supplementary={card.supplementary}
                    isActive={true}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          {cards.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => scrollTo(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === selectedIndex ? "bg-brand-green w-8" : "bg-gray-300",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Accordion */}
      <div className="hidden lg:flex w-full flex-col gap-6">
        <div className="flex w-full flex-col lg:flex-row gap-2.5 xl:gap-5 select-none">
          {cards.map((card, index) => {
            const isActive = index === activeIndex;
            // Always use layout percentages - mobile/desktop switching is handled by CSS display
            const targetWidth = `${currentLayout[index]}%`;

            // Start at 5% width and expand to target with stagger (only on initial load)
            const initialWidth = "5%";
            const staggerDelay = isMounted ? 0 : index * 0.1;

            return (
              <motion.div
                key={index}
                layout={isDesktop && isMounted}
                initial={{
                  opacity: 0,
                  y: 20,
                  width: initialWidth,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  width: targetWidth,
                  boxShadow:
                    isActive && isDesktop
                      ? "0 15px 30px -5px rgba(0, 0, 0, 0.15)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  opacity: { duration: 0.6, delay: staggerDelay },
                  y: {
                    type: "spring",
                    stiffness: 50,
                    damping: 12,
                    mass: 0.8,
                    delay: staggerDelay,
                  },
                  width: {
                    type: "spring",
                    stiffness: 50,
                    damping: 12,
                    mass: 0.8,
                    delay: staggerDelay,
                  },
                  boxShadow: { duration: 0.3 },
                }}
                onClick={() => setActiveIndex(index)}
                whileHover={{
                  boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.15)",
                  filter: "brightness(0.95)",
                }}
                style={{
                  backgroundImage: card.image
                    ? `url(${card.image.src})`
                    : "none",
                  backgroundSize: "auto 100%",
                  backgroundPosition: getImagePositionFromAlignment(
                    card.alignment,
                  ),
                  backgroundRepeat: "no-repeat",
                }}
                className={cn(
                  "relative rounded-[60px] overflow-hidden cursor-pointer",
                  "w-full lg:w-auto",
                  card.theme === "green" ? "bg-brand-green" : "bg-[#F5F5F5]",
                  isActive && isDesktop ? "z-10" : "",
                )}
                data-sb-field-path={`hero.cards.${index}`}
              >
                {/* Content Container */}
                <div
                  className={cn(
                    "relative p-5 flex flex-col justify-between min-h-[400px]",
                    isDesktop && !isActive ? "opacity-100" : "opacity-100",
                  )}
                >
                  {/* Main Text - Constrained for edge cards when active */}
                  <div
                    className={cn(
                      "relative z-10 pointer-events-none",
                      isActive &&
                        index === 0 &&
                        "w-full max-w-[1100px] ml-auto",
                      isActive &&
                        index === 4 &&
                        "w-full max-w-[1100px] mr-auto",
                    )}
                  >
                    <HeroLines lines={card.lines} alignment={card.alignment} />
                  </div>

                  {/* Supplementary Text */}
                  <SupplementaryText
                    supplementary={card.supplementary}
                    isActive={isActive}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2">
          {cards.map((_, index) => (
            <motion.button
              key={`desktop-dot-${index}`}
              onClick={() => setActiveIndex(index)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className={cn(
                "h-2 rounded-full transition-all",
                index === activeIndex
                  ? "bg-brand-green w-8"
                  : "bg-gray-300 w-2",
              )}
              aria-label={`Activate card ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

HeroAccordion.displayName = "HeroAccordion";

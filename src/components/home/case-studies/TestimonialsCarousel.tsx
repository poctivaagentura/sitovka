import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface TestimonialItem {
  name?: string;
  role?: string;
  content: string;
  avatar?: {
    src: string;
    width?: number;
    height?: number;
  };
  logo?: {
    src: string;
    width?: number;
    height?: number;
  };
}

interface Props {
  items: TestimonialItem[];
  onNavigationChange?: (needsNavigation: boolean) => void;
}

export interface TestimonialsCarouselRef {
  reInit: () => void;
}

// Calculate visible slides based on viewport width
const getVisibleSlides = (width: number): number => {
  if (width >= 1280) return 4; // xl: 4 slides
  if (width >= 1024) return 3; // lg: 3 slides
  if (width >= 768) return 2; // md: 2 slides
  return 1; // mobile: 1 slide
};

// Clone items to enable proper looping - duplicates the array
const cloneItems = <T,>(items: T[]): T[] => {
  if (items.length === 0) return items;
  return [...items, ...items];
};

const TestimonialsCarousel = forwardRef<TestimonialsCarouselRef, Props>(
  ({ items, onNavigationChange }, ref) => {
    const [viewportWidth, setViewportWidth] = useState(
      typeof window !== "undefined" ? window.innerWidth : 1200,
    );

    const originalItemCount = items.length;
    const shouldEnableCarousel = originalItemCount > 1;

    // Clone items if we need navigation to enable proper looping
    const clonedItems = useMemo(() => {
      if (!shouldEnableCarousel || originalItemCount <= 1) return items;
      return cloneItems(items);
    }, [items, shouldEnableCarousel, originalItemCount]);

    const needsNavigation = shouldEnableCarousel && originalItemCount > 1;

    // Notify parent of navigation state change
    useEffect(() => {
      onNavigationChange?.(needsNavigation);
    }, [needsNavigation, onNavigationChange]);

    // Track viewport resize
    useEffect(() => {
      const handleResize = () => {
        setViewportWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [emblaRef, emblaApi] = useEmblaCarousel(
      needsNavigation
        ? {
            align: "start",
            loop: true,
            dragFree: false,
            skipSnaps: false,
            dragThreshold: 20,
            duration: 30,
            containScroll: "trimSnaps",
            slidesToScroll: 1,
          }
        : undefined, // Disable carousel when not needed
    );

    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
      if (!emblaApi) return;
      // Map the selected index back to the original item index for dots
      const realIndex = emblaApi.selectedScrollSnap() % originalItemCount;
      setSelectedIndex(realIndex);
    }, [emblaApi, originalItemCount]);

    useEffect(() => {
      if (!emblaApi || !needsNavigation) return;
      onSelect();
      emblaApi.on("select", onSelect);
      return () => {
        emblaApi.off("select", onSelect);
      };
    }, [emblaApi, onSelect, needsNavigation]);

    const scrollTo = useCallback(
      (index: number) => {
        if (!emblaApi) return;
        // Find the nearest instance of this item in the cloned array
        const currentSnap = emblaApi.selectedScrollSnap();
        const currentRealIndex = currentSnap % originalItemCount;

        // Calculate the shortest distance to the target index
        let targetSnap: number;
        if (index >= currentRealIndex) {
          targetSnap = currentSnap + (index - currentRealIndex);
        } else {
          targetSnap =
            currentSnap + (originalItemCount - currentRealIndex + index);
        }

        emblaApi.scrollTo(targetSnap);
      },
      [emblaApi, originalItemCount],
    );

    useImperativeHandle(
      ref,
      () => ({
        reInit: () => {
          if (emblaApi && needsNavigation) {
            emblaApi.reInit();
            onSelect();
          }
        },
      }),
      [emblaApi, onSelect, needsNavigation],
    );

    // Memoize the slide class to avoid recalculation
    const slideClass = useMemo(
      () =>
        "flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_calc(100%/3)] xl:flex-[0_0_25%] min-w-0 px-2.5",
      [],
    );

    return (
      <>
        <div className="flex items-center w-full">
          {needsNavigation && (
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="hidden md:flex p-3 rounded-full hover:bg-white/10 transition-colors min-w-[48px] min-h-[48px] items-center justify-center"
              aria-label="Předchozí reference"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
          )}
          {!needsNavigation && <div className="w-0 md:w-auto" />}
          <div className="embla flex-1 min-w-0 w-full">
            <div
              className={cn(
                "w-full",
                needsNavigation ? "overflow-hidden" : "overflow-visible",
              )}
              ref={emblaRef}
            >
              <div
                className={cn(
                  "w-full",
                  needsNavigation
                    ? "flex"
                    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                )}
              >
                {(needsNavigation ? clonedItems : items).map((item, idx) => {
                  const isCloned = needsNavigation && idx >= originalItemCount;

                  return (
                    <div
                      key={`${item.name || idx}-${idx}`}
                      className={cn(
                        needsNavigation ? slideClass : "px-2.5",
                        "min-w-0",
                      )}
                      aria-hidden={isCloned ? "true" : undefined}
                      tabIndex={isCloned ? -1 : undefined}
                    >
                      <div className="flex flex-col text-sm">
                        <div className="flex gap-5 mb-[30px] items-center flex-wrap">
                          {item.avatar && (
                            <img
                              src={item.avatar.src}
                              alt={isCloned ? "" : "Avatar"}
                              width={item.avatar.width || 64}
                              height={item.avatar.height || 64}
                              loading={isCloned ? "lazy" : "eager"}
                              decoding="async"
                              className="w-16 h-16 rounded-full object-cover"
                              aria-hidden={isCloned ? "true" : undefined}
                            />
                          )}
                          {item.logo && (
                            <img
                              src={item.logo.src}
                              alt={isCloned ? "" : "Client Logo"}
                              width={item.logo.width || 96}
                              height={item.logo.height || 40}
                              loading={isCloned ? "lazy" : "eager"}
                              decoding="async"
                              className="w-24 h-10 object-contain"
                              aria-hidden={isCloned ? "true" : undefined}
                            />
                          )}
                        </div>
                        <div className="mb-[30px]">
                          <div
                            className="font-book italic text-brand-dark"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          />
                        </div>
                        {item.name && (
                          <div className="font-bold text-brand-dark">
                            {item.name}
                          </div>
                        )}
                        {item.role && (
                          <div className="font-book text-brand-dark">
                            {item.role}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {items.length === 0 && (
                  <div className="flex-[0_0_100%] min-w-0">
                    <div className="p-6 bg-white/10 rounded-3xl">
                      <p className="font-book italic text-brand-dark">
                        Žádné reference k dispozici.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {needsNavigation && (
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="hidden md:flex p-3 rounded-full hover:bg-white/10 transition-colors min-w-[48px] min-h-[48px] items-center justify-center"
              aria-label="Další reference"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}
          {!needsNavigation && <div className="w-0 md:w-auto" />}
        </div>

        {needsNavigation && originalItemCount >= 2 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {items.map((_, index) => (
              <button
                key={`testimonial-dot-${index}`}
                onClick={() => scrollTo(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === selectedIndex ? "bg-brand-dark w-8" : "bg-white/50",
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </>
    );
  },
);

TestimonialsCarousel.displayName = "TestimonialsCarousel";

export default TestimonialsCarousel;

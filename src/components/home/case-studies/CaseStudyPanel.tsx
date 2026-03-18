import React from "react";
import { Button } from "@/components/ui/Button";
import { mdToHtml } from "@/utils/markdown";
import { cn } from "@/utils/cn";

export interface CaseStudyMetric {
  label: string;
  value: string;
  showCheckmark?: boolean;
}

export interface CaseStudyTestimonial {
  quote: string;
  avatar?: {
    src: string;
    width?: number;
    height?: number;
    format?: string;
  };
  clientLogo?: {
    src: string;
    width?: number;
    height?: number;
    format?: string;
  };
  name: string;
  role: string;
}

export interface CaseStudy {
  tabLabel: string;
  heading: string;
  description?: string;
  metrics?: CaseStudyMetric[];
  testimonial?: CaseStudyTestimonial;
}

interface Props {
  study: CaseStudy;
  className?: string;
}

export const CaseStudyPanel = ({ study, className }: Props) => {
  const descriptionHtml = study.description ? mdToHtml(study.description) : "";
  const quoteHtml = study.testimonial?.quote
    ? mdToHtml(study.testimonial.quote)
    : "";

  return (
    <div className={cn("flex flex-col lg:flex-row gap-8 lg:gap-12", className)}>
      {/* Left side - Infographic (3/4) */}
      <div className="flex-1 lg:w-3/4">
        {/* Description with inline heading */}
        {descriptionHtml && (
          <div className="mb-8">
            <div
              className="text-sm font-book text-brand-dark leading-relaxed [&>p:first-child>strong]:font-brand-heading [&>p:first-child>strong]:text-brand-dark [&>p:first-child>strong]:block"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          </div>
        )}

        {/* Metrics Grid */}
        {study.metrics && study.metrics.length > 0 && (
          <div className="relative">
            {/* Grid container with gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              {study.metrics.map((metric, index) => (
                <div key={index} className="relative">
                  {/* Metric content */}
                  <div className="space-y-2">
                    <p className="text-sm font-book text-brand-dark leading-snug">
                      {metric.label}
                    </p>
                    <p className="text-4xl sm:text-5xl md:text-6xl font-brand-heading text-brand-dark text-center">
                      {metric.value}
                      {metric.showCheckmark !== false && (
                        <span className="text-white">✓</span>
                      )}
                    </p>
                  </div>

                  {/* Horizontal divider under each card in top row */}
                  {index < 2 && (
                    <div className="hidden md:block absolute -bottom-4 left-0 right-0 h-px bg-brand-dark" />
                  )}

                  {/* Vertical divider for left column cards (top and bottom) */}
                  {index % 2 === 0 &&
                    study.metrics &&
                    study.metrics.length > index + 1 && (
                      <div className="hidden md:block absolute top-0 -right-4 w-px h-full bg-brand-dark" />
                    )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right side - Testimonial (1/4) */}
      {study.testimonial && (
        <div className="lg:w-1/4 flex flex-col">
          {/* Avatar and Logo */}
          <div className="flex items-center gap-4 mb-6">
            {study.testimonial.avatar && (
              <img
                src={study.testimonial.avatar.src}
                alt={study.testimonial.name}
                width={study.testimonial.avatar.width || 64}
                height={study.testimonial.avatar.height || 64}
                loading="lazy"
                decoding="async"
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            {study.testimonial.clientLogo && (
              <img
                src={study.testimonial.clientLogo.src}
                alt="Client logo"
                width={study.testimonial.clientLogo.width || 120}
                height={study.testimonial.clientLogo.height || 40}
                loading="lazy"
                decoding="async"
                className="h-10 w-auto object-contain"
              />
            )}
          </div>

          {/* Quote */}
          {quoteHtml && (
            <blockquote className="mb-4">
              <div
                className="text-sm font-book text-brand-dark leading-relaxed italic"
                dangerouslySetInnerHTML={{ __html: `${quoteHtml}` }}
              />
            </blockquote>
          )}

          {/* Attribution */}
          <div className="mb-6">
            <p className="text-sm font-bold text-brand-dark">
              {study.testimonial.name}
            </p>
            <p className="text-sm font-book text-brand-dark">
              {study.testimonial.role}
            </p>
          </div>

          {/* CTA Button */}
          <div className="mt-auto flex justify-center lg:justify-start">
            <Button
              href="#kontakty"
              variant="dark"
              className="w-full md:w-auto text-center md:text-left px-6 py-4 h-auto"
            >
              <span className="block">
                <span className="text-xl sm:text-2xl md:text-[27px] leading-tight">
                  Vyzkoušejte,
                </span>
                <br />
                <span className="text-sm md:text-base">
                  co Síťovka přinese vám
                </span>
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

CaseStudyPanel.displayName = "CaseStudyPanel";

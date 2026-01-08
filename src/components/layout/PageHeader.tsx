import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'centered';
  backgroundImage?: string;
}

export default function PageHeader({
  title,
  description,
  children,
  className,
  variant = 'default',
  backgroundImage,
}: PageHeaderProps) {
  return (
    <section className={cn("bg-primary text-primary-foreground relative overflow-hidden", className)}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Optional Background Image Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src={backgroundImage} 
            alt="Header Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/50 mix-blend-multiply" />
        </div>
      )}

      <div className={cn(
        "container-custom px-4 relative z-10",
        variant === 'compact' ? "py-8 md:py-12" : "py-12 md:py-20",
        variant === 'centered' ? "text-center" : "text-left"
      )}>
        <div className={cn(
          "max-w-3xl",
          variant === 'centered' && "mx-auto"
        )}>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
            {title}
          </h1>
          
          {description && (
            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-6 max-w-2xl">
              {description}
            </p>
          )}

          {children && (
            <div className={cn(
              "flex flex-wrap gap-4 mt-6",
              variant === 'centered' && "justify-center"
            )}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

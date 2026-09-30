import React from 'react';
import { OfficialAFLIALogo } from './OfficialAFLIALogo';

interface OfficialLogoProps {
  layout?: 'horizontal' | 'stacked' | 'mark-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'color' | 'white' | 'on-dark';
  showSubtitle?: boolean;
  className?: string;
  showBackgroundCard?: boolean;
}

export const FalconAFMark: React.FC<{
  className?: string;
  size?: number | string;
  variant?: 'color' | 'white' | 'on-dark';
}> = ({ className = 'w-10 h-10', variant = 'color' }) => {
  return (
    <OfficialAFLIALogo
      mode="mark-only"
      variant={variant === 'white' || variant === 'on-dark' ? 'white' : 'color'}
      className={className}
    />
  );
};

export const OfficialLogo: React.FC<OfficialLogoProps> = ({
  layout = 'horizontal',
  size = 'md',
  variant = 'color',
  showSubtitle = true,
  className = '',
  showBackgroundCard = false,
}) => {
  const isWhite = variant === 'white' || variant === 'on-dark';

  if (layout === 'stacked') {
    const stackedWidths = {
      sm: 'max-w-[200px]',
      md: 'max-w-[280px]',
      lg: 'max-w-[360px]',
      xl: 'max-w-[480px]',
    };

    return (
      <div className={`flex flex-col items-center justify-center shrink-0 ${className}`}>
        <OfficialAFLIALogo
          mode="full"
          variant={isWhite ? 'white' : 'color'}
          className={`w-full ${stackedWidths[size]} h-auto aspect-[1000/650] object-contain shrink-0 drop-shadow-xs`}
          showBackgroundCard={showBackgroundCard}
        />
      </div>
    );
  }

  if (layout === 'mark-only') {
    const markSizes = {
      sm: 'w-7 h-7',
      md: 'w-10 h-10',
      lg: 'w-14 h-14',
      xl: 'w-20 h-20',
    };

    return (
      <OfficialAFLIALogo
        mode="mark-only"
        variant={isWhite ? 'white' : 'color'}
        className={`${markSizes[size]} aspect-square shrink-0 object-contain ${className}`}
      />
    );
  }

  const horizSizes = {
    sm: 'h-8 sm:h-9 w-auto max-w-[220px]',
    md: 'h-10 sm:h-12 w-auto max-w-[300px]',
    lg: 'h-14 sm:h-16 w-auto max-w-[380px]',
    xl: 'h-20 sm:h-24 w-auto max-w-[480px]',
  };

  return (
    <OfficialAFLIALogo
      mode="horizontal"
      variant={isWhite ? 'white' : 'color'}
      className={`${horizSizes[size]} aspect-[540/100] shrink-0 object-contain ${className}`}
    />
  );
};

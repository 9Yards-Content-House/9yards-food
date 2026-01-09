import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical } from 'lucide-react';

interface MobilePageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightAction?: ReactNode;
  rightActionIcon?: ReactNode;
  onRightActionClick?: () => void;
  transparent?: boolean;
  sticky?: boolean;
  className?: string;
}

/**
 * MobilePageHeader - App-style header for mobile pages
 * 
 * Features:
 * - Back button (optional)
 * - Centered or left-aligned title
 * - Optional subtitle
 * - Right action button
 * - Transparent or solid background
 * - Sticky positioning
 * 
 * Only visible on mobile/tablet (hidden on lg+ screens)
 */
export default function MobilePageHeader({
  title,
  subtitle,
  showBackButton = true,
  onBackClick,
  rightAction,
  rightActionIcon,
  onRightActionClick,
  transparent = false,
  sticky = true,
  className = '',
}: MobilePageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className={`lg:hidden ${sticky ? 'sticky top-16 z-40' : ''} ${
        transparent 
          ? 'bg-transparent' 
          : 'bg-background/95 backdrop-blur-xl border-b border-border/50'
      } ${className}`}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left - Back Button */}
        <div className="w-12 flex justify-start">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
        </div>

        {/* Center - Title */}
        <div className="flex-1 text-center min-w-0 px-2">
          <h1 className="text-base font-bold text-foreground truncate leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right - Action */}
        <div className="w-12 flex justify-end">
          {rightAction ? (
            rightAction
          ) : rightActionIcon && onRightActionClick ? (
            <button
              onClick={onRightActionClick}
              className="p-2 -mr-2 rounded-full hover:bg-muted/50 transition-colors"
              aria-label="More options"
            >
              {rightActionIcon}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

/**
 * MobilePageTitle - Large page title for app-style pages
 * 
 * Use below MobilePageHeader for a native app feel
 * Only visible on mobile/tablet
 */
export function MobilePageTitle({ 
  title, 
  subtitle,
  className = '' 
}: { 
  title: string; 
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`lg:hidden px-4 pt-4 pb-2 ${className}`}>
      <h1 className="text-2xl font-bold text-foreground leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}

import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { haptics } from '@/lib/utils/ui';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

/**
 * ConfirmModal - Adaptive confirmation dialog
 * 
 * - Desktop/Tablet: Centered modal dialog
 * - Mobile: Bottom sheet with swipe-to-dismiss
 * 
 * Provides native app-like UX on mobile devices
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = 'danger'
}: ConfirmModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      haptics.light();
      onClose();
    }
  };

  const handleConfirm = () => {
    haptics.medium();
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    haptics.light();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Mobile: Bottom Sheet */}
          {isMobile ? (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              drag="y"
              dragDirectionLock
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={handleDragEnd}
              className="fixed inset-x-0 bottom-0 z-[101] touch-none"
            >
              <div className="bg-white rounded-t-[1.5rem] shadow-2xl overflow-hidden">
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>
                
                {/* Content */}
                <div className="px-6 pb-8 pt-2 text-center safe-area-bottom">
                  <h3 className="text-xl font-extrabold text-[#212282] mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm font-medium mb-6 leading-relaxed">
                    {description}
                  </p>

                  <div className="flex flex-col gap-3">
                    {/* Primary Action (Cancel - Keep) */}
                    <button
                      onClick={handleCancel}
                      className="w-full h-14 rounded-xl bg-[#E6411C] text-white font-bold active:scale-[0.98] transition-all shadow-sm"
                    >
                      {cancelText}
                    </button>

                    {/* Destructive Action */}
                    <button
                      onClick={handleConfirm}
                      className="w-full py-3 text-sm font-bold text-red-500 active:text-red-700 transition-colors uppercase tracking-wider"
                    >
                      {confirmText}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Desktop/Tablet: Centered Modal */
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full max-w-[320px] xs:max-w-sm pointer-events-auto"
              >
                <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden p-6 md:p-8 w-full mx-auto text-center animate-in fade-in zoom-in-95 duration-200">
                  <h3 className="text-xl font-extrabold text-[#212282] mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed max-w-[260px] mx-auto">
                    {description}
                  </p>

                  <div className="flex flex-col gap-3">
                    {/* Primary Action (Cancel - Keep) */}
                    <button
                      onClick={handleCancel}
                      className="w-full h-12 rounded-xl bg-[#E6411C] text-white font-bold hover:bg-[#d13a18] transition-colors shadow-sm"
                    >
                      {cancelText}
                    </button>

                    {/* Destructive Action */}
                    <button
                      onClick={handleConfirm}
                      className="w-full py-2 text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-wider"
                    >
                      {confirmText}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

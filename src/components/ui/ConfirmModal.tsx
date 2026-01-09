import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

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

          {/* Modal */}
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
                  {/* Primary Action (Cancel - Keep Favorites) - Matches 'Continue Building' */}
                  <button
                    onClick={onClose}
                    className="w-full h-12 rounded-xl bg-[#E6411C] text-white font-bold hover:bg-[#d13a18] transition-colors shadow-sm"
                  >
                    {cancelText}
                  </button>

                  {/* Destructive Action (Clear) - Matches 'Discard Draft' */}
                  <button
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className="w-full py-2 text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-wider"
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

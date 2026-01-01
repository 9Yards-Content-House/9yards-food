import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

const WHATSAPP_NUMBER = '256700000000'; // Replace with actual 9Yards WhatsApp number
const DEFAULT_MESSAGE = 'Hi! I would like to place an order from 9Yards Food 🍽️';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const handleSendMessage = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 lg:bottom-8 right-4 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        aria-label="Chat on WhatsApp"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="whatsapp"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6 text-white fill-white" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Ping animation when closed */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full animate-ping" />
        )}
      </motion.button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-44 lg:bottom-28 right-4 z-50 w-80 bg-card rounded-2xl shadow-2xl overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="bg-green-500 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">9Y</span>
                </div>
                <div>
                  <h3 className="font-bold">9Yards Food</h3>
                  <p className="text-sm text-green-100 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                    Typically replies instantly
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 bg-muted/30">
              <div className="bg-card rounded-xl p-3 shadow-sm mb-4">
                <p className="text-sm text-foreground">
                  👋 Hello! Welcome to 9Yards Food. How can we help you today?
                </p>
                <span className="text-xs text-muted-foreground mt-1 block">Just now</span>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mb-4">
                {['Place Order', 'Check Menu', 'Delivery Status'].map((action) => (
                  <button
                    key={action}
                    onClick={() => setMessage(`Hi! I want to ${action.toLowerCase()}`)}
                    className="text-xs bg-card px-3 py-1.5 rounded-full border border-border hover:border-green-500 hover:text-green-600 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-card border border-border focus:outline-none focus:border-green-500 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Send message"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-card border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Powered by WhatsApp 💬
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

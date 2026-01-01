import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, UtensilsCrossed, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <main className="pt-20 md:pt-24">
        <section className="section-padding">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto text-center"
            >
              {/* 404 Illustration */}
              <div className="mb-8">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-8xl md:text-9xl font-extrabold text-primary/10"
                >
                  404
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto -mt-12"
                >
                  <span className="text-4xl">🍽️</span>
                </motion.div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Page Not Found
              </h1>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Oops! The page you're looking for seems to have wandered off. 
                Don't worry, there's plenty of delicious food waiting for you.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="btn-outline flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
                <Link
                  to="/menu"
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  Browse Menu
                </Link>
              </div>

              {/* Back Link */}
              <button
                onClick={() => window.history.back()}
                className="mt-8 text-sm text-muted-foreground hover:text-secondary transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go back to previous page
              </button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}

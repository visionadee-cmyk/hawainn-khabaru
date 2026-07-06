import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

interface PromoBannerProps {
  location?: 'home' | 'article' | 'category';
}

interface BannerData {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  location: 'home' | 'article' | 'category';
  size: 'mobile' | 'desktop' | 'both';
}

export default function PromoBanner({ location = 'home' }: PromoBannerProps) {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchSelectedBanner = async () => {
      try {
        // Get selected banner ID from settings based on location
        const settingsDoc = await getDoc(doc(db, 'settings', `selectedBanner_${location}`));
        if (settingsDoc.exists()) {
          const bannerId = settingsDoc.data().bannerId;
          if (bannerId) {
            // Get the banner document
            const bannerDoc = await getDoc(doc(db, 'banners', bannerId));
            if (bannerDoc.exists()) {
              const bannerData = { id: bannerDoc.id, ...bannerDoc.data() } as BannerData;
              // Check if banner matches current location and size
              const shouldDisplay = 
                bannerData.location === location && 
                (bannerData.size === 'both' || 
                 (isMobile && bannerData.size === 'mobile') || 
                 (!isMobile && bannerData.size === 'desktop'));
              
              if (shouldDisplay) {
                setBanner(bannerData);
              } else {
                setBanner(null);
                console.log('Banner does not match location or size requirements');
              }
            } else {
              console.log('Banner document not found:', bannerId, '- clearing selection');
              // Clear the invalid selection from settings
              try {
                const { deleteDoc } = await import('firebase/firestore');
                await deleteDoc(doc(db, 'settings', `selectedBanner_${location}`));
              } catch (e) {
                console.error('Error clearing invalid banner selection:', e);
              }
            }
          } else {
            console.log('No banner ID in settings for location:', location);
          }
        } else {
          console.log('No settings document for location:', location);
        }
      } catch (error) {
        console.error('Error fetching selected banner:', error);
      }
    };

    fetchSelectedBanner();
  }, [location, isMobile]);

  if (!banner) return null;

  return (
    <div className="relative w-full overflow-hidden bg-slate-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full"
      >
        <picture>
          <source media="(min-width: 768px)" srcSet={banner.image} />
          <img 
            src={banner.image} 
            alt={banner.title}
            className="w-full h-full object-contain"
            style={{ objectPosition: 'center' }}
          />
        </picture>
      </motion.div>
    </div>
  );
}

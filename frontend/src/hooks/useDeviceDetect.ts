import { useState, useEffect } from 'react';

export function useDeviceDetect() {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|iphone|ipad|ipod|blackberry|webos/.test(userAgent);
      
      // Detectar dispositivo
      if (width < 640 || isMobile) {
        setDevice('mobile');
      } else if (width < 1024) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }

      // Detectar se é dispositivo fraco (pouca memória/CPU)
      const memory = (navigator as any).deviceMemory;
      const cores = navigator.hardwareConcurrency || 4;
      
      if (memory && memory < 4) {
        setIsLowPower(true);
      } else if (cores < 4) {
        setIsLowPower(true);
      } else if (isMobile && width < 400) {
        setIsLowPower(true);
      } else {
        setIsLowPower(false);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { device, isLowPower };
}

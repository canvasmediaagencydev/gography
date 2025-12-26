import { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา - Gography ทัวร์ถ่ายภาพและท่องเที่ยว',
  description: 'ทำความรู้จักกับ Gography ผู้เชี่ยวชาญด้านทัวร์ถ่ายภาพและการท่องเที่ยว เราเชื่อว่าทุกการเดินทางคือของขวัญที่ควรพิเศษ Learn about our photography tour services.',
  keywords: ['เกี่ยวกับเรา', 'about', 'Gography', 'ทัวร์ถ่ายภาพ', 'ทีมงาน', 'photography tour company'],
  openGraph: {
    title: 'เกี่ยวกับเรา - Gography',
    description: 'ทำความรู้จักกับ Gography ผู้เชี่ยวชาญด้านทัวร์ถ่ายภาพและการท่องเที่ยว',
    images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80'],
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}

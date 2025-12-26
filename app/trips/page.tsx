import { Metadata } from 'next';
import TripsPageClient from './TripsPageClient';

export const metadata: Metadata = {
  title: 'ทริปทั้งหมด - ทัวร์ถ่ายภาพและท่องเที่ยว',
  description: 'ค้นพบทริปท่องเที่ยวและทัวร์ถ่ายภาพทั่วโลกของเรา เลือกจากทริปกลุ่มเล็กและทริปส่วนตัว พร้อมโปรแกรมการเดินทางที่ออกแบบมาอย่างพิถีพิถัน Discover our photography tours and travel trips around the world.',
  keywords: ['ทริปทั้งหมด', 'ทัวร์ถ่ายภาพ', 'ทัวร์ท่องเที่ยว', 'photography tours', 'travel packages', 'group tours'],
  openGraph: {
    title: 'ทริปทั้งหมด - Gography',
    description: 'ค้นพบทริปท่องเที่ยวและทัวร์ถ่ายภาพทั่วโลกของเรา',
    images: ['/img/all-trips.webp'],
  },
};

export default function TripsPage() {
  return <TripsPageClient />;
}

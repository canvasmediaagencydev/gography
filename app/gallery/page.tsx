import { Metadata } from 'next';
import GalleryPageClient from './GalleryPageClient';

export const metadata: Metadata = {
  title: 'แกลเลอรี่ภาพ - รวมภาพประทับใจจากทริปรอบโลก',
  description: 'ชมภาพถ่ายสวยงามจากทริปท่องเที่ยวและทัวร์ถ่ายภาพทั่วโลก บันทึกความทรงจำผ่านเลนส์ช่างภาพมืออาชีพ Explore beautiful photography from our tours around the world.',
  keywords: ['แกลเลอรี่', 'ภาพถ่าย', 'ทัวร์ถ่ายภาพ', 'photography gallery', 'travel photos', 'ภาพประทับใจ'],
  openGraph: {
    title: 'แกลเลอรี่ภาพ - Gography',
    description: 'ชมภาพถ่ายสวยงามจากทริปท่องเที่ยวและทัวร์ถ่ายภาพทั่วโลก',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80'],
  },
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}

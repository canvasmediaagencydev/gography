import { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'ติดต่อเรา - Gography ทัวร์ถ่ายภาพและท่องเที่ยว',
  description: 'ติดต่อทีมงาน Gography สอบถามรายละเอียดทริป หรือปรึกษาการจัดทริปส่วนตัว โทร 097-919-9293 หรือติดต่อผ่าน LINE, Facebook, Instagram Contact us for tour inquiries.',
  keywords: ['ติดต่อเรา', 'contact', 'สอบถาม', 'จองทริป', 'LINE', 'Facebook', 'tour booking'],
  openGraph: {
    title: 'ติดต่อเรา - Gography',
    description: 'ติดต่อทีมงาน Gography สอบถามรายละเอียดทริปหรือจองทริป',
    images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80'],
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}

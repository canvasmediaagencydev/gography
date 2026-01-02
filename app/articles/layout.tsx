import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'บทความและเรื่องราว - Articles & Stories',
  description: 'อ่านเรื่องราวจากทริปจริง เคล็ดลับการเดินทาง และไอเดียสำหรับการท่องเที่ยว จากผู้เชี่ยวชาญของ Gography ค้นพบจุดหมายปลายทางที่น่าสนใจ ประสบการณ์การเดินทาง และคำแนะนำในการถ่ายภาพท่องเที่ยว',
  keywords: ['บทความท่องเที่ยว', 'travel blog', 'เคล็ดลับการเดินทาง', 'travel tips', 'ไอเดียเที่ยว', 'ยุโรป', 'ไอซ์แลนด์', 'นอร์เวย์', 'รัสเซีย', 'เยอรมนี', 'Iceland travel', 'Norway travel', 'Europe travel', 'photography travel', 'ถ่ายภาพท่องเที่ยว', 'aurora', 'แสงเหนือ', 'northern lights'],
  openGraph: {
    title: 'บทความและเรื่องราวการเดินทาง - Gography',
    description: 'อ่านเรื่องราวจากทริปจริง เคล็ดลับการเดินทาง และไอเดียสำหรับการท่องเที่ยว จากผู้เชี่ยวชาญของ Gography',
    type: 'website',
    locale: 'th_TH',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Gography Travel Articles - บทความท่องเที่ยว',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'บทความและเรื่องราวการเดินทาง - Gography',
    description: 'อ่านเรื่องราวจากทริปจริง เคล็ดลับการเดินทาง และไอเดียสำหรับการท่องเที่ยว',
    images: ['https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&q=80'],
  },
};

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ทัวร์ส่วนตัว - Private Tours",
  description:
    "ทัวร์ส่วนตัวที่ออกแบบเพื่อคุณเท่านั้น เที่ยวอย่างอิสระ ปลอดภัย สะดวกสบาย พร้อมบริการแบบพรีเมียม ปรับแผนได้ตามใจ มีไกด์มืออาชีพดูแลตลอดทริป เหมาะกับครอบครัว คู่รัก กลุ่มเพื่อน และทริปองค์กร",
  keywords: [
    "ทัวร์ส่วนตัว",
    "private tour",
    "ทัวร์ครอบครัว",
    "ทัวร์คู่รัก",
    "ทัวร์กลุ่มเพื่อน",
    "ทัวร์องค์กร",
    "custom tour",
    "tailored travel",
    "private trip Thailand",
    "ออกแบบทริป",
    "ทริปพิเศษ",
    "บริการท่องเที่ยวส่วนตัว",
  ],
  openGraph: {
    title: "ทัวร์ส่วนตัว - ออกแบบทริปในฝันของคุณ | Gography",
    description:
      "เที่ยวแบบส่วนตัวอย่างอิสระและสะดวกสบาย ปรับแผนได้ตามใจ มีไกด์มืออาชีพและช่างภาพคอยดูแลตลอดทริป เหมาะกับทุกกลุ่ม",
    type: "website",
    locale: "th_TH",
    images: [
      {
        url: "/private/header.png",
        width: 1200,
        height: 630,
        alt: "Gography Private Tours - ทัวร์ส่วนตัว",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ทัวร์ส่วนตัว - ออกแบบทริปในฝันของคุณ | Gography",
    description:
      "เที่ยวแบบส่วนตัวอย่างอิสระและสะดวกสบาย ปรับแผนได้ตามใจ มีไกด์มืออาชีพและช่างภาพคอยดูแลตลอดทริป",
    images: ["/private/header.png"],
  },
};

const benefits = [
  {
    title: "เหมาะกับครอบครัว",
    description: "ไม่ต้องรอใคร เที่ยวตามจังหวะของคุณ ได้ทุกวัย ทุกไลฟ์สไตล์",
    icon: "/private/why1.svg",
  },
  {
    title: "ปรับแผนได้ตามใจ",
    description:
      "ยืดหยุ่นเรื่องเวลาและกิจกรรมได้เต็มที่ แผนเที่ยวออกแบบเพื่อคุณจริงๆ",
    icon: "/private/why2.svg",
  },
  {
    title: "ไกด์มืออาชีพ",
    description: "ทีมงานดูแลเฉพาะกลุ่มตลอดทริป พร้อมช่างภาพคอยเก็บทุกโมเมนต์",
    icon: "/private/why3.svg",
  },
];

const steps = [
  {
    icon: "/private/step1.svg",
    title: "ปรึกษา",
    description: "แอดไลน์หรือโทรคุยกับทีมงานเพื่อเล่าไอเดียเบื้องต้น",
  },
  {
    icon: "/private/step2.svg",
    title: "บรีฟความต้องการ",
    description: "แจ้งประเทศ งบ และสไตล์ที่ชอบให้เรารู้จักคุณมากขึ้น",
  },
  {
    icon: "/private/step3.svg",
    title: "รับแผนทัวร์",
    description: "รับแผนทัวร์เบื้องต้นภายใน 1-2 วัน พร้อมคำแนะนำพิเศษ",
  },
  {
    icon: "/private/step4.svg",
    title: "ยืนยันและชำระเงิน",
    description: "เลือกแผนที่ถูกใจแล้วจ่ายมัดจำเพื่อเริ่มจองทุกบริการ",
  },
  {
    icon: "/private/step5.svg",
    title: "ออกเดินทาง",
    description: "เตรียมตัวและออกเดินทางอย่างมั่นใจ ทีมงานดูแลตลอดทริป",
  },
];

const testimonials = [
  {
    name: "ครอบครัวจิรศักดิ์",
    quote:
      "ทริปญี่ปุ่นฤดูหนาวคือที่สุด ทุกคนสนุกเพราะทีม Gography ปรับทุกอย่างให้เข้ากับเด็กและผู้ใหญ่ได้ลงตัว",
    image: "/private/customer1.webp",
  },
  {
    name: "คุณอิง + แก๊งเพื่อน",
    quote:
      "ประทับใจมาก ได้เที่ยวสไตล์ที่ชอบและได้รูปสวยๆ กลับมาด้วย แค่มากับเพื่อนแล้วที่เหลือทีมงานจัดให้หมด",
    image: "/private/customer2.webp",
  },
  {
    name: "บริษัทสตาร์ทอัป",
    quote:
      "ทริปทีมบิลดิ้งที่ไอซ์แลนด์ทำให้ทุกคนใกล้ชิดกันขึ้น บริการดูแลแบบใส่ใจและยืดหยุ่นตามสถานการณ์จริง",
    image: "/private/customer3.webp",
  },
  {
    name: "คู่รักสายโรแมนติก",
    quote:
      "การขอแต่งงานริมทะเลสาบสวิสคือที่สุด ทีมงานเตรียมให้ทุกอย่างสมบูรณ์แบบมาก",
    image: "/private/customer4.webp",
  },
];

const audiences = [
  {
    title: "ครอบครัว",
    description: "เด็กเล็กหรือผู้ใหญ่ก็เที่ยวได้สบาย",
    image: "/private/customer1.webp",
  },
  {
    title: "คู่รัก",
    description: "เน้นความเป็นส่วนตัว",
    image: "/private/customer2.webp",
  },
  {
    title: "ผู้สูงอายุ",
    description: "อยากเที่ยวแบบช้าๆ ไม่เร่งรีบ",
    image: "/private/customer3.webp",
  },
  {
    title: "กลุ่มเพื่อน",
    description: "อยากได้โมเมนต์ส่วนตัว",
    image: "/private/customer4.webp",
  },
];

export default function PrivateTripsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center">
          <Image
            src="/private/header.png"
            alt="Private tour hero"
            fill
            priority
            className="object-cover"
            unoptimized
          />
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/50"
            aria-hidden="true"
          />
          <div className="relative z-10 w-full">
            <div className="container mx-auto px-6 py-24 text-center text-white max-w-4xl">
              <p className="text-lg md:text-xl mb-4">
                ทัวร์ส่วนตัว ที่ออกแบบเพื่อคุณเท่านั้น
              </p>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                เที่ยวอย่างอิสระ ปลอดภัย สะดวกสบาย พร้อมบริการแบบพรีเมียม
              </h1>
              <p className="text-base md:text-lg mb-10">
                เที่ยวกับ GOGRAPHY อย่างสบายใจ ไม่ต้องวางแผนเอง
                ปรึกษาเราแล้วให้ทีมมืออาชีพออกแบบทริปที่ใช่ที่สุดสำหรับคุณ
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-orange-500 dark:bg-orange-600 px-8 py-3 text-white font-semibold text-base md:text-lg shadow-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition"
              >
                ปรึกษาและออกแบบทริป
              </Link>
            </div>
          </div>
        </section>

        {/* Audience Section */}
        <section className="py-20 px-6 bg-white dark:bg-gray-800">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <p className="text-xl text-orange-500 dark:text-orange-400">
                Private Tour
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                เหมาะกับใคร?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {audiences.map((audience) => (
                <div
                  key={audience.title}
                  className="rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-700 shadow-sm"
                >
                  <Image
                    src={audience.image}
                    alt={audience.title}
                    width={480}
                    height={320}
                    className="h-64 w-full object-cover"
                    unoptimized
                  />
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {audience.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                      {audience.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose */}
        <section className="py-20 px-6 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                ทำไมต้องเลือก Private Tour กับ Gography?
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                เพราะทุกการเดินทางควรพิเศษแบบคุณเท่านั้น
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 text-center bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-center mb-6">
                    <Image
                      src={benefit.icon}
                      alt={benefit.title}
                      width={72}
                      height={72}
                      unoptimized
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                ขั้นตอนการจอง
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Private Tour
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`bg-white dark:bg-gray-700 rounded-2xl p-6 text-center shadow-sm ${
                    index < 3 ? "md:col-span-4" : "md:col-span-6"
                  }`}
                >
                  <div className="flex justify-center mb-5">
                    <Image
                      src={step.icon}
                      alt={step.title}
                      width={68}
                      height={68}
                      unoptimized
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-center mt-10">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-orange-500 dark:bg-orange-600 px-8 py-3 text-white font-semibold text-base shadow-md hover:bg-orange-600 dark:hover:bg-orange-700 transition"
              >
                แชทปรึกษาทีมงานตอนนี้!
              </Link>
              <Link
                href="tel:097-919-9293"
                className="inline-flex items-center justify-center rounded-full border border-orange-200 dark:border-orange-500 px-8 py-3 text-orange-500 dark:text-orange-400 font-semibold text-base hover:bg-white dark:hover:bg-gray-700"
              >
                โทรหาทีมงาน
              </Link>
            </div>
            <div className="text-center mt-12 max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                อยากเที่ยวแบบไหน เราจัดให้ได้ตามความต้องการ
                กรอกข้อมูลส่งมาได้เลย
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base">
                ให้คุณได้ออกแบบแผนการเดินทางในฝันของคุณ พาเรา Gography
                จะช่วยเติมเต็มช่วงเวลาแห่งความสุขด้วยภาพถ่ายสวยงาม
                ให้ช่วงเวลาสุดพิเศษของคุณยังคงอยู่ตลอดไป
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                เสียงจากลูกค้าที่เลือก Gography
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                ทุกประสบการณ์ถูกดูแลอย่างตั้งใจ
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="rounded-3xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col gap-4 shadow-sm bg-white dark:bg-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={72}
                      height={72}
                      className="rounded-2xl object-cover"
                      unoptimized
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-orange-500 dark:text-orange-400">
                        Private Trip
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-orange-50 dark:bg-gray-800 py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-500 dark:text-orange-400 mb-4">
              GOGRAPHY PRIVATE TRIP
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              พร้อมพาคุณออกเดินทางในแบบที่คุณเป็น
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg mb-8">
              ทักมาคุยกันเพื่อให้นักออกแบบทริปช่วยวางแผนเส้นทาง กิจกรรม
              และทีมงานที่เหมาะสมที่สุด ทั้งแบบครอบครัว คู่รัก แก๊งเพื่อน
              หรือทริปองค์กร
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-orange-500 dark:bg-orange-600 px-8 py-3 text-white font-semibold text-base shadow-md hover:bg-orange-600 dark:hover:bg-orange-700 transition"
              >
                เริ่มคุยกับทีมงาน
              </Link>
              <Link
                href="/trips"
                className="inline-flex items-center justify-center rounded-full border border-orange-200 dark:border-orange-500 px-8 py-3 text-orange-500 dark:text-orange-400 font-semibold text-base hover:bg-white dark:hover:bg-gray-800"
              >
                ดูทริปตัวอย่าง
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

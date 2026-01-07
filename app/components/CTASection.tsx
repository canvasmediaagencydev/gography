import Image from "next/image";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/img/random5.webp"
          alt="Call to action background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          &quot;อย่าปล่อยให้ความฝัน
        </h2>
        <h3 className="text-cyan-400 dark:text-cyan-300 text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
          ในการเดินทางของคุณรอนานเกินไป&quot;
        </h3>

        <p className="text-white text-base md:text-lg max-w-3xl mb-4">
          ปลดล็อคประสบการณ์การเดินทางที่
          เหนือระดับกับผู้เชี่ยวชาญด้านการท่องเที่ยว
        </p>
        <p className="text-white text-base md:text-lg max-w-3xl mb-8">
          และช่างภาพมืออาชีพที่จะทำให้ทุกทริป ของคุณเป็นความทรงจำที่ไม่รู้ลืม
        </p>

        <p className="text-white text-lg md:text-xl font-semibold mb-8">
          เริ่มต้นการเดินทางของคุณตอนนี้
        </p>

        <Link href="/contact">
          <button className="cursor-pointer bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold px-12 py-4 rounded-full transition-colors duration-300 text-lg shadow-lg">
            สอบถามหรือจองทริป
          </button>
        </Link>
      </div>
    </section>
  );
}

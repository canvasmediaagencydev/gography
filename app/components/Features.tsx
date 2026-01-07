import Image from "next/image";

export default function Features() {
  const features = [
    {
      icon: "/specials/special1.svg",
      title: "ประสบการณ์จริง",
      description: "ทริปออกแบบจากประสบการณ์ตรง",
    },
    {
      icon: "/specials/special2.svg",
      title: "ภาพถ่ายคุณภาพสูง",
      description: "มีช่างภาพเก็บภาพสวยให้คุณ",
    },
    {
      icon: "/specials/special3.svg",
      title: "แนะนำเทคนิคถ่ายภาพ",
      description: "ช่วยให้ถ่ายได้สวย แม้ไม่ใช่ช่างภาพมืออาชีพ",
    },
    {
      icon: "/specials/special4.svg",
      title: "ดูแลอย่างเป็นกันเอง",
      description: "เที่ยวแบบสบายใจเหมือนไปกับเพื่อน",
    },
    {
      icon: "/specials/special5.svg",
      title: "เส้นทางพิเศษ",
      description: "เจาะลึกจุดถ่ายภาพที่ไม่ใช่แค่ที่เที่ยวทั่วไป",
    },
    {
      icon: "/specials/special6.svg",
      title: "ใส่ใจทุกรายละเอียด",
      description: "เพราะเรารักการเดินทางและอยากให้คุณประทับใจ",
    },
  ];

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          นี่คือความพิเศษของเรา
          <span className="text-orange-600 dark:text-orange-500">
            ทัวร์ถ่ายภาพ
          </span>
          ทิวทัศน์
        </h2>
        <p className="text-center text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-16">
          ที่คุณจะไม่อยากพลาด!
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
              </div>

              {/* Title */}
              <h3 className="text-center text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-center text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

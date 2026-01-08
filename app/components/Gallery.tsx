"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { GalleryImageWithRelations } from "@/types/database.types";

export default function Gallery() {
  const [images, setImages] = useState<GalleryImageWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestImages = async () => {
      try {
        const res = await fetch("/api/gallery?is_active=true&pageSize=12");
        const data = await res.json();
        const sorted = (data?.images || [])
          .sort(
            (a: GalleryImageWithRelations, b: GalleryImageWithRelations) =>
              new Date(b.created_at || 0).getTime() -
              new Date(a.created_at || 0).getTime()
          )
          .slice(0, 6);
        setImages(sorted);
      } catch (error) {
        console.error("Error loading home gallery:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestImages();
  }, []);

  return (
    <section className="bg-white dark:bg-gray-800 py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            แกลเลอรีแห่งแรงบันดาลใจ
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ที่จะพาคุณออกเดินทางครั้งต่อไป
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg max-w-4xl mx-auto">
            บันทึกความทรงจำจากทั่วทุกมุมโลก
            จากผู้ที่เชื่อให้เราออกแบบการเดินทางสัมผัสประสบการณ์ท่องเที่ยวที่
            <br />
            ออกแบบเฉพาะคุณ ผ่านเลนส์แห่งความทรงจำโดย{" "}
            <span className="font-bold">ช่างภาพมืออาชีพ</span>
          </p>
        </div>

        {/* Preview Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-700 animate-pulse"
              />
            ))}
          {!isLoading && images.length === 0 && (
            <div className="col-span-2 md:col-span-3 text-center text-gray-500 dark:text-gray-400">
              ยังไม่มีรูปในแกลเลอรีตอนนี้
            </div>
          )}
          {!isLoading &&
            images.map((image) => (
              <Link
                key={image.id}
                href="/gallery"
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-square overflow-hidden relative">
                  <Image
                    src={image.storage_url}
                    alt={image.alt_text || image.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    unoptimized
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    {image.country?.name_th && (
                      <span className="inline-block bg-orange-600 dark:bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full mb-1">
                        {image.country?.name_th}
                      </span>
                    )}
                    <p className="text-white text-sm font-semibold">
                      {image.title}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="text-center bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold px-10 py-3 rounded-full transition-colors duration-300"
          >
            สอบถามหรือจองทริป
          </Link>
          <Link
            href="/gallery"
            className="text-center bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-semibold px-10 py-3 rounded-full transition-colors duration-300"
          >
            ดูภาพทั้งหมด
          </Link>
        </div>
      </div>
    </section>
  );
}

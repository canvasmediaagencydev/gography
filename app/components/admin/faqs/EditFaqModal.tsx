"use client";

import { useState, useEffect } from "react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

interface EditFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    id: string,
    data: { question: string; answer: string; order_index: number }
  ) => Promise<void>;
  faq: FAQ | null;
}

export default function EditFaqModal({
  isOpen,
  onClose,
  onUpdate,
  faq,
}: EditFaqModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill form when faq changes
  useEffect(() => {
    if (faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
      setOrderIndex(faq.order_index);
      setError("");
    }
  }, [faq]);

  if (!isOpen || !faq) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (question.length < 10) {
      setError("คำถามต้องมีอย่างน้อย 10 ตัวอักษร");
      return;
    }

    if (answer.length < 10) {
      setError("คำตอบต้องมีอย่างน้อย 10 ตัวอักษร");
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(faq.id, { question, answer, order_index: orderIndex });
      onClose();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "เกิดข้อผิดพลาด");
      } else {
        setError("เกิดข้อผิดพลาด");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 dark:border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            แก้ไข FAQ
          </h2>
          <button
            onClick={handleClose}
            className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            disabled={isSubmitting}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              คำถาม <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="เช่น วีซ่าต้องใช้เวลานานแค่ไหน?"
              disabled={isSubmitting}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {question.length}/500 ตัวอักษร
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              คำตอบ <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
              placeholder="คำตอบของคำถามนี้..."
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {answer.length} ตัวอักษร
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              ลำดับการแสดงผล
            </label>
            <input
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer px-6 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="cursor-pointer px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

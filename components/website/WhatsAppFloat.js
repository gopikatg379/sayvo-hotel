"use client";
import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { whatsappUrl } from "@/lib/config";

export default function WhatsAppFloat() {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 1800);

    const hideTimer = setTimeout(() => {
      setShowBubble(false);
    }, 8500);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-5 z-[100] flex items-end gap-3 md:bottom-7 md:right-7">
      {/* Message bubble */}
      {showBubble && (
        <div className="whatsapp-popup relative max-w-[250px] rounded-2xl bg-white p-4 shadow-2xl">
          <button
            type="button"
            onClick={() => setShowBubble(false)}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
            aria-label="Close WhatsApp message"
          >
            <X size={14} />
          </button>

          <p className="pr-6 text-sm font-bold text-[#20211f]">
            Planning a Kochi stay?
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-600">
            Chat with Stayvo Kochi on WhatsApp. We’ll help you plan it.
          </p>

          <a
            href={whatsappUrl(
              "Hi Stayvo Kochi, I would like help planning a stay."
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-xs font-bold !text-white"
          >
            <FaWhatsapp size={15} />
            Start Chat
          </a>
        </div>
      )}

      {/* WhatsApp button */}
      <a
        href={whatsappUrl(
          "Hi Stayvo Kochi, I would like help planning a stay."
        )}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Stayvo Kochi on WhatsApp"
        className="whatsapp-float group relative grid h-[62px] w-[62px] place-items-center rounded-full bg-[#25D366] shadow-[0_12px_35px_rgba(37,211,102,0.4)] transition duration-300 hover:scale-110"
      >
        {/* Pulse rings */}
        <span className="whatsapp-ring absolute inset-0 rounded-full bg-[#25D366]" />
        <span className="whatsapp-ring whatsapp-ring-delay absolute inset-0 rounded-full bg-[#25D366]" />

        {/* Icon */}
        <FaWhatsapp
          size={36}
          className="relative z-10 text-white"
        />

        {/* Notification dot */}
        <span className="absolute -right-0.5 -top-0.5 z-20 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-red-500 text-[9px] font-bold text-white">
          1
        </span>
      </a>
    </div>
  );
}
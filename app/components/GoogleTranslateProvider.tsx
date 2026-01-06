"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: {
          new (
            options: {
              pageLanguage: string;
              includedLanguages: string;
              layout: number;
              autoDisplay: boolean;
            },
            elementId: string
          ): void;
          InlineLayout: {
            SIMPLE: number;
          };
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export default function GoogleTranslateProvider() {
  useEffect(() => {
    // Add custom styles to hide Google Translate branding
    const style = document.createElement("style");
    style.textContent = `
      .goog-te-banner-frame {
        display: none !important;
      }
      body {
        top: 0 !important;
      }
      #google_translate_element {
        position: absolute;
        left: -9999px;
        opacity: 0;
      }
      /* Hide the top frame completely */
      .goog-te-banner-frame.skiptranslate {
        display: none !important;
      }
      body > .skiptranslate {
        display: none !important;
      }
      iframe.goog-te-banner-frame {
        display: none !important;
      }
      /* Remove the top margin/padding that Google Translate adds */
      body {
        top: 0 !important;
        position: static !important;
      }
    `;
    document.head.appendChild(style);

    // Create the Google Translate element container
    if (!document.getElementById("google_translate_element")) {
      const div = document.createElement("div");
      div.id = "google_translate_element";
      document.body.appendChild(div);
    }

    // Initialize Google Translate
    window.googleTranslateElementInit = function () {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "th",
            includedLanguages: "en,th",
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // Load Google Translate script
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return null;
}

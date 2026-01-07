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
    // Monkey patch certain DOM methods to prevent crashes from Google Translate execution
    // Google Translate replaces text nodes with font tags, causing React to lose track of the DOM
    if (typeof Node === "function" && Node.prototype) {
      const originalRemoveChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function <T extends Node>(child: T): T {
        try {
          return originalRemoveChild.apply(this, [child]) as T;
        } catch (error) {
          console.warn(
            "Recovered from Google Translate DOM interference:",
            error
          );
          // If the child is not found, we can often just ignore it as the DOM has already been mutated
          return child;
        }
      };

      const originalInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function <T extends Node>(
        newNode: T,
        referenceNode: Node | null
      ): T {
        try {
          return originalInsertBefore.apply(this, [
            newNode,
            referenceNode,
          ]) as T;
        } catch (error) {
          console.warn(
            "Recovered from Google Translate DOM interference (insertBefore):",
            error
          );
          return newNode;
        }
      };
    }

    // MutationObserver to clean up inline styles from Google Translate
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            removeGoogleStyles(node);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function removeGoogleStyles(element: HTMLElement) {
      // Helper to clean a single element
      const clean = (el: HTMLElement) => {
        // Google Translate often uses FONT tags with background colors
        if (
          el.tagName === "FONT" ||
          el.classList.contains("goog-text-highlight")
        ) {
          el.style.backgroundColor = "transparent";
          el.style.boxShadow = "none";
          el.style.boxSizing = "unset";
        }
      };

      // Clean the element itself
      clean(element);

      // Clean all font tags inside
      const fonts = element.querySelectorAll("font, .goog-text-highlight");
      fonts.forEach((font) => clean(font as HTMLElement));
    }

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

    return () => observer.disconnect();
  }, []);

  return null;
}

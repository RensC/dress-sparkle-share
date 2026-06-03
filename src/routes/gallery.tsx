import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, ZoomIn } from "lucide-react";

import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Dressperience" },
      { name: "description", content: "Explore beautiful moments from our funfitting experiences. Real friends, real dresses, real joy." },
      { property: "og:title", content: "Gallery — Dressperience" },
      { property: "og:description", content: "Explore beautiful moments from our funfitting experiences." },
    ],
  }),
  component: GalleryPage,
});

const images = [
  { src: gallery1, alt: "Elegant ballgown in a sunlit fitting room", category: "Ballgowns" },
  { src: gallery2, alt: "Friends celebrating with champagne in beautiful dresses", category: "Celebrations" },
  { src: gallery3, alt: "Intricate lace wedding dress detail", category: "Details" },
  { src: gallery4, alt: "Woman twirling in a mermaid-style dress", category: "Mermaid" },
  { src: gallery5, alt: "Group of friends posing together in wedding dresses", category: "Group" },
  { src: gallery6, alt: "Stunning dress portrait in soft studio lighting", category: "Portraits" },
];

function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
            Our Moments
          </span>
          <h1 className="mt-4 font-display text-5xl font-light text-foreground md:text-6xl">
            <span className="font-semibold italic text-lavender-600">Gallery</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-body text-lg text-muted-foreground">
            A glimpse into the magic of our funfitting experiences. Real friends, real dresses, real joy.
          </p>
        </div>

        <div className="mt-16 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className="group mb-6 block w-full cursor-zoom-in overflow-hidden rounded-xl"
            >
              <div className="relative">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-lavender-700/0 transition-colors duration-300 group-hover:bg-lavender-700/20" />
                <div className="absolute bottom-4 left-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 font-body text-xs font-medium text-lavender-700">
                    <ZoomIn size={12} />
                    {img.category}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="max-w-5xl border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">Gallery image preview</DialogTitle>
          {selectedIndex !== null && (
            <div className="relative">
              <img
                src={images[selectedIndex].src}
                alt={images[selectedIndex].alt}
                className="max-h-[85vh] w-full rounded-xl object-contain"
              />
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute -top-10 right-0 rounded-full bg-white/90 p-2 text-lavender-700 transition-colors hover:bg-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <p className="mt-3 text-center font-body text-sm text-white/90">
                {images[selectedIndex].alt}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

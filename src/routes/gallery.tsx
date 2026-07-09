import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, ZoomIn } from "lucide-react";

import gallery1 from "@/assets/gallery1.jpg";
import gallery2 from "@/assets/gallery2.jpg";
import gallery3 from "@/assets/gallery3.jpg";
import gallery4 from "@/assets/gallery4.jpg";
import gallery5 from "@/assets/gallery5.jpg";
import gallery6 from "@/assets/gallery6.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Galerij — Dressperience" },
      { name: "description", content: "Ontdek prachtige momenten uit onze funfitting-ervaringen. Echte vriendinnen, echte jurken, echt plezier." },
      { property: "og:title", content: "Galerij — Dressperience" },
      { property: "og:description", content: "Ontdek prachtige momenten uit onze funfitting-ervaringen." },
    ],
  }),
  component: GalleryPage,
});

const images = [
  { src: gallery1, alt: "Elegante baljurk in een zonnige paskamer", category: "Baljurken" },
  { src: gallery2, alt: "Vriendinnen vieren met champagne in prachtige jurken", category: "Vieringen" },
  { src: gallery3, alt: "Detail van een verfijnde kanten trouwjurk", category: "Details" },
  { src: gallery4, alt: "Vrouw draait rond in een mermaid-jurk", category: "Mermaid" },
  { src: gallery5, alt: "Groep vriendinnen poseert samen in trouwjurken", category: "Groep" },
  { src: gallery6, alt: "Schitterend jurkportret in zacht studiolicht", category: "Portretten" },
];

function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-lavender-600">
            Onze Momenten
          </span>
          <h1 className="mt-4 font-display text-5xl font-light text-foreground md:text-6xl">
            <span className="font-semibold italic text-lavender-600">Galerij</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-body text-lg text-muted-foreground">
            Een glimp van de magie van onze funfitting-ervaringen. Echte vriendinnen, echte jurken, echt plezier.
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
          <DialogTitle className="sr-only">Voorvertoning galerijfoto</DialogTitle>
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
                aria-label="Sluiten"
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

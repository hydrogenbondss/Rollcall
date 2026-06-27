import { useParams, Link } from "react-router";
import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MapPin,
  Layers,
  Droplets,
  Factory,
  Hotel,
  Globe,
  Package,
  ArrowLeft,
  Share2,
  Plus,
  Check,
  ArrowUpRight,
  Archive,
  Calendar,
  AlertTriangle,
  Eye,
  StickyNote,
  Printer,
} from "lucide-react";
import { products } from "../data/products";
import { useCurrency } from "../contexts/CurrencyContext";
import { useCompare } from "../contexts/CompareContext";
import Navigation from "../components/Navigation";
import ProductCard from "../components/ProductCard";
import ProductImage, { GENERIC_IMAGES } from "../components/ProductImage";

gsap.registerPlugin(ScrollTrigger);

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      <div className="bg-[#f0ece8] text-[#0d0d0d] font-body text-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
        <Check className="w-4 h-4" />
        {message}
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const { formatPrice } = useCurrency();
  const { isComparing, addToCompare, removeFromCompare, setIsOpen } =
    useCompare();
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);
  const [showMobileBar, setShowMobileBar] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const sameBrand = products.filter(
      p => p.brand === product.brand && p.id !== product.id
    );
    const sameCountry = products.filter(
      p =>
        p.country === product.country &&
        p.id !== product.id &&
        p.brand !== product.brand
    );
    return [...sameBrand, ...sameCountry].slice(0, 8);
  }, [product]);
  useEffect(() => {
    const handleScroll = () => {
      setShowMobileBar(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!product) return;
    const ctx = gsap.context(() => {
      if (leftRef.current)
        gsap.from(leftRef.current, {
          opacity: 0,
          x: -20,
          duration: 0.7,
          ease: "power3.out",
        });
      if (rightRef.current) {
        gsap.from(rightRef.current.querySelectorAll(".detail-item"), {
          opacity: 0,
          x: 20,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
          delay: 0.2,
        });
      }
      if (relatedRef.current) {
        gsap.from(relatedRef.current.querySelectorAll(".related-card"), {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: relatedRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [product]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 2500);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied");
    } catch {
      showToast("Link copied");
    }
  };

  const handleCompareToggle = () => {
    if (!product) return;
    if (isComparing(product.id)) removeFromCompare(product.id);
    else {
      addToCompare(product);
      setIsOpen(true);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-[#888]" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#888] mb-3">
            Specimen Missing
          </p>
          <h1 className="font-display text-3xl font-medium text-[#f0ece8] mb-3">
            Specimen not found
          </h1>
          <p className="font-body text-sm text-[#999] mb-6 max-w-sm mx-auto">
            This catalog number may have been removed, or the reference is
            incorrect.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#f0ece8] text-[#0d0d0d] font-body text-sm px-6 py-3 rounded-full hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  const comparing = isComparing(product.id);
  const hasRealImage = !GENERIC_IMAGES.has(product.image);

  const specs = [
    { icon: Layers, label: "Ply", value: `${product.ply}-Ply` },
    { icon: Droplets, label: "Scent", value: product.scent },
    { icon: Factory, label: "Material", value: product.material },
    {
      icon: MapPin,
      label: "Made in",
      value: `${product.manufacturedIn} (${product.manufacturer})`,
    },
    { icon: Globe, label: "Available", value: product.availableIn.join(", ") },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] product-detail-page">
      <Navigation />
      <Toast {...toast} />

      <div ref={sectionRef} className="pt-20 pb-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Back */}
          <button
            onClick={() => window.history.back()}
            className="mb-6 flex items-center gap-1.5 font-body text-sm text-[#999] hover:text-[#f0ece8] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="grid lg:grid-cols-[55%_45%] gap-10 lg:gap-16 specimen-print-card">
            {/* Image */}
            <div ref={leftRef}>
              <div className="rounded-2xl overflow-hidden bg-[#141414]">
                <ProductImage
                  product={product}
                  aspectRatio="square"
                  className="rounded-2xl"
                  showLabel={!hasRealImage}
                />
              </div>
              {hasRealImage && (
                <p className="mt-3 font-body text-[11px] text-[#999] flex items-center gap-1.5">
                  <Check className="w-3 h-3" />
                  Product imagery sourced
                </p>
              )}
            </div>

            {/* Info */}
            <div ref={rightRef}>
              <div className="detail-item mb-1">
                <span className="font-body text-[11px] uppercase tracking-[0.15em] text-[#999]">
                  {product.brand}
                </span>
              </div>
              <h1 className="detail-item font-display text-3xl sm:text-4xl font-medium text-[#f0ece8] mb-3 leading-tight">
                {product.name}
              </h1>
              <div className="detail-item mb-4">
                <span className={`inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${product.verified ? 'bg-[#228b68]/15 text-[#228b68] border-[#228b68]/20' : 'bg-[#c85a32]/15 text-[#c85a32] border-[#c85a32]/20'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${product.verified ? 'bg-[#228b68]' : 'bg-[#c85a32]'}`} />
                  {product.verified ? 'Verified specimen' : 'Community-sourced specimen'}
                </span>
                <span className="font-body text-[11px] text-[#888] ml-3">
                  {product.verified
                    ? 'Confirmed by manufacturer or retailer source.'
                    : 'Brand and market confirmed; product details from field observation.'}
                </span>
              </div>
              {product.badges && product.badges.length > 0 && (
                <div className="detail-item flex flex-wrap gap-2 mb-4">
                  {product.badges.map(badge => {
                    const badgeStyles: Record<string, string> = {
                      Thickest:
                        "bg-[#c4728e]/10 text-[#c4728e] border-[#c4728e]/20",
                      "Most Luxurious":
                        "bg-[#c28223]/10 text-[#c28223] border-[#c28223]/20",
                      "Most Rolls":
                        "bg-[#228b68]/10 text-[#228b68] border-[#228b68]/20",
                      "Eco Choice":
                        "bg-[#228b68]/10 text-[#228b68] border-[#228b68]/20",
                      "Best Value":
                        "bg-[#c28223]/10 text-[#c28223] border-[#c28223]/20",
                      Softest:
                        "bg-[#c4728e]/10 text-[#c4728e] border-[#c4728e]/20",
                      "Editor Pick":
                        "bg-[#888]/10 text-[#888] border-[#888]/20 ",
                      Premium:
                        "bg-[#c28223]/10 text-[#c28223] border-[#c28223]/20",
                      "Most Popular":
                        "bg-[#c85a32]/10 text-[#c85a32] border-[#c85a32]/20",
                      "Regional Pick":
                        "bg-[#c85a32]/10 text-[#c85a32] border-[#c85a32]/20",
                    };
                    return (
                      <span
                        key={badge}
                        className={`inline-flex items-center gap-1 font-body text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-medium border ${badgeStyles[badge] || "bg-white/5 text-[#888] border-white/10"}`}
                      >
                        <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                        {badge}
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="detail-item flex items-center gap-1.5 text-[#999] mb-6">
                <MapPin className="w-4 h-4" />
                <span className="font-body text-sm">
                  {product.country} &middot; {product.city}
                </span>
              </div>
              <div className="detail-item mb-8">
                <span className="font-display text-3xl font-medium text-[#f0ece8]">
                  {formatPrice(product.priceUSD)}
                </span>
                <span className="font-mono text-[10px] text-[#999] ml-2">
                  {product.currency}
                </span>
              </div>

              {/* Specs */}
              <div className="detail-item border-t border-white/5 pt-6 mb-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  {specs.map(spec => (
                    <div key={spec.label} className="flex items-start gap-3">
                      <spec.icon
                        className="w-4 h-4 text-[#999] mt-0.5 shrink-0"
                        strokeWidth={1.5}
                      />
                      <div>
                        <p className="font-body text-[11px] text-[#999] mb-0.5">
                          {spec.label}
                        </p>
                        <p className="font-body text-sm text-[#f0ece8] leading-snug">
                          {spec.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotels */}
              <div className="detail-item border-t border-white/5 pt-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Hotel className="w-4 h-4 text-[#999]" strokeWidth={1.5} />
                  <span className="font-body text-sm font-medium text-[#f0ece8]">
                    Found at these hotels
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.hotels.map(h => (
                    <span
                      key={h}
                      className="inline-flex items-center gap-1.5 bg-white/5 rounded-lg px-3 py-2 font-body text-[12px] text-[#999]"
                    >
                      <Hotel className="w-3 h-3 text-[#c4bdb5]" />
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {product.notes && (
                <div className="detail-item bg-white/5 rounded-xl p-4 mb-6">
                  <p className="font-body text-[13px] text-[#888] leading-relaxed">
                    {product.notes}
                  </p>
                </div>
              )}

              {/* Archival Metadata */}
              {(product.acquisitionDate ||
                product.archivalStatus ||
                product.collectorNote) && (
                <div className="detail-item border-t border-white/5 pt-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Archive
                      className="w-4 h-4 text-[#c28223]"
                      strokeWidth={1.5}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#888]">
                      Archival Record
                    </span>
                  </div>

                  {product.archivalStatus &&
                    product.archivalStatus !== "active" && (
                      <div
                        className={`rounded-lg p-3 mb-4 ${
                          product.archivalStatus === "extinct"
                            ? "bg-[#8b2500]/10 border border-[#8b2500]/20"
                            : "bg-[#c28223]/5 border border-[#c28223]/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {product.archivalStatus === "extinct" ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-[#c85a32]" />
                          ) : (
                            <Eye className="w-3.5 h-3.5 text-[#c28223]" />
                          )}
                          <span
                            className={`font-mono text-[10px] uppercase tracking-wider ${
                              product.archivalStatus === "extinct"
                                ? "text-[#c85a32]"
                                : "text-[#c28223]"
                            }`}
                          >
                            {product.archivalStatus === "extinct"
                              ? "Specimen Extinct"
                              : `Status: ${product.archivalStatus}`}
                          </span>
                        </div>
                        {product.lastObserved && (
                          <p className="font-body text-[11px] text-[#999] ml-5">
                            Last observed in circulation:{" "}
                            <span className="text-[#f0ece8]">
                              {product.lastObserved}
                            </span>
                          </p>
                        )}
                      </div>
                    )}

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {product.acquisitionDate && (
                      <div className="flex items-start gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#999] mt-0.5" />
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-wider text-[#999]">
                            Acquired
                          </p>
                          <p className="font-body text-[12px] text-[#f0ece8]">
                            {product.acquisitionDate}
                          </p>
                        </div>
                      </div>
                    )}
                    {product.condition && (
                      <div className="flex items-start gap-2">
                        <Package className="w-3.5 h-3.5 text-[#999] mt-0.5" />
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-wider text-[#999]">
                            Condition
                          </p>
                          <p className="font-body text-[12px] text-[#f0ece8]">
                            {product.condition}
                          </p>
                        </div>
                      </div>
                    )}
                    {product.rarity && (
                      <div className="flex items-start gap-2">
                        <Eye className="w-3.5 h-3.5 text-[#999] mt-0.5" />
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-wider text-[#999]">
                            Rarity
                          </p>
                          <p className="font-body text-[12px] capitalize text-[#f0ece8]">
                            {product.rarity}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {product.collectorNote && (
                    <div className="bg-white/[0.02] rounded-lg p-4 border-l-2 border-[#c28223]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <StickyNote className="w-3.5 h-3.5 text-[#c28223]/60" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#c28223]/60">
                          Collector's Note
                        </span>
                      </div>
                      <p className="font-body text-[12px] text-[#a09890] leading-relaxed italic">
                        &ldquo;{product.collectorNote}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="detail-item hidden md:flex items-center gap-3 pt-1">
                <button
                  onClick={handleCompareToggle}
                  className={`flex-1 flex items-center justify-center gap-1.5 font-body text-sm px-6 py-3.5 rounded-full border transition-colors ${
                    comparing
                      ? "bg-[#f0ece8] text-[#0d0d0d] border-[#f0ece8]"
                      : "bg-transparent text-[#888] border-white/10 hover:border-white/30"
                  }`}
                >
                  {comparing ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {comparing ? "Added" : "Compare"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 font-body text-sm px-6 py-3.5 rounded-full bg-[#f0ece8] text-[#0d0d0d] hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" strokeWidth={1.5} /> Share
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 font-body text-sm px-6 py-3.5 rounded-full border border-white/10 text-[#888] hover:text-[#f0ece8] hover:border-white/30 transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" strokeWidth={1.5} /> Print Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <div
          ref={relatedRef}
          className="border-t border-white/5 bg-[#0d0d0d] pt-16 pb-20"
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#888] mb-2">
                  Related Specimens
                </p>
                <h2 className="font-display text-2xl font-medium text-[#f0ece8]">
                  Same Region
                </h2>
              </div>
              <Link
                to="/collection"
                className="hidden sm:flex items-center gap-1 font-body text-sm text-[#888] hover:text-[#f0ece8] transition-colors"
              >
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {relatedProducts.map((rp, i) => (
                <div key={rp.id} className="related-card">
                  <ProductCard product={rp} index={i} isVisible={true} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile sticky */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-[#141414] border-t border-white/5 px-4 py-3 md:hidden transition-transform duration-300 ${showMobileBar ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleCompareToggle}
            className={`flex items-center justify-center gap-1.5 font-body text-sm px-4 py-3 rounded-full border transition-colors ${
              comparing
                ? "bg-[#f0ece8] text-[#0d0d0d] border-[#f0ece8]"
                : "bg-transparent text-[#888] border-white/5"
            }`}
          >
            {comparing ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#f0ece8] text-[#0d0d0d] font-body text-sm py-3 rounded-full"
          >
            <Share2 className="w-4 h-4" strokeWidth={1.5} />
            Share Roll
          </button>
        </div>
      </div>
    </div>
  );
}

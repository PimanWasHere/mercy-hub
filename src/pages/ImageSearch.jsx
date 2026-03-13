import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Loader2, ImageOff, Globe, Image as ImageIcon } from "lucide-react";
import Navbar from "../components/search/Navbar";

export default function ImageSearch() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const doSearch = async (q) => {
    if (!q.trim()) return;
    setIsLoading(true);
    setImages([]);

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a list of 9 detailed image descriptions related to: "${q}". 
Each description should be specific enough to generate a unique image.
Return as JSON with an "images" array, each with "title" (short title) and "description" (detailed visual description for image generation).`,
      response_json_schema: {
        type: "object",
        properties: {
          images: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" }
              }
            }
          }
        }
      }
    });

    const imageList = res.images || [];
    setImages(imageList.map((img) => ({ ...img, url: null, loading: true })));

    // Generate images in parallel (3 at a time)
    for (let i = 0; i < imageList.length; i += 3) {
      const batch = imageList.slice(i, i + 3);
      const promises = batch.map((img) =>
        base44.integrations.Core.GenerateImage({ prompt: img.description })
      );
      const results = await Promise.all(promises);
      results.forEach((result, j) => {
        setImages((prev) => {
          const updated = [...prev];
          updated[i + j] = { ...updated[i + j], url: result.url, loading: false };
          return updated;
        });
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery);
    }
  }, []);

  const handleSearch = (q) => {
    setQuery(q);
    navigate(`/ImageSearch?q=${encodeURIComponent(q)}`, { replace: true });
    doSearch(q);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar showSearch searchQuery={query} onSearch={handleSearch} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-3">
          <button
            onClick={() => navigate(`/SearchResults?q=${encodeURIComponent(query)}&cat=all`)}
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-600 pb-1 px-1 transition-colors"
          >
            <Globe className="w-4 h-4" />
            Web
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-indigo-600 border-b-2 border-indigo-500 pb-1 px-1">
            <ImageIcon className="w-4 h-4" />
            Images
          </button>
        </div>

        {isLoading && images.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            <p className="text-sm text-gray-400">Generating images with AI...</p>
          </div>
        )}

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100"
              >
                {img.loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-300 animate-spin" />
                  </div>
                ) : img.url ? (
                  <>
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-white text-sm font-medium">{img.title}</p>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageOff className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && images.length === 0 && query && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <ImageOff className="w-12 h-12 text-gray-300" />
            <p className="text-gray-500">No images found. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, SearchX, Image, Globe } from "lucide-react";
import Navbar from "../components/search/Navbar";
import ResultCard from "../components/search/ResultCard";
import CategoryPills from "../components/search/CategoryPills";

export default function SearchResults() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("q") || "";
  const initialCat = urlParams.get("cat") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCat);
  const [results, setResults] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const doSearch = async (q, cat) => {
    if (!q || !q.trim()) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setResults([]);
    setAiSummary("");

    try {
      const catContext = cat !== "all" ? ` Focus on ${cat} related results.` : "";
      const prompt = `Search the web for: "${q}".${catContext}

Return a JSON object with:
- summary: a 2-3 sentence AI summary of the topic
- results: an array of 8 search results, each with:
  - title: result title
  - url: a plausible URL
  - snippet: a 2-3 sentence description`;

      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  url: { type: "string" },
                  snippet: { type: "string" }
                }
              }
            }
          }
        },
        model: "gemini_3_flash"
      });

      setAiSummary(res.summary || "");
      setResults(res.results || []);

      // Save to history
      base44.entities.SearchHistory.create({ query: q, category: cat }).catch(() => {});
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      doSearch(initialQuery, initialCat);
    }
  }, []);

  const handleSearch = (q) => {
    setQuery(q);
    navigate(`/SearchResults?q=${encodeURIComponent(q)}&cat=${category}`, { replace: true });
    doSearch(q, category);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (query) {
      navigate(`/SearchResults?q=${encodeURIComponent(query)}&cat=${cat}`, { replace: true });
      doSearch(query, cat);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar showSearch searchQuery={query} onSearch={handleSearch} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex items-center gap-6 mb-6 border-b border-gray-100">
          <button className="flex items-center gap-2 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-3 px-1 -mb-[2px]">
            <Globe className="w-4 h-4" />
            All
          </button>
          <button
            onClick={() => navigate(`/ImageSearch?q=${encodeURIComponent(query)}`)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 pb-3 px-1 transition-colors"
          >
            <Image className="w-4 h-4" />
            Images
          </button>
          <CategoryPills active={category} onSelect={handleCategoryChange} compact />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-100" />
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin absolute inset-0" />
            </div>
            <p className="text-sm text-gray-400">Searching with AI...</p>
          </div>
        )}

        {/* AI Summary */}
        <AnimatePresence>
          {aiSummary && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-r from-indigo-50/80 to-violet-50/80 backdrop-blur-xl border border-indigo-100/50 rounded-xl p-5 mb-6"
            >
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">AI Summary</p>
              <p className="text-sm text-gray-700 leading-relaxed">{aiSummary}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {!isLoading && results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, i) => (
              <ResultCard key={i} result={result} index={i} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && results.length === 0 && query && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <SearchX className="w-12 h-12 text-gray-300" />
            <p className="text-gray-500">No results found. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
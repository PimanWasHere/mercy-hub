import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Link as LinkIcon, Image, Video, Loader2, Search, AlertCircle, X } from "lucide-react";
import Navbar from "../components/search/Navbar";
import ResultCard from "../components/search/ResultCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ReverseSearch() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [urlInput, setUrlInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [error, setError] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setUrlInput("");
    setError("");

    const reader = new FileReader();
    reader.onload = (e) => setFilePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    setFilePreview(urlInput);
    setUploadedFile(null);
    setError("");
  };

  const clearSelection = () => {
    setUploadedFile(null);
    setFilePreview(null);
    setUrlInput("");
    setResults([]);
    setAiAnalysis("");
    setError("");
  };

  const analyzeMedia = async () => {
    setIsAnalyzing(true);
    setError("");
    setResults([]);
    setAiAnalysis("");

    try {
      let fileUrl = filePreview;

      // Upload file if it's a local upload
      if (uploadedFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: uploadedFile });
        fileUrl = file_url;
      }

      // Analyze with AI
      const analysisRes = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this image/video and describe what you see in detail. Then suggest 8 search queries that would help find similar content, related information, or identify what's in the media.

Return JSON with:
- description: detailed description of what you see (2-3 sentences)
- media_type: "image" or "video"
- key_elements: array of main subjects/objects/themes
- search_queries: array of 8 search query strings`,
        file_urls: [fileUrl],
        response_json_schema: {
          type: "object",
          properties: {
            description: { type: "string" },
            media_type: { type: "string" },
            key_elements: { type: "array", items: { type: "string" } },
            search_queries: { type: "array", items: { type: "string" } }
          }
        }
      });

      setAiAnalysis(analysisRes.description || "");

      // Search for similar content using the queries
      const searchPromises = analysisRes.search_queries.slice(0, 3).map((query) =>
        base44.integrations.Core.InvokeLLM({
          prompt: `Search the web for: "${query}". Return 3 relevant results.

Return JSON with a "results" array, each with:
- title: result title
- url: a plausible URL
- snippet: description`,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
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
        })
      );

      const searchResults = await Promise.all(searchPromises);
      const allResults = searchResults.flatMap((res) => res.results || []);
      setResults(allResults);
    } catch (err) {
      setError("Failed to analyze media. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar showSearch searchQuery="" onSearch={(q) => navigate(`/SearchResults?q=${encodeURIComponent(q)}&cat=all`)} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reverse Image & Video Search</h1>
          <p className="text-gray-500">Upload or paste a URL to find similar content with AI</p>
        </motion.div>

        {/* Upload Area */}
        {!filePreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border-2 border-dashed border-gray-200 p-12"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
                  <Image className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center">
                  <Video className="w-8 h-8 text-violet-600" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Upload or paste a URL</h3>
                <p className="text-sm text-gray-500">Supported: Images and Videos</p>
              </div>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-violet-600 transition-all shadow-lg shadow-indigo-200/50">
                  <Upload className="w-4 h-4" />
                  Choose File
                </div>
              </label>

              <div className="flex items-center gap-3 w-full max-w-md">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-sm text-gray-400">or</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              <div className="flex gap-2 w-full max-w-md">
                <Input
                  placeholder="Paste image or video URL..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleUrlSubmit()}
                />
                <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
                  <LinkIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Preview & Analysis */}
        {filePreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Preview Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Media Preview</h3>
                <button
                  onClick={clearSelection}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="relative rounded-xl overflow-hidden bg-gray-100 max-h-96">
                {uploadedFile?.type.startsWith("video") ? (
                  <video src={filePreview} controls className="w-full h-auto" />
                ) : (
                  <img src={filePreview} alt="Preview" className="w-full h-auto object-contain" />
                )}
              </div>
              <Button
                onClick={analyzeMedia}
                disabled={isAnalyzing}
                className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Similar Content
                  </>
                )}
              </Button>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* AI Analysis */}
            <AnimatePresence>
              {aiAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-indigo-50/80 to-violet-50/80 backdrop-blur-xl border border-indigo-100/50 rounded-xl p-5"
                >
                  <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">AI Analysis</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{aiAnalysis}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Similar Content & Related Information</h3>
                {results.map((result, i) => (
                  <ResultCard key={i} result={result} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
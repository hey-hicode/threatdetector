"use client";

import { useState } from "react";
import { Search, Shield, ShieldCheck, ShieldAlert, ShieldQuestion, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type ResultType = "safe" | "phishing" | "suspicious" | null;

interface AnalysisResult {
    id: string;
    type: ResultType;
    score: number;
    message: string;
}

interface DetectorCardProps {
    variant?: "default" | "dark";
}

export default function DetectorCard({ variant = "default" }: DetectorCardProps) {
    const router = useRouter();
    const [url, setUrl] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const isDark = variant === "dark";

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setIsAnalyzing(true);
        setResult(null);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                throw new Error("Analysis failed");
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error(error);
            setResult({
                id: "error",
                type: "suspicious",
                score: 0,
                message: "An error occurred during analysis. Please try again.",
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="w-full mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl md:p-8 p-4 transition-all ${isDark
                    ? "bg-secondary/40 border border-white/10 shadow-2xl backdrop-blur-md"
                    : "bg-white border border-primary/10 shadow-xl"
                    }`}
            >
                <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className={`h-5 w-5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />
                        </div>
                        <input
                            type="text"
                            placeholder="Paste your link here..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className={`w-full pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 transition-all outline-none ${isDark
                                ? "bg-secondary border border-white/10 text-white focus:ring-primary/40 focus:border-primary"
                                : "bg-zinc-50 border border-border text-foreground focus:ring-primary/20 focus:border-primary"
                                }`}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isAnalyzing || !url}
                        className={`md:w-auto px-8 py-4 rounded-md font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDark
                            ? "bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20"
                            : "bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20"
                            }`}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Scanning...</span>
                            </>
                        ) : (
                            <>
                                <span>Check Link</span>
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>

                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            key="initial"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-6 text-center"
                        >
                            {!isDark && (
                                <div className="bg-zinc-50/50 rounded-2xl p-4 border border-dashed border-zinc-200">
                                    <p className="text-xs text-zinc-400 font-medium">
                                        Advanced PhishGuard heuristics will analyze domain age, SSL status, and threat markers.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ) : result.id === "error" ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6"
                        >
                            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-3">
                                <ShieldQuestion className="h-5 w-5 flex-shrink-0" />
                                <p className="text-sm font-semibold">{result.message}</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6"
                        >
                            <div className={`p-6 rounded-2xl flex  justify-between gap-4 ${result.type === "safe" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                                result.type === "phishing" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" :
                                    "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                                }`}>
                                <div className="flex  gap-3">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        {result.type === "safe" && <ShieldCheck className="h-5 w-5" />}
                                        {result.type === "phishing" && <ShieldAlert className="h-5 w-5" />}
                                        {result.type !== "safe" && result.type !== "phishing" && <ShieldQuestion className="h-5 w-5" />}
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <h3 className="font-bold text-sm  text-start text-right capitalize">{result.type || "Unknown"} Result</h3>
                                        <p className="text-xs opacity-80 text-start text-right line-clamp-1">{result.message}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push(`/analyze/${result.id}?data=${encodeURIComponent(JSON.stringify(result))}`)}
                                    className="px-4 py-2 bg-white text-zinc-900 text-xs font-bold rounded-xl hover:bg-zinc-50 transition-colors flex-shrink-0"
                                >
                                    Full Report
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

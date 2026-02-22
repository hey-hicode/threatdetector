"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
    Shield,
    ShieldCheck,
    ShieldAlert,
    ShieldQuestion,
    Globe,
    Server,
    Lock,
    AlertTriangle,
    CheckCircle2,
    ArrowLeft,
    Clock,
    FileSearch,
    UserCheck,
    Fingerprint,
    Activity,
    Network,
    Database,
    Mail
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnalysisPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const rawData = searchParams.get("data");
        if (rawData) {
            try {
                setData(JSON.parse(decodeURIComponent(rawData)));
            } catch (e) {
                console.error("Failed to parse analysis data", e);
            }
        }
    }, [searchParams]);

    if (!data) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <nav className="bg-white border-b border-border px-6 py-4">
                    <div className="max-w-5xl mx-auto flex justify-between items-center">
                        <button
                            onClick={() => router.push("/")}
                            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Return Home
                        </button>
                    </div>
                </nav>
                <div className="flex-1 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-sm"
                    >
                        <div className="mb-8 relative inline-block">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                            <div className="relative bg-white p-8 rounded-[2rem] shadow-xl border border-primary/10">
                                <FileSearch className="h-12 w-12 text-primary mx-auto" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-3">No Report Data</h2>
                        <p className="text-muted-foreground mb-8 leading-relaxed">
                            We couldn't find the analysis report for this request. Try scanning the URL again from the dashboard.
                        </p>
                        <button
                            onClick={() => router.push("/")}
                            className="w-full bg-secondary text-white font-bold py-4 rounded-2xl hover:brightness-110 transition-all"
                        >
                            Go to Scanner
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    const isSafe = data.type === "safe";
    const isPhishing = data.type === "phishing";
    const isUnknown = !isSafe && !isPhishing;

    return (
        <main className="min-h-screen bg-zinc-50/50 pb-20">
            {/* Header / Nav */}
            <nav className="bg-white border-b border-border px-6 py-6 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-base font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Detector
                    </button>
                    <div className="flex items-center text-base font-semibold gap-2">
                        Report
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-3 md:px-6 pt-20">
                {/* Hero Risk Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={` md:p-8 p-4 md:mb-6 mb-4 flex flex-col md:flex-row items-center gap-8 border-l-4 shadow-xl text-black ${isSafe ? "border-emerald-600" :
                        isPhishing ? "border-rose-600" :
                            "border-secondary"
                        }`}
                >
                    <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-sm">

                    </div>
                    <div className="md:flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full text-xs font-medium mb-4">
                            REPORT ID: {data.id}
                        </div>
                        <h1 className="md:text-4xl text-2xl font-bold mb-2 uppercase tracking-tight">
                            {isUnknown ? "Inconclusive Result" : `${data.type} Detected`}
                        </h1>
                        <p className="md:text-md text-sm opacity-90 font-normal max-w-2xl leading-relaxed">
                            {data.message}
                        </p>
                    </div>
                    <div className="text-center px-8 border-l border-white/20 hidden lg:block">
                        <div className={`text-5xl font-black mb-1 ${isSafe ? "text-emerald-600" :
                            isPhishing ? "text-rose-600" :
                                "text-secondary"
                            }`}>{data.score}%</div>
                        <div className="text-xs font-bold tracking-widest uppercase opacity-70 text-nowrap">Risk Score</div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 pt-10 md:grid-cols-3 gap-8">
                    {/* Technical Metadata */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-2 space-y-8"
                    >
                        <section className="bg-white rounded-sm p-8 shadow-sm border border-border">
                            <h2 className="text-xl font-medium text-foreground mb-6">
                                Domain Intelligence
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Analyzed URL</label>
                                        <p className="font-mono text-xs text-primary font-bold break-all">{data.url}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Registrar</label>
                                        <p className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                                            {data.details?.registrar || "Unknown"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Registration Date</label>
                                        <p className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <Database className="h-4 w-4 text-muted-foreground" />
                                            {data.details?.creationDate || "N/A"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Expiry Date</label>
                                        <p className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            {data.details?.expiryDate || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Host IP Address</label>
                                        <p className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <Fingerprint className="h-4 w-4 text-muted-foreground" />
                                            {data.details?.ipAddress || "Unknown"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Network (ASN)</label>
                                        <p className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-muted-foreground" />
                                            {data.details?.asn || "N/A"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Hosting Provider</label>
                                        <p className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <Server className="h-4 w-4 text-muted-foreground" />
                                            {data.details?.hostingProvider || data.details?.serverLocation || "N/A"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">SSL Status</label>
                                        <p className="text-sm font-bold text-foreground flex items-center gap-2">
                                            <Lock className={`h-4 w-4 ${data.details?.sslStatus?.toLowerCase().includes("valid") ? "text-emerald-500" : "text-amber-500"}`} />
                                            {data.details?.sslStatus || "Standard"}
                                        </p>
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-4 border-t border-dashed border-border grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Name Servers</label>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {data.details?.nameServers?.map((ns: string, i: number) => (
                                                <span key={i} className="px-2 py-0.5 bg-muted rounded font-mono text-[10px] text-muted-foreground">
                                                    {ns}
                                                </span>
                                            )) || <p className="text-xs text-muted-foreground">None identified</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Mail Servers (MX)</label>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {data.details?.mxRecords?.map((mx: string, i: number) => (
                                                <span key={i} className="px-2 py-0.5 bg-muted rounded font-mono text-[10px] text-muted-foreground">
                                                    {mx}
                                                </span>
                                            )) || <p className="text-xs text-muted-foreground">None identified</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-sm p-8 shadow-sm border border-border">
                            <h2 className="text-xl font-medium text-foreground mb-6">
                                Threat Breakdown
                            </h2>
                            <ul className="space-y-4">
                                {data.details?.threats?.length > 0 ? (
                                    data.details.threats.map((threat: string, i: number) => (
                                        <li key={i} className="flex items-center gap-4 p-4 bg-muted/50 rounded-md border border-border">
                                            <div className="mt-1">
                                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                            </div>
                                            <p className="text-foreground/80 text-sm font-medium leading-relaxed">{threat}</p>
                                        </li>
                                    ))
                                ) : (
                                    <li className="flex items-center gap-4 p-8 bg-emerald-50/50 rounded-md border border-emerald-100/50">

                                        <div>
                                            <p className="text-black font-bold">No threats detected</p>
                                            <p className="text-black/70 text-sm">Our heuristics didn't find any common phishing patterns in this URL.</p>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </section>
                    </motion.div>

                    {/* Sidebar: Recommendations */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <section className="bg-secondary text-white rounded-md p-8 shadow-xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Next Steps
                            </h2>
                            <ul className="space-y-6">
                                {data.details?.recommendations?.map((rec: string, i: number) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-primary">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm text-white/70 font-medium leading-relaxed">{rec}</p>
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full mt-8 bg-primary hover:brightness-110 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-primary/20">
                                Block this domain
                            </button>
                        </section>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-border text-center">
                            <div className="p-4 bg-muted rounded-2xl mb-4 inline-block">
                                <Clock className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="font-bold text-foreground mb-2">Continuous Protection</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Our threat intelligence network is updated every 15 minutes to capture new campaigns.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

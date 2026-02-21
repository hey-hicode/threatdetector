"use client";

import DetectorCard from "@/components/DetectorCard";
import SplitText from "@/components/SplitText";
import Marquee from "@/components/Marquee";
import {
  Shield,
  Lock,
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
  Globe,
  Server,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  MousePointer2
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-white text-foreground selection:bg-primary/30 scroll-smooth">
      {/* Navbar */}
      <motion.nav
        initial="top"
        animate={scrolled ? "scrolled" : "top"}
        variants={{
          top: {
            width: "100%",
            maxWidth: "100%",
            top: 0,
            borderRadius: 0,
            marginTop: 0,
            paddingLeft: "2rem",
            paddingRight: "2rem",
            paddingTop: "1.5rem",
            paddingBottom: "1.5rem",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderBottomWidth: "1px",
            borderColor: "rgba(229, 231, 235, 1)", // Soft Gray
            boxShadow: "0 0 0 rgba(0,0,0,0)",
          },
          scrolled: {
            width: "calc(100% - 3rem)",
            maxWidth: "1152px", // 6xl
            top: 24, // 1.5rem
            borderRadius: "2rem",
            marginTop: 0,
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
            paddingTop: "1rem",
            paddingBottom: "1rem",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderBottomWidth: "1px",
            borderLeftWidth: "1px",
            borderRightWidth: "1px",
            borderTopWidth: "1px",
            borderColor: "rgba(229, 231, 235, 0.5)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          }
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="fixed left-0 right-0 z-50 backdrop-blur-xl mx-auto"
      >
        <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="md:text-xl text-sm font-black tracking-tighter uppercase text-foreground">PhishX</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollToSection("unmask")}
              className="bg-primary text-white px-6 py-3 rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
            >
              Check Link
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10"
          >


            <div className="md:mb-8 mb-4">
              <SplitText
                text="PHISHING GUARD"
                className="text-4xl lg:text-[4rem] font-black leading-[1] tracking-tight text-zinc-900"
                delay={30}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                textAlign="left"
              />

              <SplitText
                text="FOR INTERNET SAFETY"
                className="text-3xl lg:text-5xl font-black leading-[1.2] tracking-tight text-muted-foreground/60"
                delay={600}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                textAlign="left"
              />
            </div>

            <p className="text-base text-muted-foreground max-w-lg md:mb-12 mb-6 leading-relaxed font-medium">
              A military-grade security engine that unmasks deceptive links,
              malicious domains, and credential harvesters in milliseconds.
            </p>

            {/* Social Proof Alt */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-12 h-12 rounded-full border-4 border-white bg-zinc-200 overflow-hidden`}>
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-primary">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-xs font-bold text-zinc-400 mt-1">Trusted by 5,000+ Safety Experts</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            {/* Main Preview Card */}
            <div className="shadow-md rounded-md p-4 md:p-8 border-white/40">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">

                  <span className="font-black font-medium text-sm tracking-tight">ANALYSIS PREVIEW</span>
                </div>
                <div className="text-xs font-mono font-medium text-zinc-400">UPDATED 1M AGO</div>
              </div>

              <div className="space-y-6">
                {/* Fake Live Card 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-5 rounded-md shadow-sm border border-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted rounded-2xl">
                      <Globe className="md:h-6 md:w-6 h-3 w-3 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-black text-xs md:text-sm break-all">paypal-verify-secure.com</h4>
                      <p className="text-[10px] font-bold text-rose-500 uppercase">Phishing Attempt</p>
                    </div>
                  </div>
                  <div className="text-rose-500 font-black text-sm md:text-xl">98%</div>
                </motion.div>

                {/* Fake Live Card 2 */}
                <div className="bg-white p-5 rounded-md shadow-sm border border-zinc-100 flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-50 rounded-2xl">
                      <Server className="md:h-6 md:w-6 h-3 w-3 text-zinc-400" />
                    </div>
                    <div>
                      <h4 className="font-black text-xs md:text-sm">amazon.security.co.uk</h4>
                      <p className="text-[10px] font-bold text-emerald-500">SECURE DOMAIN</p>
                    </div>
                  </div>
                  <div className="text-emerald-500 font-black text-sm md:text-xl">2%</div>
                </div>
              </div>

              {/* Overlapping floating icon */}
              <div className="absolute -bottom-6 -right-6 bg-primary p-6 rounded-3xl shadow-2xl text-white">
                <MousePointer2 className="h-4 w-4" />
              </div>
            </div>

            {/* Background Decorative Blobs */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-3xl rounded-full" />
          </motion.div>

        </div>
      </section>

      {/* Marquee Section */}
      <Marquee
        items={[
          "Real-time Threat Analysis",
          "Zero-Day Protection",
          "PhishGuard AI Engine v4.0",
          "Malicious URL Isolation",
          "Military Grade Security",
          "Instant Risk Scoring"
        ]}
        className="md:my-12 my-6"
      />

      {/* Main Scan Section (Deep Navy) */}
      <section id="unmask" className="bg-secondary md:pt-32 pt-20 md:pb-40 pb-20 px-6 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-2xl lg:text-5xl font-black text-white mb-4 tracking-tighter">
            UNMASK YOUR LINKS NOW
          </h2>
          <p className="text-white/60 text-sm md:text-lg mb-16 max-w-2xl mx-auto font-medium">
            Protect your digital identity. Submit any suspicious URL and let our intelligence
            engine perform a live security audit.
          </p>

          <div className="max-w-3xl mx-auto">
            <DetectorCard variant="dark" />
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className=" ">
        <div className="max-w-7xl mx-auto">


          <div className="text-center py-10">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Developed by <span className="text-foreground border-b-2 border-primary font-black">King Davies</span> • © 2026 PhishGuard
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

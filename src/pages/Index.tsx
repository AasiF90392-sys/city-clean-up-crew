import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, CheckCircle, Clock, Target, ClipboardList, Search, Brain, BarChart3, MapPin, ShieldCheck, Zap, Trash2, AlertTriangle, Droplets, Building, TreePine, Star } from "lucide-react";
import beforeImg from "@/assets/before-cleanup.jpg";
import afterImg from "@/assets/after-cleanup.jpg";

const stats = [
  { icon: TrendingUp, value: "4", label: "Total Complaints", color: "text-info" },
  { icon: CheckCircle, value: "0", label: "Resolved", color: "text-primary" },
  { icon: Clock, value: "4", label: "Pending", color: "text-warning" },
  { icon: Target, value: "24h", label: "Avg Resolution", color: "text-destructive" },
];

const steps = [
  { num: "01", title: "Register Complaint", desc: "Fill the form with details, upload photo & location. Get unique complaint ID instantly." },
  { num: "02", title: "AI Analyzes & Routes", desc: "Our AI categorizes, suggests solutions, and routes to the right department automatically." },
  { num: "03", title: "Track & Resolve", desc: "Track real-time progress with timeline updates. Get notified when resolved." },
];

const features = [
  { icon: Brain, title: "AI Complaint Classification", desc: "Automatic categorization of complaints using AI for faster routing and resolution." },
  { icon: BarChart3, title: "Real-time Tracking", desc: "Track your complaint status in real-time from submission to resolution." },
  { icon: MapPin, title: "Location Based Reporting", desc: "Pinpoint exact locations on map for accurate complaint reporting." },
  { icon: ShieldCheck, title: "Verified Complaint System", desc: "Photo & location verified complaints ensure genuine reports." },
  { icon: Zap, title: "Smart Dashboard Analytics", desc: "Comprehensive analytics dashboard for monitoring city cleanliness." },
  { icon: Clock, title: "Fast Response System", desc: "Priority-based routing ensures fastest possible response times." },
];

const categories = [
  { icon: Trash2, title: "Kachra Uthane ki Complaint", desc: "Garbage collection and disposal related issues" },
  { icon: AlertTriangle, title: "Nali Block Complaint", desc: "Blocked drains and sewage overflow problems" },
  { icon: TreePine, title: "Road Safai Complaint", desc: "Street and road cleaning related complaints" },
  { icon: Building, title: "Public Toilet Issue", desc: "Public toilet maintenance and hygiene issues" },
  { icon: Droplets, title: "Pani Bharne ki Problem", desc: "Water logging and drainage problems" },
  { icon: Trash2, title: "Illegal Garbage Dumping", desc: "Report unauthorized waste disposal sites" },
];

const testimonials = [
  { text: "Complaint registered at 9 AM, resolved by evening! This AI system is amazing.", name: "Rajesh Kumar", city: "Lucknow" },
  { text: "Finally a portal that actually works. Got SMS update when my drainage issue was fixed.", name: "Sunita Devi", city: "Varanasi" },
  { text: "The AI suggested solution within seconds. Ward officer visited same day. Highly recommended!", name: "Amit Sharma", city: "Kanpur" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent to-background py-20 md:py-28">
        <div className="container text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium text-primary">
            🚀 AI-Powered Smart Solution
          </div>
          <h1 className="mx-auto max-w-4xl font-heading text-3xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
            Report Problems, Track Progress, Build a Cleaner City with AI
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
            AI-powered municipal complaint system — Register, track, and resolve sanitation issues in your city with smart technology.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/complaint"><ClipboardList className="mr-2 h-5 w-5" /> Register Complaint</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/track"><Search className="mr-2 h-5 w-5" /> Track Complaint</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border bg-card p-5 shadow-sm">
                <s.icon className={`mx-auto h-6 w-6 ${s.color}`} />
                <p className="mt-2 font-heading text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <p className="text-center text-sm font-semibold text-primary">Powered by AI</p>
          <h2 className="mt-2 text-center font-heading text-3xl font-bold">How It Works</h2>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.num} className="rounded-xl border bg-card p-6 text-center shadow-sm">
                <span className="font-heading text-4xl font-extrabold text-primary/20">{s.num}</span>
                <h3 className="mt-2 font-heading text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After */}
      <section className="bg-muted py-20">
        <div className="container">
          <p className="text-center text-sm font-semibold text-primary">✨ Real Impact</p>
          <h2 className="mt-2 text-center font-heading text-3xl font-bold">Safai Ka Asar — Before & After</h2>
          <p className="mt-2 text-center text-muted-foreground">Dekhiye kaise humari AI-powered system se shehar ki safai me fark aaya hai</p>
          <div className="mx-auto mt-10 grid max-w-4xl gap-8 md:grid-cols-2">
            <div className="overflow-hidden rounded-xl border shadow-sm">
              <div className="bg-destructive/10 px-4 py-2 text-center font-semibold text-destructive">❌ Safai Se Pehle</div>
              <img src={beforeImg} alt="Safai se pehle - gandi sadak" className="w-full object-cover" width={800} height={600} />
              <p className="p-4 text-center text-sm text-muted-foreground">Kachra, gandagi, band nali — logon ki shikayat</p>
            </div>
            <div className="overflow-hidden rounded-xl border shadow-sm">
              <div className="bg-primary/10 px-4 py-2 text-center font-semibold text-primary">✅ Safai Ke Baad</div>
              <img src={afterImg} alt="Safai ke baad - saaf sadak" className="w-full object-cover" loading="lazy" width={800} height={600} />
              <p className="p-4 text-center text-sm text-muted-foreground">Saaf sadak, khuli nali, swachh shehar — AI solution se</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-center font-heading text-3xl font-bold">Powerful Features</h2>
          <p className="mt-2 text-center text-muted-foreground">Advanced AI-powered tools to make your city cleaner and more efficient.</p>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border bg-card p-6 shadow-sm">
                <f.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-3 font-heading font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-muted py-20">
        <div className="container">
          <h2 className="text-center font-heading text-3xl font-bold">Complaint Categories</h2>
          <p className="mt-2 text-center text-muted-foreground">Select the type of complaint to register — we'll route it to the right department.</p>
          <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.title}
                to={`/complaint?type=${encodeURIComponent(c.title)}`}
                className="flex items-start gap-4 rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <c.icon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                <div>
                  <h3 className="font-heading font-bold text-sm">{c.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild><Link to="/complaint">Register Any Complaint</Link></Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-center font-heading text-3xl font-bold">What Citizens Say</h2>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex gap-1 text-warning">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-3 text-sm italic text-muted-foreground">"{t.text}"</p>
                <p className="mt-4 font-heading text-sm font-bold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

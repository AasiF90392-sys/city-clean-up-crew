import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lightbulb, Recycle, Droplets, TreePine } from "lucide-react";

const tips = [
  { icon: Recycle, title: "Waste Segregation", desc: "Separate wet and dry waste at home. Use green bins for biodegradable and blue for recyclable waste." },
  { icon: Droplets, title: "Water Conservation", desc: "Fix leaking taps, use bucket instead of hose for washing. Every drop counts for a cleaner city." },
  { icon: TreePine, title: "Go Green", desc: "Plant trees in your locality. Participate in city plantation drives organized by Nagar Nigam." },
  { icon: Lightbulb, title: "Report & Act", desc: "Don't ignore garbage dumps. Register complaints on our portal and help keep your area clean." },
];

const AwarenessPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-12">
        <h1 className="font-heading text-2xl font-bold">Awareness</h1>
        <p className="mb-10 text-muted-foreground">Learn how you can contribute to a cleaner, healthier city.</p>

        {/* Tips */}
        <section>
          <h2 className="font-heading text-xl font-bold mb-6">Cleanliness Tips</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tips.map((t) => (
              <div key={t.title} className="rounded-xl border bg-card p-6 shadow-sm">
                <t.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-3 font-heading font-bold">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Swachh Bharat info */}
        <section className="mt-16 rounded-xl bg-accent p-8">
          <h2 className="font-heading text-xl font-bold">Swachh Bharat Mission</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            The Swachh Bharat Mission is a nationwide campaign to clean up streets, roads, and infrastructure of India's cities and rural areas. 
            Our AI-powered complaint system supports this mission by enabling citizens to report sanitation issues quickly and track their resolution efficiently.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Together, we can build a cleaner, healthier India. Every complaint you register helps improve sanitation services in your neighborhood.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AwarenessPage;

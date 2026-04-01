import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

const ContactPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully!");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-12">
        <h1 className="font-heading text-2xl font-bold">Contact Us</h1>
        <p className="mb-10 text-muted-foreground">Get in touch with our support team.</p>

        <div className="grid gap-10 lg:grid-cols-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Name</Label>
              <Input placeholder="Your name" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="Your email" />
            </div>
            <div>
              <Label>Subject</Label>
              <Input placeholder="Subject" />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea placeholder="Your message..." rows={5} />
            </div>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>

          <div className="space-y-6">
            <h2 className="font-heading text-lg font-bold">Contact Information</h2>
            {[
              { icon: Phone, title: "Helpline", detail: "1800-XXX-XXXX (Toll Free, 24x7)" },
              { icon: Mail, title: "Email", detail: "support@smartsafai.gov.in" },
              { icon: MapPin, title: "Address", detail: "Nagar Nigam Office, Smart City, Uttar Pradesh, India" },
              { icon: Clock, title: "Working Hours", detail: "Mon-Sat: 9:00 AM - 6:00 PM" },
            ].map((c) => (
              <div key={c.title} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;

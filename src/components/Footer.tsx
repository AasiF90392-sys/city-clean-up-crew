import { Link } from "react-router-dom";
import { Phone, Mail, Clock, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-foreground text-background">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">⚡</span>
              </div>
              <span className="font-heading font-bold">Smart Safai</span>
            </div>
            <p className="text-sm opacity-70">
              AI-powered cleanliness complaint and monitoring system for smarter cities. A Government of India initiative.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/" className="hover:opacity-100">Home</Link></li>
              <li><Link to="/dashboard" className="hover:opacity-100">Dashboard</Link></li>
              <li><Link to="/awareness" className="hover:opacity-100">Awareness</Link></li>
              <li><Link to="/contact" className="hover:opacity-100">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/complaint" className="hover:opacity-100">Register Complaint</Link></li>
              <li><Link to="/track" className="hover:opacity-100">Track Complaint</Link></li>
              <li><Link to="/admin-login" className="hover:opacity-100">Admin Panel</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-3">Contact & Helpline</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> <div><p className="font-semibold opacity-100">Helpline: 1800-XXX-XXXX</p><p className="text-xs">Toll Free (24x7)</p></div></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@smartsafai.gov.in</li>
              <li className="flex items-center gap-2"><Clock className="h-4 w-4" /> Mon-Sat: 9:00 AM - 6:00 PM</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> <div>Nagar Nigam Office, Smart City<br/>Uttar Pradesh, India</div></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-background/20 pt-6 text-center text-sm opacity-50">
          © 2026 Smart Safai — Nagar Nigam, Smart City. All rights reserved. | Powered by AI
        </div>
      </div>
    </footer>
  );
};

export default Footer;

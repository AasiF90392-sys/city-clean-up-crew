import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardList, Menu, X } from "lucide-react";
import { useState } from "react";
import DarkModeToggle from "@/components/DarkModeToggle";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Register Complaint", to: "/complaint" },
  { label: "Track Complaint", to: "/track" },
  { label: "Awareness", to: "/awareness" },
  { label: "Store", to: "/store" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">⚡</span>
          </div>
          <div>
            <p className="font-heading text-sm font-bold leading-tight">Spark Clean City</p>
            <p className="text-[10px] text-muted-foreground">AI Smart Complaint System</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <DarkModeToggle />
          <Link to="/admin-login" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            Admin
          </Link>
          <Button asChild>
            <Link to="/complaint">
              <ClipboardList className="mr-2 h-4 w-4" />
              Register Complaint
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <DarkModeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-background px-4 pb-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                location.pathname === link.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/admin-login"
            onClick={() => setMobileOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground"
          >
            Admin
          </Link>
          <Button asChild className="mt-2 w-full">
            <Link to="/complaint" onClick={() => setMobileOpen(false)}>
              Register Complaint
            </Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

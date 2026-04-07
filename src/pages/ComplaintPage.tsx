import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, MapPin, Camera, Sparkles, AlertTriangle, Brain, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const categories = [
  "Kachra Uthane ki Complaint",
  "Nali Block Complaint",
  "Road Safai Complaint",
  "Public Toilet Issue",
  "Pani Bharne ki Problem",
  "Illegal Garbage Dumping",
  "Other",
];

const categoryKeywords: Record<string, string[]> = {
  "Kachra Uthane ki Complaint": ["kachra", "garbage", "kuda", "waste", "kachara", "safai"],
  "Nali Block Complaint": ["nali", "drain", "block", "naali", "sewer", "gutter"],
  "Road Safai Complaint": ["road", "sadak", "sarak", "ganda", "dirty road"],
  "Public Toilet Issue": ["toilet", "bathroom", "shauchalay", "washroom"],
  "Pani Bharne ki Problem": ["pani", "water", "paani", "supply", "tanker"],
  "Illegal Garbage Dumping": ["dump", "illegal", "phenk", "fek", "dumping"],
};

const priorityKeywords = {
  high: ["dead animal", "mara hua", "hospital", "school", "emergency", "urgent", "bahut", "bohot", "infection", "bimar", "disease"],
  medium: ["dustbin", "full", "bharaa", "overflow", "roz", "daily"],
  low: ["normal", "cleaning", "safai", "thoda"],
};

function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((k) => lower.includes(k))) return cat;
  }
  return "";
}

function detectPriority(text: string): "high" | "medium" | "low" {
  const lower = text.toLowerCase();
  if (priorityKeywords.high.some((k) => lower.includes(k))) return "high";
  if (priorityKeywords.medium.some((k) => lower.includes(k))) return "medium";
  return "low";
}

function getDepartment(cat: string): string {
  const map: Record<string, string> = {
    "Kachra Uthane ki Complaint": "Cleaning Team - Nagar Nigam",
    "Nali Block Complaint": "Drainage Department",
    "Road Safai Complaint": "Road Cleaning Division",
    "Public Toilet Issue": "Sanitation Department",
    "Pani Bharne ki Problem": "Water Supply Department",
    "Illegal Garbage Dumping": "Enforcement & Cleaning Team",
    "Other": "General Complaint Cell",
  };
  return map[cat] || "General Complaint Cell";
}

function improveComplaint(text: string): string {
  if (text.length < 10) return text;
  const improved = text.charAt(0).toUpperCase() + text.slice(1);
  const suffix = ". Kripya jaldi se jaldi is samasya ka samadhan karein. Yeh area ke logon ko pareshani ho rahi hai.";
  return improved.replace(/\.$/, "") + suffix;
}

function getAISolution(cat: string): string {
  const solutions: Record<string, string> = {
    "Kachra Uthane ki Complaint": "📌 Aapki complaint ka possible solution: Nagar Nigam cleaning team ko notify kiya jayega. Usually 24 ghante mein kachra uthaya jata hai.",
    "Nali Block Complaint": "📌 Nali block ki complaint drainage department ko bheji jayegi. Technician 48 ghante mein visit karenge.",
    "Road Safai Complaint": "📌 Road safai ki complaint registered. Sweeping team ko assign kiya jayega. Expected time: 24 hours.",
    "Public Toilet Issue": "📌 Public toilet complaint sanitation department ko forward ki jayegi. Inspection 24 ghante mein.",
    "Pani Bharne ki Problem": "📌 Water supply complaint registered. Water tanker ya pipeline repair team ko inform kiya jayega.",
    "Illegal Garbage Dumping": "📌 Illegal dumping ki complaint enforcement team ko bheji jayegi. Action 48 ghante mein liya jayega.",
    "Other": "📌 Aapki complaint general complaint cell ko bheji jayegi. Jaldi se jaldi action liya jayega.",
  };
  return solutions[cat] || solutions["Other"];
}

function getEstimatedTime(priority: string): string {
  if (priority === "high") return "12-24 hours (Urgent)";
  if (priority === "medium") return "24-48 hours";
  return "48-72 hours";
}

const priorityLabels = { high: "🔴 High Priority", medium: "🟡 Medium Priority", low: "🟢 Low Priority" };

const ComplaintPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedType = searchParams.get("type") || "";
  const [category, setCategory] = useState(preselectedType);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiPriority, setAiPriority] = useState<"high" | "medium" | "low">("low");
  const [aiDepartment, setAiDepartment] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [successAiSolution, setSuccessAiSolution] = useState("");
  const [successDepartment, setSuccessDepartment] = useState("");
  const [successPriority, setSuccessPriority] = useState("");

  // Location state
  const [location, setLocation] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  // Photo state
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);

  useEffect(() => {
    if (description.length > 5) {
      const detected = detectCategory(description);
      if (detected && !category) setCategory(detected);
      const pri = isUrgent ? "high" : detectPriority(description);
      setAiPriority(pri);
      const cat = detected || category;
      if (cat) {
        setAiDepartment(getDepartment(cat));
        setAiSuggestion(getAISolution(cat));
        setEstimatedTime(getEstimatedTime(pri));
      }
    } else {
      setAiSuggestion("");
      setAiDepartment("");
    }
  }, [description, category, isUrgent]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Aapka browser location support nahi karta");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": "hi,en" } }
          );
          const data = await res.json();
          setLocation(data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          toast.success("📍 Location detect ho gayi!");
        } catch {
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          toast.success("📍 GPS coordinates mil gaye!");
        }
        setLocationLoading(false);
      },
      (err) => {
        setLocationLoading(false);
        if (err.code === 1) toast.error("Location permission denied. Browser settings mein allow karein.");
        else toast.error("Location detect nahi ho payi. Dobara try karein.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos = Array.from(files).slice(0, 3 - photos.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 3));
    toast.success(`${newPhotos.length} photo(s) upload ho gayi!`);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleImprove = () => {
    if (description.length < 5) {
      toast.error("Pehle complaint likhein");
      return;
    }
    setDescription(improveComplaint(description));
    toast.success("AI ne aapki complaint improve kar di!");
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !category || !description) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    const id = `CC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const { error } = await supabase.from("complaints").insert({
      tracking_id: id,
      name,
      phone,
      email: (document.querySelector('input[type="email"]') as HTMLInputElement)?.value || null,
      category,
      description,
      location: location || null,
      priority: aiPriority,
      is_urgent: isUrgent,
      department: aiDepartment || null,
      status: "Pending",
    });
    
    setSubmitting(false);
    if (error) {
      toast.error("Complaint submit nahi ho payi. Dobara try karein.");
      return;
    }
    
    // Save AI info for success dialog
    setSuccessAiSolution(aiSuggestion);
    setSuccessDepartment(aiDepartment);
    setSuccessPriority(priorityLabels[aiPriority]);
    
    setTrackingId(id);
    setShowSuccess(true);
    setName(""); setPhone(""); setDescription(""); setCategory(""); setIsUrgent(false);
    setAiSuggestion(""); setAiDepartment(""); setLocation(""); setPhotos([]);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container max-w-2xl py-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <ClipboardList className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Register Complaint</h1>
        </div>
        <p className="mb-8 text-muted-foreground">Fill in the details below. AI will automatically suggest a solution.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Full Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
          </div>
          <div>
            <Label>Phone Number *</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="Optional email" />
          </div>
          <div>
            <Label>Complaint Category * {category && <span className="text-primary ml-2 text-xs">✅ AI Detected</span>}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue in detail..." rows={4} />
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleImprove}>
              <Sparkles className="mr-2 h-4 w-4" /> ✨ Improve My Complaint (AI)
            </Button>
          </div>

          {/* AI Auto Detection Box */}
          {aiSuggestion && (
            <div className="rounded-lg border-2 border-primary/30 bg-accent p-4 space-y-2">
              <div className="flex items-center gap-2 font-heading font-semibold text-sm text-accent-foreground">
                <Brain className="h-4 w-4" /> AI Analysis
              </div>
              <p className="text-sm">{aiSuggestion}</p>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="bg-background rounded-full px-3 py-1">{priorityLabels[aiPriority]}</span>
                <span className="bg-background rounded-full px-3 py-1">🏢 {aiDepartment}</span>
                <span className="bg-background rounded-full px-3 py-1">⏳ Est: {estimatedTime}</span>
              </div>
            </div>
          )}

          {/* Urgent Checkbox */}
          <div className="flex items-center space-x-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <Checkbox id="urgent" checked={isUrgent} onCheckedChange={(v) => setIsUrgent(v === true)} />
            <label htmlFor="urgent" className="text-sm font-medium flex items-center gap-2 cursor-pointer">
              <AlertTriangle className="h-4 w-4 text-destructive" /> Urgent / Emergency Complaint
            </label>
          </div>

          {/* GPS Location */}
          <div>
            <Label>📍 Location</Label>
            <Button
              type="button"
              variant="outline"
              className="mt-1 w-full justify-start text-muted-foreground"
              onClick={handleGetLocation}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Location detect ho rahi hai...</>
              ) : (
                <><MapPin className="mr-2 h-4 w-4" /> {location ? "📍 Location change karein" : "Click karein - Location detect hogi"}</>
              )}
            </Button>
            {location && (
              <div className="mt-2 rounded-lg bg-accent p-3 text-sm text-accent-foreground">
                <span className="font-semibold">📍 Detected Location:</span>
                <p className="mt-1 text-xs break-all">{location}</p>
              </div>
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <Label>Attach Photo (max 3)</Label>
            <label
              htmlFor="photo-upload"
              className="mt-1 flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground hover:border-primary hover:bg-accent/50 transition-colors"
            >
              <Camera className="mr-2 h-5 w-5" /> Photo khichein ya upload karein
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
            />
            {photos.length > 0 && (
              <div className="mt-3 flex gap-3 flex-wrap">
                {photos.map((p, i) => (
                  <div key={i} className="relative group">
                    <img src={p.preview} alt={`Upload ${i + 1}`} className="h-20 w-20 rounded-lg object-cover border" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Complaint"}
          </Button>

          <div className="space-y-1 text-xs text-muted-foreground border-t pt-4">
            <p>⚠️ <strong>Note:</strong> Fake complaint submit karne par action liya ja sakta hai.</p>
            <p>📌 Complaint submit karne ke baad aapko tracking ID milegi.</p>
          </div>
        </form>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-center font-heading">Complaint Registered!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-5xl">✅</div>
            <p className="font-semibold text-lg">Complaint registered successfully!</p>
            
            {/* AI Solution - shown first */}
            {successAiSolution && (
              <div className="rounded-lg border-2 border-primary/30 bg-accent p-4 text-left space-y-2">
                <p className="font-heading font-bold text-sm flex items-center gap-2">🤖 AI Solution</p>
                <p className="text-sm">{successAiSolution}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {successPriority && <span className="bg-background rounded-full px-2 py-0.5">{successPriority}</span>}
                  {successDepartment && <span className="bg-background rounded-full px-2 py-0.5">🏢 {successDepartment}</span>}
                </div>
              </div>
            )}

            <div className="rounded-lg bg-accent p-4 space-y-2">
              <p className="font-heading font-bold text-xl text-primary">📌 Tracking ID: #{trackingId}</p>
              <p className="text-sm text-muted-foreground">📩 Adhikari ko email notification bhej di gayi hai</p>
              <p className="text-sm text-muted-foreground">⏳ Estimated solve time: {estimatedTime || "24-48 hours"}</p>
            </div>
            <Button onClick={() => setShowSuccess(false)} className="w-full">OK, Done</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ComplaintPage;

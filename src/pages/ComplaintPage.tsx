import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, MapPin, Camera, Sparkles, AlertTriangle, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
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

function getAISolution(cat: string, desc: string): string {
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

function getEstimatedTime(cat: string, priority: string): string {
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

  // AI auto-detect on description change
  useEffect(() => {
    if (description.length > 5) {
      const detected = detectCategory(description);
      if (detected && !category) setCategory(detected);
      const pri = isUrgent ? "high" : detectPriority(description);
      setAiPriority(pri);
      const cat = detected || category;
      if (cat) {
        setAiDepartment(getDepartment(cat));
        setAiSuggestion(getAISolution(cat, description));
        setEstimatedTime(getEstimatedTime(cat, pri));
      }
    } else {
      setAiSuggestion("");
      setAiDepartment("");
    }
  }, [description, category, isUrgent]);

  const handleImprove = () => {
    if (description.length < 5) {
      toast.error("Pehle complaint likhein");
      return;
    }
    setDescription(improveComplaint(description));
    toast.success("AI ne aapki complaint improve kar di!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !category || !description) {
      toast.error("Please fill all required fields");
      return;
    }
    const id = `CC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setTrackingId(id);
    setShowSuccess(true);
    setName(""); setPhone(""); setDescription(""); setCategory(""); setIsUrgent(false);
    setAiSuggestion(""); setAiDepartment("");
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

          <div>
            <Label>📍 Location (GPS Click karein)</Label>
            <Button type="button" variant="outline" className="mt-1 w-full justify-start text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" /> Click karein - Pura Pata Aayega
            </Button>
          </div>
          <div>
            <Label>Attach Photo</Label>
            <div className="mt-1 flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground hover:border-primary">
              <Camera className="mr-2 h-5 w-5" /> Photo khichein ya upload karein
            </div>
          </div>
          <Button type="submit" className="w-full" size="lg">Submit Complaint</Button>

          {/* Notes below form */}
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
            <p className="font-semibold text-lg">Complaint registered successfully</p>
            <div className="rounded-lg bg-accent p-4 space-y-2">
              <p className="font-heading font-bold text-xl text-primary">📌 Tracking ID: #{trackingId}</p>
              <p className="text-sm text-muted-foreground">📩 Update aapko SMS/Email par milega</p>
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

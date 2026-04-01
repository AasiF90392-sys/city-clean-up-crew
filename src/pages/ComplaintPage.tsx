import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, MapPin, Camera } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const categories = [
  "Kachra Uthane ki Complaint",
  "Nali Block Complaint",
  "Road Safai Complaint",
  "Public Toilet Issue",
  "Pani Bharne ki Problem",
  "Illegal Garbage Dumping",
  "Other",
];

const ComplaintPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedType = searchParams.get("type") || "";
  const [category, setCategory] = useState(preselectedType);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !category || !description) {
      toast.error("Please fill all required fields");
      return;
    }
    const id = `CC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    toast.success(`Complaint registered! ID: ${id}`);
    setName(""); setPhone(""); setDescription(""); setCategory("");
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
            <Label>Complaint Category *</Label>
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
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ComplaintPage;

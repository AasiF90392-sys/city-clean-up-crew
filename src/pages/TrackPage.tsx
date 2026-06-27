import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, CheckCircle2, Clock, Copy, MapPin } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Complaint = {
  tracking_id: string;
  name: string;
  category: string;
  description: string;
  location: string | null;
  status: string;
  priority: string;
  department: string | null;
  is_urgent: boolean;
  created_at: string;
  updated_at: string;
};

const TrackPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [complaintId, setComplaintId] = useState(searchParams.get("id") || "");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [complaint, setComplaint] = useState<Complaint | null>(null);

  const handleTrack = useCallback(async (idArg?: string) => {
    const id = (idArg ?? complaintId).trim();
    if (!id) {
      toast.error("Please enter a tracking ID");
      return;
    }
    setLoading(true);
    setSearched(true);
    const { data, error } = await supabase
      .from("complaints")
      .select("tracking_id,name,category,description,location,status,priority,department,is_urgent,created_at,updated_at")
      .ilike("tracking_id", id)
      .maybeSingle();
    setLoading(false);
    if (error) {
      toast.error("Search fail ho gaya. Dobara try karein.");
      setComplaint(null);
      return;
    }
    setComplaint(data as Complaint | null);
    if (data) setSearchParams({ id: (data as Complaint).tracking_id }, { replace: true });
  }, [complaintId, setSearchParams]);

  // Auto-search when ?id= is present
  useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId && !searched) {
      setComplaintId(urlId);
      handleTrack(urlId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const status = complaint?.status || "Pending";
  const statusLower = status.toLowerCase();
  const stepIdx = statusLower.includes("progress")
    ? 1
    : statusLower.includes("resolved") || statusLower.includes("closed")
    ? 2
    : 0;
  const steps = ["Submitted", "In Progress", "Resolved"];
  const statusColor =
    stepIdx === 2
      ? "bg-success/15 text-success border-success/30"
      : stepIdx === 1
      ? "bg-info/15 text-info border-info/30"
      : "bg-warning/15 text-warning border-warning/30";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container max-w-2xl flex-1 py-8 sm:py-12 px-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Search className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold">Track Your Complaint</h1>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">Enter your Complaint ID to check real-time status.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Input
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            placeholder="Enter Complaint ID (e.g., CC-2026-0001)"
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Track
          </Button>
        </form>

        {searched && !loading && !complaint && (
          <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Koi complaint nahi mili ID: <strong>{complaintId}</strong>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Apni complaint ID check karein aur dobara try karein.</p>
          </div>
        )}

        {complaint && (
          <div className="mt-8 rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Tracking ID</p>
                <p className="font-heading text-lg font-bold text-primary">#{complaint.tracking_id}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(complaint.tracking_id);
                  toast.success("Tracking ID copied!");
                }}
              >
                <Copy className="mr-2 h-3.5 w-3.5" /> Copy
              </Button>
            </div>

            <div className={`rounded-lg border px-4 py-3 ${statusColor}`}>
              <p className="text-xs opacity-80">Current Status</p>
              <p className="font-heading text-lg font-bold">
                {status} {complaint.is_urgent && <span className="ml-2 text-xs text-destructive">⚡ Urgent</span>}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-3">Progress</p>
              <div className="flex items-center justify-between gap-2">
                {steps.map((s, i) => (
                  <div key={s} className="flex-1 flex flex-col items-center text-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                        i <= stepIdx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i < stepIdx ? <CheckCircle2 className="h-4 w-4" /> : i === stepIdx ? <Clock className="h-4 w-4" /> : i + 1}
                    </div>
                    <p className={`mt-2 text-[10px] sm:text-xs ${i <= stepIdx ? "font-semibold" : "text-muted-foreground"}`}>{s}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-accent/50 p-3">
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{complaint.name}</p>
              </div>
              <div className="rounded-lg bg-accent/50 p-3">
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="font-medium">{complaint.category}</p>
              </div>
              <div className="rounded-lg bg-accent/50 p-3">
                <p className="text-xs text-muted-foreground">Priority</p>
                <p className="font-medium capitalize">{complaint.priority}</p>
              </div>
              <div className="rounded-lg bg-accent/50 p-3">
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="font-medium">{complaint.department || "—"}</p>
              </div>
              <div className="rounded-lg bg-accent/50 p-3">
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="font-medium">{new Date(complaint.created_at).toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-accent/50 p-3">
                <p className="text-xs text-muted-foreground">Last Update</p>
                <p className="font-medium">{new Date(complaint.updated_at).toLocaleString()}</p>
              </div>
              {complaint.location && (
                <div className="rounded-lg bg-accent/50 p-3 sm:col-span-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Location
                  </p>
                  <p className="font-medium text-xs break-words">{complaint.location}</p>
                </div>
              )}
              <div className="rounded-lg bg-accent/50 p-3 sm:col-span-2">
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="font-medium text-sm whitespace-pre-wrap">{complaint.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TrackPage;

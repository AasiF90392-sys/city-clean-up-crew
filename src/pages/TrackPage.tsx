import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const TrackPage = () => {
  const [complaintId, setComplaintId] = useState("");
  const [searched, setSearched] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container max-w-2xl flex-1 py-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Search className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Track Your Complaint</h1>
        </div>
        <p className="mb-8 text-muted-foreground">Enter your Complaint ID to check real-time status.</p>

        <div className="flex gap-3">
          <Input
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            placeholder="Enter Complaint ID (e.g., CC-2026-0001)"
            className="flex-1"
          />
          <Button onClick={() => setSearched(true)}>
            <Search className="mr-2 h-4 w-4" /> Track
          </Button>
        </div>

        {searched && complaintId && (
          <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">No complaint found with ID: <strong>{complaintId}</strong></p>
            <p className="mt-2 text-xs text-muted-foreground">Please check your complaint ID and try again.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TrackPage;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BarChart3, CheckCircle, Clock, AlertTriangle, LogOut, Users, Settings,
  ArrowLeft, Send, Plus, Trash2, Edit, X
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Complaint = {
  id: string;
  tracking_id: string;
  name: string;
  phone: string;
  category: string;
  description: string;
  status: string;
  priority: string;
  is_urgent: boolean;
  location: string | null;
  department: string | null;
  created_at: string;
};

type WardOfficer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  ward_name: string;
  designation: string;
  status: string;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
};

type View = "main" | "analytics" | "notifications" | "officers" | "settings";

const AdminDashboard = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<View>("main");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [officers, setOfficers] = useState<WardOfficer[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Notification form
  const [nTitle, setNTitle] = useState("");
  const [nMessage, setNMessage] = useState("");
  const [nType, setNType] = useState("general");

  // Officer form
  const [showOfficerDialog, setShowOfficerDialog] = useState(false);
  const [oName, setOName] = useState("");
  const [oPhone, setOPhone] = useState("");
  const [oEmail, setOEmail] = useState("");
  const [oWard, setOWard] = useState("");
  const [oDesignation, setODesignation] = useState("Ward Officer");

  const fetchData = async () => {
    setLoading(true);
    const [cRes, oRes, nRes] = await Promise.all([
      supabase.from("complaints").select("*").order("created_at", { ascending: false }),
      supabase.from("ward_officers").select("*").order("created_at", { ascending: false }),
      supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(20),
    ]);
    if (cRes.data) setComplaints(cRes.data as Complaint[]);
    if (oRes.data) setOfficers(oRes.data as WardOfficer[]);
    if (nRes.data) setNotifications(nRes.data as Notification[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin-login", { replace: true });
  };

  const stats = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
    pending: complaints.filter(c => c.status === "Pending").length,
    urgent: complaints.filter(c => c.is_urgent).length,
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("complaints").update({ status }).eq("id", id);
    if (error) { toast.error("Status update failed"); return; }
    toast.success(`Status updated to ${status}`);
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const sendNotification = async () => {
    if (!nTitle || !nMessage) { toast.error("Title aur message daalein"); return; }
    const { error } = await supabase.from("notifications").insert({
      title: nTitle, message: nMessage, type: nType, sent_by: user?.id,
    });
    if (error) { toast.error("Notification send failed"); return; }
    toast.success("Notification sent!");
    setNTitle(""); setNMessage(""); setNType("general");
    fetchData();
  };

  const addOfficer = async () => {
    if (!oName || !oPhone || !oWard) { toast.error("Name, phone, ward required"); return; }
    const { error } = await supabase.from("ward_officers").insert({
      name: oName, phone: oPhone, email: oEmail || null, ward_name: oWard, designation: oDesignation,
    });
    if (error) { toast.error("Officer add failed"); return; }
    toast.success("Officer added!");
    setOName(""); setOPhone(""); setOEmail(""); setOWard(""); setODesignation("Ward Officer");
    setShowOfficerDialog(false);
    fetchData();
  };

  const deleteOfficer = async (id: string) => {
    const { error } = await supabase.from("ward_officers").delete().eq("id", id);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Officer removed");
    setOfficers(prev => prev.filter(o => o.id !== id));
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Pending: "bg-warning/10 text-warning",
      Resolved: "bg-primary/10 text-primary",
      "In Progress": "bg-info/10 text-info",
      Rejected: "bg-destructive/10 text-destructive",
    };
    return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || "bg-muted text-muted-foreground"}`}>{status}</span>;
  };

  // ========== VIEWS ==========

  if (view === "analytics") {
    const catCounts: Record<string, number> = {};
    complaints.forEach(c => { catCounts[c.category] = (catCounts[c.category] || 0) + 1; });
    const priorityCounts = { high: 0, medium: 0, low: 0 };
    complaints.forEach(c => { if (c.priority in priorityCounts) priorityCounts[c.priority as keyof typeof priorityCounts]++; });

    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-12">
          <Button variant="ghost" onClick={() => setView("main")} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
          <h1 className="font-heading text-2xl font-bold mb-6">📊 Analytics Report</h1>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="rounded-xl border bg-card p-5 text-center"><p className="text-3xl font-bold text-primary">{stats.total}</p><p className="text-sm text-muted-foreground">Total</p></div>
            <div className="rounded-xl border bg-card p-5 text-center"><p className="text-3xl font-bold text-primary">{stats.resolved}</p><p className="text-sm text-muted-foreground">Resolved</p></div>
            <div className="rounded-xl border bg-card p-5 text-center"><p className="text-3xl font-bold text-warning">{stats.pending}</p><p className="text-sm text-muted-foreground">Pending</p></div>
            <div className="rounded-xl border bg-card p-5 text-center"><p className="text-3xl font-bold text-destructive">{stats.urgent}</p><p className="text-sm text-muted-foreground">Urgent</p></div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-6">
              <h2 className="font-heading font-bold mb-4">Category-wise Complaints</h2>
              {Object.entries(catCounts).map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">{cat}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(20, (count / stats.total) * 150)}px` }} />
                    <span className="text-sm font-bold">{count}</span>
                  </div>
                </div>
              ))}
              {Object.keys(catCounts).length === 0 && <p className="text-muted-foreground text-sm">No complaints yet</p>}
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h2 className="font-heading font-bold mb-4">Priority Distribution</h2>
              {[
                { label: "🔴 High Priority", count: priorityCounts.high, color: "bg-destructive" },
                { label: "🟡 Medium Priority", count: priorityCounts.medium, color: "bg-warning" },
                { label: "🟢 Low Priority", count: priorityCounts.low, color: "bg-primary" },
              ].map(p => (
                <div key={p.label} className="flex items-center justify-between py-3 border-b last:border-0">
                  <span className="text-sm">{p.label}</span>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 rounded-full ${p.color}`} style={{ width: `${Math.max(20, stats.total ? (p.count / stats.total) * 150 : 20)}px` }} />
                    <span className="text-sm font-bold">{p.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (view === "notifications") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-12 max-w-2xl">
          <Button variant="ghost" onClick={() => setView("main")} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
          <h1 className="font-heading text-2xl font-bold mb-6">📧 Send Notifications</h1>
          
          <div className="rounded-xl border bg-card p-6 mb-6">
            <div className="space-y-4">
              <div><Label>Title *</Label><Input value={nTitle} onChange={e => setNTitle(e.target.value)} placeholder="Notification title" /></div>
              <div><Label>Message *</Label><Textarea value={nMessage} onChange={e => setNMessage(e.target.value)} placeholder="Notification message..." rows={3} /></div>
              <div>
                <Label>Type</Label>
                <Select value={nType} onValueChange={setNType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={sendNotification} className="w-full"><Send className="mr-2 h-4 w-4" /> Send Notification</Button>
            </div>
          </div>

          <h2 className="font-heading font-bold mb-3">Recent Notifications</h2>
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{n.title}</p>
                  <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString("hi-IN")}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                <span className="mt-2 inline-block rounded-full bg-accent px-2 py-0.5 text-xs">{n.type}</span>
              </div>
            ))}
            {notifications.length === 0 && <p className="text-muted-foreground text-sm">No notifications sent yet</p>}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (view === "officers") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-12">
          <Button variant="ghost" onClick={() => setView("main")} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-heading text-2xl font-bold">👥 Ward Officers</h1>
            <Button onClick={() => setShowOfficerDialog(true)}><Plus className="mr-2 h-4 w-4" /> Add Officer</Button>
          </div>

          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Ward</th>
                  <th className="px-4 py-3 text-left font-medium">Phone</th>
                  <th className="px-4 py-3 text-left font-medium">Designation</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {officers.map(o => (
                  <tr key={o.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{o.name}</td>
                    <td className="px-4 py-3">{o.ward_name}</td>
                    <td className="px-4 py-3 text-xs">{o.phone}</td>
                    <td className="px-4 py-3 text-xs">{o.designation}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${o.status === "Active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{o.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => deleteOfficer(o.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {officers.length === 0 && <p className="text-center py-8 text-muted-foreground text-sm">No ward officers added yet</p>}
          </div>

          <Dialog open={showOfficerDialog} onOpenChange={setShowOfficerDialog}>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Ward Officer</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Name *</Label><Input value={oName} onChange={e => setOName(e.target.value)} placeholder="Officer name" /></div>
                <div><Label>Phone *</Label><Input value={oPhone} onChange={e => setOPhone(e.target.value)} placeholder="Phone number" /></div>
                <div><Label>Email</Label><Input value={oEmail} onChange={e => setOEmail(e.target.value)} placeholder="Email (optional)" /></div>
                <div><Label>Ward Name *</Label><Input value={oWard} onChange={e => setOWard(e.target.value)} placeholder="e.g. Ward 12" /></div>
                <div><Label>Designation</Label><Input value={oDesignation} onChange={e => setODesignation(e.target.value)} placeholder="e.g. Ward Officer" /></div>
                <Button onClick={addOfficer} className="w-full">Add Officer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Footer />
      </div>
    );
  }

  if (view === "settings") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-12 max-w-2xl">
          <Button variant="ghost" onClick={() => setView("main")} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
          <h1 className="font-heading text-2xl font-bold mb-6">⚙️ System Settings</h1>
          
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-6">
              <h2 className="font-heading font-bold mb-2">Admin Info</h2>
              <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
              <p className="text-sm text-muted-foreground">User ID: {user?.id?.slice(0, 8)}...</p>
              <p className="text-sm text-muted-foreground">Last Sign In: {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString("hi-IN") : "N/A"}</p>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h2 className="font-heading font-bold mb-2">System Stats</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Total Complaints:</span> <strong>{stats.total}</strong></div>
                <div><span className="text-muted-foreground">Ward Officers:</span> <strong>{officers.length}</strong></div>
                <div><span className="text-muted-foreground">Notifications Sent:</span> <strong>{notifications.length}</strong></div>
                <div><span className="text-muted-foreground">Resolve Rate:</span> <strong>{stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0}%</strong></div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h2 className="font-heading font-bold mb-2">Actions</h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => { fetchData(); toast.success("Data refreshed!"); }}>🔄 Refresh All Data</Button>
                <Button variant="outline" className="w-full justify-start text-destructive" onClick={handleLogout}>🚪 Logout from Admin</Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ========== MAIN VIEW ==========
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Logged in as: {user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: BarChart3, label: "Total Complaints", value: String(stats.total), color: "bg-info/10 text-info" },
                { icon: CheckCircle, label: "Resolved", value: String(stats.resolved), color: "bg-primary/10 text-primary" },
                { icon: Clock, label: "Pending", value: String(stats.pending), color: "bg-warning/10 text-warning" },
                { icon: AlertTriangle, label: "Urgent", value: String(stats.urgent), color: "bg-destructive/10 text-destructive" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${s.color}`}>
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-heading text-2xl font-bold">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="font-heading font-bold">Manage Complaints</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">ID</th>
                        <th className="px-3 py-2 text-left font-medium">Category</th>
                        <th className="px-3 py-2 text-left font-medium">Status</th>
                        <th className="px-3 py-2 text-left font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.slice(0, 10).map((c) => (
                        <tr key={c.id} className="border-t">
                          <td className="px-3 py-2 font-mono text-xs">{c.tracking_id}</td>
                          <td className="px-3 py-2 text-xs">{c.category}</td>
                          <td className="px-3 py-2">{statusBadge(c.status)}</td>
                          <td className="px-3 py-2">
                            {c.status === "Pending" ? (
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(c.id, "In Progress")}>Start</Button>
                                <Button size="sm" className="h-7 text-xs" onClick={() => updateStatus(c.id, "Resolved")}>Resolve</Button>
                              </div>
                            ) : c.status === "In Progress" ? (
                              <Button size="sm" className="h-7 text-xs" onClick={() => updateStatus(c.id, "Resolved")}>Resolve</Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">Done ✅</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {complaints.length === 0 && <p className="text-center py-6 text-muted-foreground text-sm">No complaints yet</p>}
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="h-5 w-5 text-primary" />
                  <h2 className="font-heading font-bold">Quick Actions</h2>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setView("analytics")}>📊 View Analytics Report</Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setView("notifications")}>📧 Send Notifications</Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setView("officers")}>👥 Manage Ward Officers</Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setView("settings")}>⚙️ System Settings</Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

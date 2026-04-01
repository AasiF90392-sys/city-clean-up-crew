import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { BarChart3, CheckCircle, Clock, AlertTriangle, LogOut, Users, Settings } from "lucide-react";

const AdminDashboard = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin-login", { replace: true });
  };

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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BarChart3, label: "Total Complaints", value: "4", color: "bg-info/10 text-info" },
            { icon: CheckCircle, label: "Resolved", value: "0", color: "bg-primary/10 text-primary" },
            { icon: Clock, label: "Pending", value: "4", color: "bg-warning/10 text-warning" },
            { icon: AlertTriangle, label: "Urgent", value: "1", color: "bg-destructive/10 text-destructive" },
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
                  {[
                    { id: "CC-2026-5668", cat: "Nali Block", status: "Pending" },
                    { id: "CC-2026-1429", cat: "Public Toilet", status: "Pending" },
                    { id: "CC-2026-7784", cat: "Public Toilet", status: "Pending" },
                    { id: "SC-MNBLVO1B", cat: "Pani Bharne", status: "Pending" },
                  ].map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="px-3 py-2 font-mono text-xs">{c.id}</td>
                      <td className="px-3 py-2 text-xs">{c.cat}</td>
                      <td className="px-3 py-2">
                        <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">{c.status}</span>
                      </td>
                      <td className="px-3 py-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs">Resolve</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="font-heading font-bold">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">📊 View Analytics Report</Button>
              <Button variant="outline" className="w-full justify-start">📧 Send Notifications</Button>
              <Button variant="outline" className="w-full justify-start">👥 Manage Ward Officers</Button>
              <Button variant="outline" className="w-full justify-start">⚙️ System Settings</Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

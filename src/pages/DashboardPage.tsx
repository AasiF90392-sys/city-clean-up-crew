import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BarChart3, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const recentComplaints = [
  { id: "CC-2026-5668", category: "Nali Block Complaint", status: "Pending", date: "1/4/2026" },
  { id: "CC-2026-1429", category: "Public Toilet Issue", status: "Pending", date: "30/3/2026" },
  { id: "CC-2026-7784", category: "Public Toilet Issue", status: "Pending", date: "30/3/2026" },
  { id: "SC-MNBLVO1B", category: "Pani Bharne ki Problem", status: "Pending", date: "29/3/2026" },
];

const DashboardPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-12">
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <p className="mb-8 text-muted-foreground">Overview of complaint statistics and recent activity.</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BarChart3, label: "Total", value: "4", color: "bg-info/10 text-info" },
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

        <div className="mt-10">
          <h2 className="font-heading text-lg font-bold mb-4">Recent Complaints</h2>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
                    <td className="px-4 py-3">{c.category}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-warning/10 px-2 py-1 text-xs font-medium text-warning">{c.status}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;

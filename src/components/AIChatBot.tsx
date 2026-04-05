import { useLayoutEffect, useRef, useState } from "react";
import { LayoutDashboard, MessageCircle, Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickReplies = [
  { q: "Complaint kaise kare?", a: "Home page par 'Register Complaint' button click karein, form bharein aur submit karein. Aapko tracking ID milegi." },
  { q: "Tracking kaise kare?", a: "'Track Complaint' page par jaayein aur apni Tracking ID daalen. Aapko complaint ka status dikh jayega." },
  { q: "Complaint edit kaise kare?", a: "Abhi complaint edit ka option available nahi hai. Naya complaint register karein ya helpline 1800-XXX-XXXX par call karein." },
  { q: "Emergency complaint kaise karein?", a: "Complaint form mein 'Urgent / Emergency Complaint' checkbox tick karein. Ye complaint high priority mein jayegi." },
];

const AIChatBot = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Namaste! 🙏 Main aapki madad kar sakta hoon. Neeche koi option choose karein ya apna sawal likhein." },
  ]);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = messagesContainerRef.current;

    if (!container || !open) {
      return;
    }

    const scrollToBottom = () => {
      container.scrollTop = container.scrollHeight;
    };

    scrollToBottom();

    const firstPass = window.setTimeout(scrollToBottom, 80);
    const secondPass = window.setTimeout(scrollToBottom, 180);

    return () => {
      window.clearTimeout(firstPass);
      window.clearTimeout(secondPass);
    };
  }, [messages.length, open]);

  const handleQuick = (q: string, a: string) => {
    setMessages((prev) => [...prev, { role: "user", text: q }, { role: "bot", text: a }]);
  };

  const handleDashboardOpen = () => {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: "Dashboard kholo" },
      { role: "bot", text: "Dashboard khol raha hoon. Agar login nahi hai to admin login page open hoga." },
    ]);

    window.setTimeout(() => {
      navigate("/admin");
    }, 250);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");

    const match = quickReplies.find((r) => userMsg.toLowerCase().includes(r.q.toLowerCase().split(" ")[0]));
    const botReply = match
      ? match.a
      : "Aapka sawal samajh gaya! Kripya helpline 1800-XXX-XXXX par call karein ya complaint register karein. Hum jaldi madad karenge. 🙏";

    setMessages((prev) => [...prev, { role: "user", text: userMsg }, { role: "bot", text: botReply }]);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:bg-primary/90 animate-bounce"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-80 flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl" style={{ maxHeight: "70vh" }}>
      <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
        <span className="font-heading text-sm font-semibold">💬 AI Help Bot</span>
        <button onClick={() => setOpen(false)} aria-label="Close chat">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 space-y-2 overflow-y-auto overscroll-contain p-3"
        style={{ maxHeight: "350px" }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === "bot" ? "bg-muted text-foreground" : "ml-auto bg-primary text-primary-foreground"}`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t p-2">
        <div className="flex flex-wrap gap-1">
          {quickReplies.map((r) => (
            <button
              key={r.q}
              onClick={() => handleQuick(r.q, r.a)}
              className="rounded-full bg-accent px-2 py-1 text-xs text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {r.q}
            </button>
          ))}
          <button
            onClick={handleDashboardOpen}
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard
          </button>
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Apna sawal likhein..."
            className="h-9 text-sm"
          />
          <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;

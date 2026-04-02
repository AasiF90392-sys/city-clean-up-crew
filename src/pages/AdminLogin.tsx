import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate("/admin", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);

    if (isSignUp) {
      // Sign up flow
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setLoading(false);
        toast.error("Signup failed: " + signUpError.message);
        return;
      }
      // Auto login after signup
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (loginError) {
        toast.error("Account created but login failed. Try logging in.");
        setIsSignUp(false);
      } else {
        toast.success("Account created & logged in!");
        navigate("/admin", { replace: true });
      }
    } else {
      // Login flow - try login first, if fails try signup + login
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Account might not exist, try creating it
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) {
          setLoading(false);
          toast.error("Login failed: " + error.message);
          return;
        }
        // Now try login again
        const { error: retryError } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (retryError) {
          toast.error("Login failed: " + retryError.message);
        } else {
          toast.success("Login successful!");
          navigate("/admin", { replace: true });
        }
      } else {
        setLoading(false);
        toast.success("Login successful!");
        navigate("/admin", { replace: true });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <ShieldCheck className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="mt-4 font-heading text-xl font-bold">
            {isSignUp ? "Admin Sign Up" : "Admin Login"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSignUp ? "Create your admin account" : "Enter your credentials to access the admin panel"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (isSignUp ? "Creating account..." : "Logging in...") : (isSignUp ? "Sign Up" : "Login")}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-medium text-primary hover:underline"
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

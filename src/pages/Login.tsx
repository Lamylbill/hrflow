
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import AnimatedButton from "@/components/AnimatedButton";
import GlassCard from "@/components/GlassCard";
import Footer from "@/components/Footer";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { loginWithEmail, signUpWithEmail } from "@/utils/auth";

const Login = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isSignUp = searchParams.get("signup") === "true";
  const selectedPlan = searchParams.get("plan") || "";
  
  const [activeTab, setActiveTab] = useState(isSignUp ? "signup" : "login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Update the tab when the URL parameter changes
    setActiveTab(isSignUp ? "signup" : "login");
  }, [isSignUp]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use the auth utility for login
      const { error } = await loginWithEmail(email, password);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Login successful",
        description: "Welcome to HR Flow!",
        variant: "default",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Use the auth utility for sign up
      const { error } = await signUpWithEmail(email, password, { 
        name: username,
        plan: selectedPlan || undefined 
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please check your email for verification.",
        variant: "default",
      });
      setActiveTab("login");
      // Update URL without the signup parameter
      navigate("/login", { replace: true });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex items-center space-x-2 text-primary font-semibold text-xl"
        >
          <span className="bg-primary text-white px-2 py-1 rounded-md">HR</span>
          <span className="tracking-tight">Flow</span>
        </Link>
      </div>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <GlassCard className="p-8">
            {/* Tabs */}
            <div className="flex border-b border-border mb-6">
              <button
                className={`flex-1 py-3 font-medium text-sm ${
                  activeTab === "login" 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  setActiveTab("login");
                  navigate("/login", { replace: true });
                }}
              >
                Log In
              </button>
              <button
                className={`flex-1 py-3 font-medium text-sm ${
                  activeTab === "signup" 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  setActiveTab("signup");
                  navigate("/login?signup=true", { replace: true });
                }}
              >
                Sign Up
              </button>
            </div>

            {activeTab === "login" ? (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold">Welcome Back</h1>
                  <p className="text-muted-foreground mt-2">
                    Log in to access your HR dashboard
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <input
                        id="remember"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-muted-foreground">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm font-medium text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>

                  <AnimatedButton
                    type="submit"
                    className="w-full flex justify-center items-center py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        Log In
                      </>
                    )}
                  </AnimatedButton>

                  <div className="text-xs text-muted-foreground mt-4 text-center">
                    For testing, you can create an account using the Sign Up tab
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold">Create an Account</h1>
                  <p className="text-muted-foreground mt-2">
                    Join HRFlow and streamline your HR operations
                    {selectedPlan && (
                      <span className="block mt-1 text-primary font-medium">
                        Selected plan: {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
                      </span>
                    )}
                  </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label htmlFor="signupUsername" className="block text-sm font-medium mb-1">
                      Username
                    </label>
                    <input
                      id="signupUsername"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Choose a username"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Your email address"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="signupPassword" className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="signupPassword"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-muted-foreground">
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <AnimatedButton
                    type="submit"
                    className="w-full flex justify-center items-center py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </AnimatedButton>
                </form>
              </>
            )}
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;

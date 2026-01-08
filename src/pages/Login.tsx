import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import bendiqLogo from "@/assets/bendiq-logo.png";

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showImprint, setShowImprint] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Trigger fade-in animation on mount
  React.useEffect(() => {
    const timer = setTimeout(() => setFormVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const validateEmail = (value: string) => {
    try {
      emailSchema.parse(value);
      setEmailError('');
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setEmailError(err.errors[0].message);
      }
      return false;
    }
  };

  const validatePassword = (value: string) => {
    try {
      passwordSchema.parse(value);
      setPasswordError('');
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setPasswordError(err.errors[0].message);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else {
        setError(err.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign in was cancelled');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized. Please add this domain to your Firebase Console under Authentication > Settings > Authorized domains.');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      emailSchema.parse(resetEmail);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    setLoading(true);
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans" style={{ backgroundColor: '#0B111E' }}>
      <div className={`w-full max-w-sm transition-all duration-500 ease-out ${formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Logo and Welcome */}
        <div className="text-center mb-8">
          <img 
            src={bendiqLogo} 
            alt="BendIQ Logo" 
            className="w-24 h-24 mx-auto mb-4 object-contain"
          />
          <p className="text-slate-400 text-sm font-sans">Welcome to</p>
          <h1 className="text-3xl font-bold text-white font-sans tracking-wide">
            BEND<span style={{ color: '#3C83F6' }}>IQ</span>
          </h1>
          <p className="text-slate-500 mt-2 uppercase" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: '12px', fontWeight: 500, letterSpacing: '0.15em' }}>
            PROFESSIONAL CONDUIT BENDING
          </p>
        </div>

        {/* Auth Form */}
        <div className={`backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl transition-all duration-700 delay-200 ${formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ backgroundColor: '#0B111E' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 text-sm font-sans">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => email && validateEmail(email)}
                placeholder="Enter your email"
                className={`bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 font-sans rounded-xl ${emailError ? 'border-red-500' : ''}`}
              />
              {emailError && (
                <p className="text-red-400 text-xs font-sans animate-fade-in">{emailError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 text-sm font-sans">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
                  }}
                  onBlur={() => password && validatePassword(password)}
                  placeholder="Enter your password"
                  className={`bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 pr-10 font-sans rounded-xl ${passwordError ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-400 text-xs font-sans animate-fade-in">{passwordError}</p>
              )}
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-white/20 data-[state=checked]:bg-blue-600 rounded-full"
                  />
                  <Label htmlFor="remember" className="text-slate-400 text-xs font-sans cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-blue-400 text-xs hover:text-blue-300 transition-colors font-sans"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {error && (
              <p className="text-red-400 text-xs text-center font-sans">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl font-sans"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={18} />
              ) : null}
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-slate-500 text-xs font-sans">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="outline"
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 rounded-xl border-0 font-sans"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
          </Button>

          <p className="text-center text-slate-400 text-sm mt-6 font-sans">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex justify-center gap-6 mt-6">
          <button 
            onClick={() => setShowImprint(true)}
            className="text-slate-500 text-xs hover:text-slate-300 transition-colors font-sans"
          >
            Imprint
          </button>
          <button 
            onClick={() => setShowPrivacy(true)}
            className="text-slate-500 text-xs hover:text-slate-300 transition-colors font-sans"
          >
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="bg-slate-800 border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white font-sans">Reset Password</DialogTitle>
          </DialogHeader>
          {resetSent ? (
            <div className="text-center py-4">
              <p className="text-slate-300 font-sans">
                Password reset email sent! Check your inbox.
              </p>
              <Button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetSent(false);
                  setResetEmail('');
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 font-sans"
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-slate-300 font-sans">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 font-sans"
                />
              </div>
              {error && <p className="text-red-400 text-xs font-sans">{error}</p>}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 font-sans"
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                Send Reset Link
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Imprint Dialog */}
      <Dialog open={showImprint} onOpenChange={setShowImprint}>
        <DialogContent className="bg-slate-900/80 backdrop-blur-xl border-white/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white font-sans">Imprint</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-slate-300 font-sans space-y-1">
            <p>Julian Lohwasser</p>
            <p>c/o Block Services</p>
            <p>Stuttgarter Str. 106</p>
            <p>70736 Fellbach</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="bg-slate-900/80 backdrop-blur-xl border-white/20 max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-white font-sans">Privacy Policy</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="text-sm text-white font-sans space-y-4 text-left">
              <p>We are very pleased about your interest in our company. Data protection is of a particularly high priority for the management of NivoTools. Use of the NivoTools website is generally possible without providing any personal data. However, if a data subject wishes to use special services of our company via our website, the processing of personal data may become necessary. If the processing of personal data is necessary and there is no legal basis for such processing, we generally obtain the consent of the data subject.</p>
              <p>The processing of personal data, such as the name, address, e-mail address, or telephone number of a data subject, is always carried out in accordance with the General Data Protection Regulation (GDPR) and in accordance with the country-specific data protection regulations applicable to NivoTools. By means of this privacy policy, our company wishes to inform the public about the type, scope, and purpose of the personal data we collect, use, and process. Furthermore, data subjects are informed of their rights by means of this privacy policy.</p>
              <p>As the controller, NivoTools has implemented numerous technical and organizational measures to ensure the most complete protection of personal data processed through this website. However, internet-based data transmissions can fundamentally have security gaps, so absolute protection cannot be guaranteed. For this reason, every data subject is free to transmit personal data to us via alternative means, for example by telephone.</p>
              
              <h3 className="font-bold mt-4">Definitions</h3>
              <p>The privacy policy of NivoTools is based on the terminology used by the European legislator for the adoption of the General Data Protection Regulation (GDPR). Our privacy policy should be easy to read and understand for the public as well as for our customers and business partners.</p>
              
              <h3 className="font-bold mt-4">Name and Address of the Controller</h3>
              <p>Julian Lohwasser c/o Block Services Stuttgarter Str. 106 70736 Fellbach Germany Tel.: 015679758515 Email: nivotools@gmail.com Website: bendiq.lovable.app</p>
              
              <h3 className="font-bold mt-4">Cookies</h3>
              <p>The website of NivoTools uses cookies. Cookies are text files that are placed and stored on a computer system via an internet browser. Through the use of cookies, NivoTools can provide the users of this website with more user-friendly services that would not be possible without the setting of cookies.</p>
              
              <h3 className="font-bold mt-4">Rights of the Data Subject</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Right of confirmation:</strong> Each data subject shall have the right to obtain from the controller the confirmation as to whether or not personal data concerning him or her are being processed.</li>
                <li><strong>Right of access:</strong> Each data subject shall have the right to obtain from the controller free information about his or her personal data stored at any time.</li>
                <li><strong>Right to rectification:</strong> Each data subject shall have the right to obtain from the controller without undue delay the rectification of inaccurate personal data concerning him or her.</li>
                <li><strong>Right to erasure:</strong> Each data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her without undue delay.</li>
                <li><strong>Right to data portability:</strong> Each data subject shall have the right to receive the personal data concerning him or her in a structured, commonly used and machine-readable format.</li>
              </ul>
              
              <h3 className="font-bold mt-4">Data Protection Provisions for Google Firebase</h3>
              <p>The controller has integrated components of Google Firebase on this website. Firebase is a platform from Google for developing web and mobile applications.</p>
              
              <h3 className="font-bold mt-4">Data Security</h3>
              <p>To secure the transmitted information, this website uses SSL or TLS encryption (HTTPS). This encryption protects the data transmission between the app interface and the Google Firebase database from unauthorized access by third parties.</p>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;

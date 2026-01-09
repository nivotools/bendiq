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
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[a-z]/, 'Include at least one lowercase letter')
  .regex(/[0-9]/, 'Include at least one number');

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
      // Use generic error messages to prevent user enumeration attacks
      if (err.code === 'auth/user-not-found' || 
          err.code === 'auth/wrong-password' || 
          err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        // For signup, use generic message to prevent email enumeration
        setError('Unable to create account. Please try a different email or sign in.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('An error occurred. Please try again.');
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
          <p className="text-sm font-sans" style={{ color: '#64748B', letterSpacing: '0.1em' }}>Welcome to</p>
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
        <DialogContent className="bg-slate-900/80 backdrop-blur-xl border-white/20 max-w-md rounded-2xl [&>button]:text-white">
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
        <DialogContent className="bg-slate-900/80 backdrop-blur-xl border-white/20 max-w-lg max-h-[80vh] rounded-2xl [&>button]:text-white">
          <DialogHeader>
            <DialogTitle className="text-white font-sans">Privacy Policy</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="text-sm text-white font-sans space-y-4 text-left">
              <p>We are very pleased about your interest in our company. Data protection is of a particularly high priority for the management of NivoTools. Use of the NivoTools website is generally possible without providing any personal data. However, if a data subject wishes to use special services of our company via our website, the processing of personal data may become necessary. If the processing of personal data is necessary and there is no legal basis for such processing, we generally obtain the consent of the data subject.</p>
              <p>The processing of personal data, such as the name, address, e-mail address, or telephone number of a data subject, is always carried out in accordance with the General Data Protection Regulation (GDPR) and in accordance with the country-specific data protection regulations applicable to NivoTools. By means of this privacy policy, our company wishes to inform the public about the type, scope, and purpose of the personal data we collect, use, and process. Furthermore, data subjects are informed of their rights by means of this privacy policy.</p>
              <p>As the controller, NivoTools has implemented numerous technical and organizational measures to ensure the most complete protection of personal data processed through this website. However, internet-based data transmissions can fundamentally have security gaps, so absolute protection cannot be guaranteed. For this reason, every data subject is free to transmit personal data to us via alternative means, for example by telephone.</p>
              
              <h3 className="font-bold mt-4">Definitions</h3>
              <p>The privacy policy of NivoTools is based on the terminology used by the European legislator for the adoption of the General Data Protection Regulation (GDPR). Our privacy policy should be easy to read and understand for the public as well as for our customers and business partners. To ensure this, we would like to explain the terminology used in advance.</p>
              <p>In this privacy policy, we use, among others, the following terms:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>a) Personal data:</strong> Personal data means any information relating to an identified or identifiable natural person (hereinafter "data subject"). An identifiable natural person is one who can be identified, directly or indirectly, in particular by reference to an identifier such as a name, an identification number, location data, an online identifier, or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural, or social identity of that natural person.</li>
                <li><strong>b) Data subject:</strong> A data subject is any identified or identifiable natural person whose personal data is processed by the controller.</li>
                <li><strong>c) Processing:</strong> Processing is any operation or set of operations which is performed on personal data or on sets of personal data, whether or not by automated means, such as collection, recording, organization, structuring, storage, adaptation or alteration, retrieval, consultation, use, disclosure by transmission, dissemination or otherwise making available, alignment or combination, restriction, erasure or destruction.</li>
                <li><strong>d) Restriction of processing:</strong> Restriction of processing is the marking of stored personal data with the aim of limiting their processing in the future.</li>
                <li><strong>e) Profiling:</strong> Profiling means any form of automated processing of personal data consisting of the use of personal data to evaluate certain personal aspects relating to a natural person, in particular to analyze or predict aspects concerning that natural person's performance at work, economic situation, health, personal preferences, interests, reliability, behavior, location or movements.</li>
                <li><strong>f) Pseudonymization:</strong> Pseudonymization is the processing of personal data in such a manner that the personal data can no longer be attributed to a specific data subject without the use of additional information, provided that such additional information is kept separately and is subject to technical and organizational measures to ensure that the personal data are not attributed to an identified or identifiable natural person.</li>
                <li><strong>g) Controller or person responsible for processing:</strong> Controller or person responsible for processing is the natural or legal person, public authority, agency or other body which, alone or jointly with others, determines the purposes and means of the processing of personal data.</li>
                <li><strong>h) Processor:</strong> Processor is a natural or legal person, public authority, agency or other body which processes personal data on behalf of the controller.</li>
                <li><strong>i) Recipient:</strong> Recipient is a natural or legal person, public authority, agency or another body, to which the personal data are disclosed, whether a third party or not.</li>
                <li><strong>j) Third party:</strong> Third party is a natural or legal person, public authority, agency or body other than the data subject, controller, processor and persons who, under the direct authority of the controller or processor, are authorized to process personal data.</li>
                <li><strong>k) Consent:</strong> Consent of the data subject is any freely given, specific, informed and unambiguous indication of the data subject's wishes by which he or she, by a statement or by a clear affirmative action, signifies agreement to the processing of personal data relating to him or her.</li>
              </ul>
              
              <h3 className="font-bold mt-4">Name and Address of the Controller</h3>
              <p>The controller for the purposes of the General Data Protection Regulation, other data protection laws applicable in the Member States of the European Union, and other provisions related to data protection is:</p>
              <p>Julian Lohwasser c/o Block Services Stuttgarter Str. 106 70736 Fellbach Germany Tel.: 015679758515 Email: nivotools@gmail.com Website: bendiq.lovable.app</p>
              
              <h3 className="font-bold mt-4">Cookies</h3>
              <p>The website of NivoTools uses cookies. Cookies are text files that are placed and stored on a computer system via an internet browser.</p>
              <p>Numerous websites and servers use cookies. Many cookies contain a so-called cookie ID. A cookie ID is a unique identifier of the cookie. It consists of a character string through which websites and servers can be assigned to the specific internet browser in which the cookie was stored. This allows visited websites and servers to distinguish the individual browser of the data subject from other internet browsers that contain other cookies. A specific internet browser can be recognized and identified via the unique cookie ID.</p>
              <p>Through the use of cookies, NivoTools can provide the users of this website with more user-friendly services that would not be possible without the setting of cookies.</p>
              <p>By means of a cookie, the information and offers on our website can be optimized with the user in mind. Cookies allow us, as previously mentioned, to recognize our website users. The purpose of this recognition is to make it easier for users to utilize our website.</p>
              <p>The data subject can prevent the setting of cookies through our website at any time by means of a corresponding setting of the internet browser used and thus permanently object to the setting of cookies. Furthermore, cookies that have already been set can be deleted at any time via an internet browser or other software programs. This is possible in all common internet browsers. If the data subject deactivates the setting of cookies in the internet browser used, not all functions of our website may be fully usable.</p>
              
              <h3 className="font-bold mt-4">Collection of General Data and Information</h3>
              <p>The website of NivoTools collects a series of general data and information when a data subject or automated system calls up the website. This general data and information are stored in the server log files. The following may be collected: (1) browser types and versions used, (2) the operating system used by the accessing system, (3) the website from which an accessing system reaches our website (so-called referrers), (4) the sub-websites accessed via an accessing system on our website, (5) the date and time of access to the website, (6) an internet protocol address (IP address), (7) the internet service provider of the accessing system, and (8) any other similar data and information that may be used in the event of attacks on our information technology systems.</p>
              <p>When using these general data and information, NivoTools does not draw any conclusions about the data subject. Rather, this information is needed to (1) deliver the content of our website correctly, (2) optimize the content of our website as well as its advertisement, (3) ensure the long-term viability of our information technology systems and website technology, and (4) provide law enforcement authorities with the information necessary for criminal prosecution in case of a cyber-attack.</p>
              
              <h3 className="font-bold mt-4">Registration on Our Website</h3>
              <p>The data subject has the possibility to register on the website of the controller with the indication of personal data. Which personal data are transmitted to the controller is determined by the respective input mask used for the registration. The personal data entered by the data subject are collected and stored exclusively for internal use by the controller and for its own purposes.</p>
              <p>By registering on the website of the controller, the IP address—assigned by the internet service provider (ISP) and used by the data subject—date, and time of the registration are also stored. The storage of this data takes place against the background that this is the only way to prevent the misuse of our services, and, if necessary, to make it possible to investigate committed offenses.</p>
              <p>The registration of the data subject, with the voluntary indication of personal data, is intended to enable the controller to offer the data subject contents or services that may only be offered to registered users due to the nature of the matter in question. Registered persons are free to change the personal data specified during the registration at any time, or to have them completely deleted from the data stock of the controller.</p>
              <p>The data controller shall, at any time, provide information upon request to each data subject as to what personal data are stored about the data subject. In addition, the data controller shall correct or erase personal data at the request or indication of the data subject, insofar as there are no statutory storage obligations.</p>
              
              <h3 className="font-bold mt-4">Routine Erasure and Blocking of Personal Data</h3>
              <p>The data controller shall process and store the personal data of the data subject only for the period necessary to achieve the purpose of storage, or as far as this is granted by the European legislator or other legislators in laws or regulations to which the controller is subject.</p>
              <p>If the storage purpose is not applicable, or if a storage period prescribed by the European legislator or another competent legislator expires, the personal data are routinely blocked or erased in accordance with legal requirements.</p>
              
              <h3 className="font-bold mt-4">Rights of the Data Subject</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>a) Right of confirmation:</strong> Each data subject shall have the right granted by the European legislator to obtain from the controller the confirmation as to whether or not personal data concerning him or her are being processed.</li>
                <li><strong>b) Right of access:</strong> Each data subject shall have the right granted by the European legislator to obtain from the controller free information about his or her personal data stored at any time and a copy of this information. Furthermore, the European directives and regulations grant the data subject access to information about the purposes of the processing, the categories of personal data concerned, and the recipients or categories of recipients.</li>
                <li><strong>c) Right to rectification:</strong> Each data subject shall have the right granted by the European legislator to obtain from the controller without undue delay the rectification of inaccurate personal data concerning him or her.</li>
                <li><strong>d) Right to erasure (Right to be forgotten):</strong> Each data subject shall have the right granted by the European legislator to obtain from the controller the erasure of personal data concerning him or her without undue delay, and the controller shall have the obligation to erase personal data without undue delay where one of the following grounds applies: the personal data are no longer necessary in relation to the purposes for which they were collected; the data subject withdraws consent; the data subject objects to the processing; the personal data have been unlawfully processed; or the personal data must be erased for compliance with a legal obligation.</li>
                <li><strong>e) Right to restriction of processing:</strong> Each data subject shall have the right granted by the European legislator to obtain from the controller restriction of processing where the accuracy of the personal data is contested, the processing is unlawful, or the controller no longer needs the personal data for the purposes of the processing.</li>
                <li><strong>f) Right to data portability:</strong> Each data subject shall have the right granted by the European legislator to receive the personal data concerning him or her, which was provided to a controller, in a structured, commonly used and machine-readable format.</li>
                <li><strong>g) Right to object:</strong> Each data subject shall have the right granted by the European legislator to object, on grounds relating to his or her particular situation, at any time, to processing of personal data concerning him or her.</li>
                <li><strong>h) Automated individual decision-making, including profiling:</strong> Each data subject shall have the right granted by the European legislator not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning him or her.</li>
                <li><strong>i) Right to withdraw data protection consent:</strong> Each data subject shall have the right granted by the European legislator to withdraw his or her consent to processing of his or her personal data at any time.</li>
              </ul>
              
              <h3 className="font-bold mt-4">Data Protection Provisions about Google AdSense, Analytics, Remarketing & AdWords</h3>
              <p>The controller has integrated Google AdSense on this website. Google AdSense is an online service which allows the placement of advertising on third-party sites. Google AdSense is based on an algorithm that selects advertisements displayed on third-party sites to match with the content of the respective third-party site.</p>
              <p>The controller has integrated the component of Google Analytics (with the anonymization function) on this website. Google Analytics is a web analytics service. Web analytics is the collection, gathering, and analysis of data about the behavior of visitors to websites. For the web analytics through Google Analytics, the controller uses the application "_gat._anonymizeIp". By means of this application, the IP address of the internet connection of the data subject is abridged by Google and anonymized when accessing our websites from a Member State of the European Union.</p>
              <p>The controller has also integrated Google Remarketing services on this website. Google Remarketing is a feature of Google AdWords that allows an enterprise to display advertising to internet users who have previously resided on the enterprise's website.</p>
              <p>The operating company of these Google services is Google Ireland Limited, Gordon House, Barrow Street, Dublin, D04 E5W5, Ireland.</p>
              
              <h3 className="font-bold mt-4">Legal Basis for Processing</h3>
              <p>Art. 6(1) lit. a GDPR serves as the legal basis for processing operations for which we obtain consent for a specific processing purpose. If the processing of personal data is necessary for the performance of a contract to which the data subject is party, the processing is based on Article 6(1) lit. b GDPR. The same applies to such processing operations which are necessary for carrying out pre-contractual measures. Is our company subject to a legal obligation by which processing of personal data is required, such as for the fulfillment of tax obligations, the processing is based on Art. 6(1) lit. c GDPR. In rare cases, the processing of personal data may be necessary to protect the vital interests of the data subject or of another natural person (Art. 6(1) lit. d GDPR). Finally, processing operations could be based on Article 6(1) lit. f GDPR.</p>
              
              <h3 className="font-bold mt-4">Legitimate Interests Pursued by the Controller or by a Third Party</h3>
              <p>Where the processing of personal data is based on Article 6(1) lit. f GDPR, our legitimate interest is to carry out our business in favor of the well-being of all our employees and the shareholders.</p>
              
              <h3 className="font-bold mt-4">Period for Which the Personal Data Will Be Stored</h3>
              <p>The criteria used to determine the period of storage of personal data is the respective statutory retention period. After expiration of that period, the corresponding data is routinely deleted, as long as it is no longer necessary for the fulfillment of the contract or the initiation of a contract.</p>
              
              <h3 className="font-bold mt-4">Provision of Personal Data as Statutory or Contractual Requirement</h3>
              <p>We clarify that the provision of personal data is partly required by law (e.g. tax regulations) or can also result from contractual provisions (e.g. information on the contractual partner). Sometimes it may be necessary to conclude a contract that the data subject provides us with personal data, which must subsequently be processed by us. The data subject is, for example, obliged to provide us with personal data when our company signs a contract with him or her. The non-provision of the personal data would have the consequence that the contract with the data subject could not be concluded.</p>
              
              <h3 className="font-bold mt-4">Existence of Automated Decision-Making</h3>
              <p>As a responsible company, we do not use automatic decision-making or profiling.</p>
              
              <h3 className="font-bold mt-4">Hosting & Platform (Lovable)</h3>
              <p>This website is provided via the Lovable platform (operated by Lovable Labs AG). Lovable provides the information technology infrastructure through which the user accesses the app. As part of this technical process, server log files (IP address, browser type) are collected by Lovable Labs AG for the purpose of ensuring the technical stability and security of the application.</p>
              
              <h3 className="font-bold mt-4">Use of Median (App Wrapper)</h3>
              <p>We use the service Median (GoNative.io LLC, USA) to provide our mobile application. Median allows us to deliver our web application as a native app for mobile devices. When accessing the app via the APK/App interface, technical data (e.g., IP address, browser type, device operating system) is transmitted to Median's servers to ensure the functionality and stability of the app shell. This constitutes a legitimate interest pursuant to Art. 6 (1) lit. f GDPR. For the transfer of data to the USA, the provider uses Standard Contractual Clauses (SCCs) of the EU Commission.</p>
              
              <h3 className="font-bold mt-4">Data Protection Provisions for Google Firebase (Authentication & Firestore)</h3>
              <p>The controller has integrated components of Google Firebase on this website. Firebase is a platform from Google for developing web and mobile applications.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Authentication:</strong> We use Firebase Authentication to identify and manage user accounts. Personal data such as email addresses and user IDs are processed for the purpose of authentication.</li>
                <li><strong>Firestore:</strong> We use Firestore for cloud-based storage and synchronization of project data (bending values and app-specific settings). Project data is stored on Google servers.</li>
                <li><strong>Third-country transfer:</strong> The use of Google Firebase involves the transfer of data to the United States of America. Google uses standard contractual clauses approved by the European Commission for this purpose, which represent an appropriate guarantee for the security of data transfer to third countries.</li>
              </ul>
              
              <h3 className="font-bold mt-4">Use of Device Sensors (Gyroscope & Camera)</h3>
              <p>The BendIQ app uses specific hardware components of your end device to provide technical functions:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Gyroscope:</strong> Angle measurement is performed via the motion sensors built into the end device. The processing of this sensor data takes place exclusively locally on your end device and serves the real-time display of the inclination angle. No storage or transmission of this movement data to external servers takes place.</li>
                <li><strong>Camera/Light:</strong> Activating the flashlight requires access to the camera unit. The app exclusively uses the flash/light element; no image data is captured, stored, or transmitted.</li>
              </ul>
              
              <h3 className="font-bold mt-4">Use of Local Storage (Extended Cookie Definition)</h3>
              <p>In addition to cookies, this website uses the browser's "Local Storage" to store functional app data on the user's end device. Information that remains without a server connection is stored in the local storage, including:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Design mode (Dark/Light)</li>
                <li>Progress and rotation of motivational messages</li>
                <li>Progress and rotation of question of the day</li>
                <li>Progress of terms and questions</li>
              </ul>
              
              <h3 className="font-bold mt-4">Data Security (Encryption)</h3>
              <p>To secure the transmitted information, this website uses SSL or TLS encryption (HTTPS). This encryption protects the data transmission between the app interface and the Google Firebase database from unauthorized access by third parties.</p>
              
              <p className="text-xs text-slate-400 mt-6">This privacy policy was created by the Privacy Policy Generator of the DGD Deutsche Gesellschaft für Datenschutz GmbH, acting as External Data Protection Officer Munich, in cooperation with the Cologne IT and data protection lawyer Christian Solmecke.</p>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;

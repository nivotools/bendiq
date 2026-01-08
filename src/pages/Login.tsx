import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, firebaseError } from "@/lib/firebase";
import { Loader2, Mail, Lock, Chrome, AlertCircle } from "lucide-react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import bendiqLogo from "@/assets/bendiq-logo.png";

// Zod schemas for validation
const emailSchema = z.string().trim().email("Invalid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  // Dialog states
  const [showImprint, setShowImprint] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Show error if Firebase isn't available
  if (!auth || firebaseError) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-5 font-sans">
        <div className="text-center max-w-sm">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Authentication Unavailable</h1>
          <p className="text-slate-400 text-sm mb-4">
            {firebaseError || "Unable to connect to authentication service."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Helper to map Firebase error codes to user-friendly messages
  const getErrorMessage = (code: string) => {
    switch (code) {
      case "auth/user-not-found":
        return "No account found with this email";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/email-already-in-use":
        return "An account already exists with this email";
      case "auth/weak-password":
        return "Password should be at least 6 characters";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later";
      case "auth/popup-closed-by-user":
        return "Sign-in popup was closed";
      case "auth/invalid-credential":
        return "Invalid email or password";
      default:
        return "An error occurred. Please try again";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate inputs using Zod
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setError(emailResult.error.errors[0].message);
      return;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      setError(passwordResult.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth!, email, password);
      } else {
        await createUserWithEmailAndPassword(auth!, email, password);
      }
      navigate("/");
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error(err);
      }
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth!, provider);
      navigate("/");
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error(err);
      }
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetMessage("");

    const emailResult = emailSchema.safeParse(resetEmail);
    if (!emailResult.success) {
      setResetError(emailResult.error.errors[0].message);
      return;
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth!, resetEmail);
      setResetMessage("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error(err);
      }
      setResetError(getErrorMessage(err.code));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-5 font-sans">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <img 
            src={bendiqLogo} 
            alt="BendIQ Logo" 
            className="w-24 h-24 mx-auto mb-4 object-contain"
          />
          <p className="text-slate-400 text-sm font-sans">Welcome to</p>
          <h1 className="text-3xl font-bold text-white font-sans tracking-wide">
            BENDIQ
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-2 italic">
            Professional Conduit Bending
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-white text-lg font-bold mb-6 text-center font-sans">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-slate-900 font-bold py-3 px-4 rounded-xl transition-all active:scale-98 disabled:opacity-50 mb-4 font-sans"
          >
            <Chrome size={20} />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-slate-500 text-xs font-bold uppercase font-sans">or</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-sans"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-sans"
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setResetEmail(email);
                    setResetMessage("");
                    setResetError("");
                  }}
                  className="text-blue-500 text-sm hover:text-blue-400 transition-colors font-sans"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm text-center font-sans">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 font-sans"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-slate-400 text-sm hover:text-white transition-colors font-sans"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-blue-500 font-bold">{isLogin ? "Sign Up" : "Sign In"}</span>
            </button>
          </div>
        </div>

        {/* Footer with Imprint and Privacy Policy */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setShowImprint(true)}
            className="text-slate-500 text-xs hover:text-slate-300 transition-colors font-sans"
          >
            Imprint
          </button>
          <span className="text-slate-700">|</span>
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
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white font-sans">Reset Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordReset} className="space-y-4 mt-4">
            <p className="text-slate-400 text-sm font-sans">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                placeholder="Email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-sans"
              />
            </div>

            {resetError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm text-center font-sans">
                {resetError}
              </div>
            )}

            {resetMessage && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-green-400 text-sm text-center font-sans">
                {resetMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 font-sans"
            >
              {resetLoading && <Loader2 size={18} className="animate-spin" />}
              Send Reset Link
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Imprint Dialog */}
      <Dialog open={showImprint} onOpenChange={setShowImprint}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white font-sans">Imprint</DialogTitle>
          </DialogHeader>
          <div className="text-slate-300 text-sm space-y-1 mt-4 font-sans">
            <p>Julian Lohwasser</p>
            <p>c/o Block Services</p>
            <p>Stuttgarter Str. 106</p>
            <p>70736 Fellbach</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-white font-sans">Privacy Policy</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="text-slate-300 text-sm space-y-4 font-sans">
              <p>We are very pleased about your interest in our company. Data protection is of a particularly high priority for the management of NivoTools. Use of the NivoTools website is generally possible without providing any personal data. However, if a data subject wishes to use special services of our company via our website, the processing of personal data may become necessary. If the processing of personal data is necessary and there is no legal basis for such processing, we generally obtain the consent of the data subject.</p>
              
              <p>The processing of personal data, such as the name, address, e-mail address, or telephone number of a data subject, is always carried out in accordance with the General Data Protection Regulation (GDPR) and in accordance with the country-specific data protection regulations applicable to NivoTools. By means of this privacy policy, our company wishes to inform the public about the type, scope, and purpose of the personal data we collect, use, and process. Furthermore, data subjects are informed of their rights by means of this privacy policy.</p>
              
              <p>As the controller, NivoTools has implemented numerous technical and organizational measures to ensure the most complete protection of personal data processed through this website. However, internet-based data transmissions can fundamentally have security gaps, so absolute protection cannot be guaranteed. For this reason, every data subject is free to transmit personal data to us via alternative means, for example by telephone.</p>

              <h3 className="text-white font-bold mt-6">Definitions</h3>
              <p>The privacy policy of NivoTools is based on the terminology used by the European legislator for the adoption of the General Data Protection Regulation (GDPR). Our privacy policy should be easy to read and understand for the public as well as for our customers and business partners. To ensure this, we would like to explain the terminology used in advance.</p>
              
              <p>In this privacy policy, we use, among others, the following terms:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Personal data:</strong> Personal data means any information relating to an identified or identifiable natural person (hereinafter "data subject"). An identifiable natural person is one who can be identified, directly or indirectly, in particular by reference to an identifier such as a name, an identification number, location data, an online identifier, or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural, or social identity of that natural person.</li>
                <li><strong>Data subject:</strong> A data subject is any identified or identifiable natural person whose personal data is processed by the controller.</li>
                <li><strong>Processing:</strong> Processing is any operation or set of operations which is performed on personal data or on sets of personal data, whether or not by automated means, such as collection, recording, organization, structuring, storage, adaptation or alteration, retrieval, consultation, use, disclosure by transmission, dissemination or otherwise making available, alignment or combination, restriction, erasure or destruction.</li>
                <li><strong>Restriction of processing:</strong> Restriction of processing is the marking of stored personal data with the aim of limiting their processing in the future.</li>
                <li><strong>Profiling:</strong> Profiling means any form of automated processing of personal data consisting of the use of personal data to evaluate certain personal aspects relating to a natural person, in particular to analyze or predict aspects concerning that natural person's performance at work, economic situation, health, personal preferences, interests, reliability, behavior, location or movements.</li>
                <li><strong>Pseudonymization:</strong> Pseudonymization is the processing of personal data in such a manner that the personal data can no longer be attributed to a specific data subject without the use of additional information, provided that such additional information is kept separately and is subject to technical and organizational measures to ensure that the personal data are not attributed to an identified or identifiable natural person.</li>
                <li><strong>Controller or person responsible for processing:</strong> Controller or person responsible for processing is the natural or legal person, public authority, agency or other body which, alone or jointly with others, determines the purposes and means of the processing of personal data.</li>
                <li><strong>Processor:</strong> Processor is a natural or legal person, public authority, agency or other body which processes personal data on behalf of the controller.</li>
                <li><strong>Recipient:</strong> Recipient is a natural or legal person, public authority, agency or another body, to which the personal data are disclosed, whether a third party or not.</li>
                <li><strong>Third party:</strong> Third party is a natural or legal person, public authority, agency or body other than the data subject, controller, processor and persons who, under the direct authority of the controller or processor, are authorized to process personal data.</li>
                <li><strong>Consent:</strong> Consent of the data subject is any freely given, specific, informed and unambiguous indication of the data subject's wishes by which he or she, by a statement or by a clear affirmative action, signifies agreement to the processing of personal data relating to him or her.</li>
              </ul>

              <h3 className="text-white font-bold mt-6">Name and Address of the Controller</h3>
              <p>The controller for the purposes of the General Data Protection Regulation, other data protection laws applicable in the Member States of the European Union, and other provisions related to data protection is:</p>
              <p>Julian Lohwasser c/o Block Services Stuttgarter Str. 106 70736 Fellbach Germany Tel.: 015679758515 Email: nivotools@gmail.com Website: bendiq.lovable.app</p>

              <h3 className="text-white font-bold mt-6">Cookies</h3>
              <p>The website of NivoTools uses cookies. Cookies are text files that are placed and stored on a computer system via an internet browser.</p>
              <p>Numerous websites and servers use cookies. Many cookies contain a so-called cookie ID. A cookie ID is a unique identifier of the cookie. It consists of a character string through which websites and servers can be assigned to the specific internet browser in which the cookie was stored. This allows visited websites and servers to distinguish the individual browser of the data subject from other internet browsers that contain other cookies. A specific internet browser can be recognized and identified via the unique cookie ID.</p>
              <p>Through the use of cookies, NivoTools can provide the users of this website with more user-friendly services that would not be possible without the setting of cookies.</p>
              <p>The data subject can prevent the setting of cookies through our website at any time by means of a corresponding setting of the internet browser used and thus permanently object to the setting of cookies. Furthermore, cookies that have already been set can be deleted at any time via an internet browser or other software programs. This is possible in all common internet browsers. If the data subject deactivates the setting of cookies in the internet browser used, not all functions of our website may be fully usable.</p>

              <h3 className="text-white font-bold mt-6">Collection of General Data and Information</h3>
              <p>The website of NivoTools collects a series of general data and information when a data subject or automated system calls up the website. This general data and information are stored in the server log files. The following may be collected: (1) browser types and versions used, (2) the operating system used by the accessing system, (3) the website from which an accessing system reaches our website (so-called referrers), (4) the sub-websites accessed via an accessing system on our website, (5) the date and time of access to the website, (6) an internet protocol address (IP address), (7) the internet service provider of the accessing system, and (8) any other similar data and information that may be used in the event of attacks on our information technology systems.</p>
              <p>When using these general data and information, NivoTools does not draw any conclusions about the data subject. Rather, this information is needed to (1) deliver the content of our website correctly, (2) optimize the content of our website as well as its advertisement, (3) ensure the long-term viability of our information technology systems and website technology, and (4) provide law enforcement authorities with the information necessary for criminal prosecution in case of a cyber-attack.</p>

              <h3 className="text-white font-bold mt-6">Registration on Our Website</h3>
              <p>The data subject has the possibility to register on the website of the controller with the indication of personal data. Which personal data are transmitted to the controller is determined by the respective input mask used for the registration. The personal data entered by the data subject are collected and stored exclusively for internal use by the controller and for its own purposes.</p>
              <p>By registering on the website of the controller, the IP address—assigned by the internet service provider (ISP) and used by the data subject—date, and time of the registration are also stored. The storage of this data takes place against the background that this is the only way to prevent the misuse of our services, and, if necessary, to make it possible to investigate committed offenses.</p>

              <h3 className="text-white font-bold mt-6">Routine Erasure and Blocking of Personal Data</h3>
              <p>The data controller shall process and store the personal data of the data subject only for the period necessary to achieve the purpose of storage, or as far as this is granted by the European legislator or other legislators in laws or regulations to which the controller is subject.</p>
              <p>If the storage purpose is not applicable, or if a storage period prescribed by the European legislator or another competent legislator expires, the personal data are routinely blocked or erased in accordance with legal requirements.</p>

              <h3 className="text-white font-bold mt-6">Rights of the Data Subject</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Right of confirmation:</strong> Each data subject shall have the right granted by the European legislator to obtain from the controller the confirmation as to whether or not personal data concerning him or her are being processed.</li>
                <li><strong>Right of access:</strong> Each data subject shall have the right granted by the European legislator to obtain from the controller free information about his or her personal data stored at any time and a copy of this information.</li>
                <li><strong>Right to rectification:</strong> Each data subject shall have the right granted by the European legislator to obtain from the controller without undue delay the rectification of inaccurate personal data concerning him or her.</li>
                <li><strong>Right to erasure (Right to be forgotten):</strong> Each data subject shall have the right granted by the European legislator to obtain from the controller the erasure of personal data concerning him or her without undue delay.</li>
                <li><strong>Right to restriction of processing:</strong> Each data subject shall have the right granted by the European legislator to obtain from the controller restriction of processing.</li>
                <li><strong>Right to data portability:</strong> Each data subject shall have the right granted by the European legislator to receive the personal data concerning him or her in a structured, commonly used and machine-readable format.</li>
                <li><strong>Right to object:</strong> Each data subject shall have the right granted by the European legislator to object, on grounds relating to his or her particular situation, at any time, to processing of personal data concerning him or her.</li>
                <li><strong>Right to withdraw data protection consent:</strong> Each data subject shall have the right granted by the European legislator to withdraw his or her consent to processing of his or her personal data at any time.</li>
              </ul>

              <h3 className="text-white font-bold mt-6">Data Protection Provisions about the Application and Use of Google AdSense</h3>
              <p>The controller has integrated Google AdSense on this website. Google AdSense is an online service which allows the placement of advertising on third-party sites. The operating company of the Google AdSense component is Google Ireland Limited, Gordon House, Barrow Street, Dublin, D04 E5W5, Ireland.</p>

              <h3 className="text-white font-bold mt-6">Data Protection Provisions about the Application and Use of Google Analytics</h3>
              <p>The controller has integrated the component of Google Analytics (with the anonymization function) on this website. Google Analytics is a web analytics service. The operator of the Google Analytics component is Google Ireland Limited, Gordon House, Barrow Street, Dublin, D04 E5W5, Ireland.</p>
              <p>For the web analytics through Google Analytics, the controller uses the application "_gat. _anonymizeIp". By means of this application, the IP address of the internet connection of the data subject is abridged by Google and anonymized when accessing our websites from a Member State of the European Union or another Contracting State to the Agreement on the European Economic Area.</p>

              <h3 className="text-white font-bold mt-6">Legal Basis for Processing</h3>
              <p>Art. 6(1) lit. a GDPR serves as the legal basis for processing operations for which we obtain consent for a specific processing purpose. If the processing of personal data is necessary for the performance of a contract to which the data subject is party, the processing is based on Article 6(1) lit. b GDPR.</p>

              <h3 className="text-white font-bold mt-6">Hosting & Platform (Lovable)</h3>
              <p>This website is provided via the Lovable platform (operated by Lovable Labs AG). Lovable provides the information technology infrastructure through which the user accesses the app. As part of this technical process, server log files (IP address, browser type) are collected by Lovable Labs AG for the purpose of ensuring the technical stability and security of the application.</p>

              <h3 className="text-white font-bold mt-6">Data Protection Provisions for Google Firebase</h3>
              <p>The controller has integrated components of Google Firebase on this website. Firebase is a platform from Google for developing web and mobile applications.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Authentication:</strong> We use Firebase Authentication to identify and manage user accounts. Personal data such as email addresses and user IDs are processed for the purpose of authentication.</li>
                <li><strong>Firestore:</strong> We use Firestore for cloud-based storage and synchronization of project data (bending values and app-specific settings). Project data is stored on Google servers.</li>
                <li><strong>Third-country transfer:</strong> The use of Google Firebase involves the transfer of data to the United States of America. Google uses standard contractual clauses approved by the European Commission for this purpose.</li>
              </ul>

              <h3 className="text-white font-bold mt-6">Use of Device Sensors</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Gyroscope:</strong> Angle measurement is performed via the motion sensors built into the end device. The processing of this sensor data takes place exclusively locally on your end device and serves the real-time display of the inclination angle. No storage or transmission of this movement data to external servers takes place.</li>
                <li><strong>Camera/Light:</strong> Activating the flashlight requires access to the camera unit. The app exclusively uses the flash/light element; no image data is captured, stored, or transmitted.</li>
              </ul>

              <h3 className="text-white font-bold mt-6">Use of Local Storage</h3>
              <p>In addition to cookies, this website uses the browser's "Local Storage" to store functional app data on the user's end device. Information that remains without a server connection is stored in the local storage, including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Language settings (DE/EN)</li>
                <li>Selected units of measurement (CM/INCH)</li>
                <li>Design mode (Dark/Light)</li>
                <li>Progress and rotation of motivational messages</li>
              </ul>

              <h3 className="text-white font-bold mt-6">Data Security (Encryption)</h3>
              <p>To secure the transmitted information, this website uses SSL or TLS encryption (HTTPS). This encryption protects the data transmission between the app interface and the Google Firebase database from unauthorized access by third parties.</p>

              <p className="text-slate-500 text-xs mt-6">This privacy policy was created by the Privacy Policy Generator of the DGD Deutsche Gesellschaft für Datenschutz GmbH, acting as External Data Protection Officer Munich, in cooperation with the Cologne IT and data protection lawyer Christian Solmecke.</p>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;

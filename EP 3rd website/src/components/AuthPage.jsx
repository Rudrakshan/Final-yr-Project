import React, { useState } from 'react';
import { 
  Globe, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Mail,
  User,
  ShieldCheck
} from 'lucide-react';

export default function AuthPage({ onNavigate }) {
  const [showIntro, setShowIntro] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Form State - Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Form State - Sign Up
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Feedback State
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login Submit Handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (!loginEmail.includes('@') || !loginEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setSuccessMsg('Authentication successful! Taking you to EcoPredict...');
    setTimeout(() => {
      onNavigate('platform');
    }, 600);
  };

  // Sign Up Submit Handler
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signUpName || !signUpEmail || !signUpPassword || !signUpConfirmPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (!signUpEmail.includes('@') || !signUpEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (signUpPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify and try again.');
      return;
    }

    setSuccessMsg('Account created successfully! Taking you to EcoPredict...');
    setTimeout(() => {
      onNavigate('platform');
    }, 600);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!loginEmail) {
      setErrorMsg('Please enter your email address first to reset password.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg(`Password reset instructions sent to ${loginEmail}.`);
  };

  return (
    <div style={containerStyle}>
      {/* Top Header Bar */}
      <header style={headerStyle}>
        <button onClick={() => onNavigate('landing')} style={backButtonStyle}>
          <ArrowLeft style={{ width: '15px', height: '15px' }} />
          <span>Back to Landing Page</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={brandIconStyle}>
            <Globe style={{ width: '17px', height: '17px', color: '#FFFFFF' }} />
          </div>
          <span style={brandTitleStyle}>
            Eco<span style={{ color: '#B08D3C' }}>Predict</span>
          </span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main style={mainContentStyle}>
        <div style={panelStyle}>
          {/* Top Form Header */}
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <div className="badge-gold" style={{ marginBottom: '14px' }}>
              <ShieldCheck style={{ width: '13px', height: '13px' }} />
              {isSignUp ? 'New Account Registration' : 'Account Access'}
            </div>

            <h2 style={formHeadingStyle}>
              {isSignUp ? 'Create your EcoPredict account' : 'Welcome back'}
            </h2>
            <p style={formSubtextStyle}>
              {isSignUp 
                ? 'Begin exploring environmental intelligence.' 
                : 'Sign in to access your saved locations and decision analysis.'}
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div style={errorBannerStyle}>
              <AlertCircle style={{ width: '15px', height: '15px', flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={successBannerStyle}>
              <CheckCircle2 style={{ width: '15px', height: '15px', flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <div>
            {!isSignUp ? (
              /* LOGIN FORM */
              <form
                onSubmit={handleLoginSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'fadeIn 0.2s ease' }}
              >
                {/* Email Field */}
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <div style={inputWrapperStyle}>
                    <Mail style={inputIconStyle} />
                    <input
                      type="email"
                      required
                      placeholder="name@organization.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                    <button 
                      type="button" 
                      onClick={handleForgotPassword} 
                      style={forgotLinkStyle}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={inputWrapperStyle}>
                    <KeyRound style={inputIconStyle} />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      style={eyeToggleStyle}
                      aria-label="Toggle password visibility"
                    >
                      {showLoginPassword ? <EyeOff style={{ width: '15px', height: '15px' }} /> : <Eye style={{ width: '15px', height: '15px' }} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn-gold" style={submitButtonStyle}>
                  <span>Sign In</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>

                {/* Switch to Sign Up */}
                <div style={switchPromptStyle}>
                  <span>Don't have an account?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    style={switchLinkStyle}
                  >
                    Register
                  </button>
                </div>
              </form>
            ) : (
              /* SIGN-UP FORM */
              <form
                onSubmit={handleSignUpSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.2s ease' }}
              >
                {/* Full Name */}
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <div style={inputWrapperStyle}>
                    <User style={inputIconStyle} />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <div style={inputWrapperStyle}>
                    <Mail style={inputIconStyle} />
                    <input
                      type="email"
                      required
                      placeholder="name@organization.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={inputWrapperStyle}>
                    <KeyRound style={inputIconStyle} />
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 6 characters"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      style={eyeToggleStyle}
                    >
                      {showSignUpPassword ? <EyeOff style={{ width: '15px', height: '15px' }} /> : <Eye style={{ width: '15px', height: '15px' }} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={labelStyle}>Confirm Password</label>
                  <div style={inputWrapperStyle}>
                    <KeyRound style={inputIconStyle} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Repeat password"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={eyeToggleStyle}
                    >
                      {showConfirmPassword ? <EyeOff style={{ width: '15px', height: '15px' }} /> : <Eye style={{ width: '15px', height: '15px' }} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn-gold" style={submitButtonStyle}>
                  <span>Create Account</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>

                {/* Switch to Login */}
                <div style={switchPromptStyle}>
                  <span>Already registered?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    style={switchLinkStyle}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Inline Style Definitions for Clean Warm Light Theme
const containerStyle = {
  position: 'relative',
  minHeight: '100vh',
  backgroundColor: '#F7F6F2',
  color: '#242424',
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle = {
  padding: '20px 36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid #E5E3DD',
  backgroundColor: '#FFFFFF',
};

const backButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 14px',
  borderRadius: '6px',
  backgroundColor: '#F7F6F2',
  border: '1px solid #D9D7D0',
  color: '#66645F',
  fontSize: '0.84rem',
  fontWeight: '500',
  cursor: 'pointer',
};

const brandIconStyle = {
  width: '26px',
  height: '26px',
  borderRadius: '6px',
  backgroundColor: '#B08D3C',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const brandTitleStyle = {
  fontSize: '1.15rem',
  fontWeight: '800',
  fontFamily: 'var(--font-heading)',
  color: '#242424',
};

const mainContentStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 24px',
};

const panelStyle = {
  width: '100%',
  maxWidth: '440px',
  padding: '36px 32px',
  backgroundColor: '#FFFFFF',
  border: '1px solid #D9D7D0',
  borderRadius: '14px',
  boxShadow: 'var(--shadow-card)',
};

const formHeadingStyle = {
  fontSize: '1.5rem',
  fontWeight: '800',
  color: '#242424',
  marginBottom: '6px',
};

const formSubtextStyle = {
  fontSize: '0.88rem',
  color: '#66645F',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: '700',
  color: '#77756F',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const inputWrapperStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const inputIconStyle = {
  position: 'absolute',
  left: '12px',
  width: '16px',
  height: '16px',
  color: '#8A8882',
  pointerEvents: 'none',
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px 10px 38px',
  backgroundColor: '#FFFFFF',
  border: '1px solid #D9D7D0',
  borderRadius: '8px',
  color: '#242424',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.15s ease',
};

const eyeToggleStyle = {
  position: 'absolute',
  right: '10px',
  background: 'none',
  border: 'none',
  color: '#8A8882',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const forgotLinkStyle = {
  background: 'none',
  border: 'none',
  color: '#8E712C',
  fontSize: '0.78rem',
  fontWeight: '600',
  cursor: 'pointer',
  padding: 0,
};

const submitButtonStyle = {
  width: '100%',
  justifyContent: 'center',
  padding: '11px',
  marginTop: '6px',
  fontSize: '0.9rem',
};

const switchPromptStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  fontSize: '0.84rem',
  color: '#66645F',
  marginTop: '10px',
};

const switchLinkStyle = {
  background: 'none',
  border: 'none',
  color: '#B08D3C',
  fontWeight: '700',
  fontSize: '0.84rem',
  cursor: 'pointer',
};

const errorBannerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 14px',
  borderRadius: '8px',
  backgroundColor: '#FEF2F2',
  border: '1px solid #FECACA',
  color: '#C53030',
  fontSize: '0.82rem',
  marginBottom: '16px',
};

const successBannerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 14px',
  borderRadius: '8px',
  backgroundColor: '#EBF4F0',
  border: '1px solid #A7D7C5',
  color: '#2E7D5B',
  fontSize: '0.82rem',
  marginBottom: '16px',
};

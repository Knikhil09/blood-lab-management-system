import React from '../reactRuntime.js';
import { useState } from 'react';
import { Activity, ArrowRight, Eye, EyeOff, FlaskConical, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/AuthContext.jsx';
import { apiConfig } from '../api/apiRoutes.js';
import { BrandMark } from '../components/AppShell.jsx';
import { Button, Field, InlineNotice, TextInput } from '../components/UI.jsx';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    const nextErrors = {};
    if (!username.trim()) nextErrors.username = 'Enter your email or username.';
    if (!password) nextErrors.password = 'Enter your password.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      await signIn({ username: username.trim(), password });
      navigate(location.state?.from || '/', { replace: true });
    } catch (error) {
      setErrorMessage(error.message || 'Unable to sign in. Please try again.');
    }
  }

  function useDemoCredentials() {
    setUsername('lab@clearline.test');
    setPassword('Clearline123!');
    setErrors({});
    setErrorMessage('');
  }

  return (
    <main className="login-screen">
      <section className="login-story">
        <div className="login-brand"><BrandMark /><div><strong>Clearline<span>Lab</span></strong><small>LABORATORY WORKSPACE</small></div></div>
        <div className="login-story-body"><span className="login-kicker"><span /> LAB OPERATIONS · 01</span><h1>Every result,<br /><em>clearly</em> accounted for.</h1><p>A considered workspace for patient records, laboratory results, and the details that connect them.</p>
          <div className="workflow-line"><div className="workflow-node"><span><FlaskConical size={16} /></span><div><small>01 · REGISTER</small><strong>Patient record</strong></div></div><div className="workflow-connector" /><div className="workflow-node"><span><Activity size={16} /></span><div><small>02 · ANALYZE</small><strong>Assay results</strong></div></div><div className="workflow-connector" /><div className="workflow-node"><span><ShieldCheck size={16} /></span><div><small>03 · REVIEW</small><strong>Verified report</strong></div></div></div>
        </div>
        <div className="login-story-footer"><span>Precision in every step.</span><span>Clinical workspace <i>·</i> v1.0</span></div>
        <div className="story-orbit story-orbit-one" /><div className="story-orbit story-orbit-two" />
      </section>
      <section className="login-form-side">
        <div className="login-form-wrap">
          <div className="login-mobile-brand"><BrandMark small /><span>Clearline<strong>Lab</strong></span></div>
          <span className="eyebrow">{apiConfig.mockMode ? 'DEMO WORKSPACE' : 'SECURE WORKSPACE'}</span><h2>Sign in to your lab</h2><p className="login-subtitle">Use your laboratory credentials to continue.</p>
          {apiConfig.mockMode && <div className="login-demo-note"><span className="demo-beacon" /><div><strong>Preview environment</strong><span>Use the sample account to explore the workspace.</span></div><button type="button" onClick={useDemoCredentials}>Fill demo login</button></div>}
          {errorMessage && <InlineNotice tone="error">{errorMessage}</InlineNotice>}
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <Field label="Email or username" required id="login-username" error={errors.username}>
              <TextInput id="login-username" autoComplete="username" placeholder="name@laboratory.org" value={username} onChange={(event) => setUsername(event.target.value)} aria-invalid={Boolean(errors.username)} />
            </Field>
            <Field label="Password" required id="login-password" error={errors.password}>
              <div className="password-input"><TextInput id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={Boolean(errors.password)} /><button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
            </Field>
            <button className="forgot-link" type="button" onClick={() => setErrorMessage('Contact your laboratory administrator to reset access.')}>Forgot password?</button>
            <Button className="login-submit" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in to workspace'}{!loading && <ArrowRight size={16} />}</Button>
          </form>
          <div className="login-security"><ShieldCheck size={15} /><span>Session access is controlled by your laboratory.</span></div>
          <div className="login-footer"><span>© 2026 Clearline Lab</span><span>Privacy <i>·</i> Support</span></div>
        </div>
      </section>
    </main>
  );
}

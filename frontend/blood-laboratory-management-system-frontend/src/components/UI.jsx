import React from '../reactRuntime.js';
import { AlertCircle, ArrowRight, Check, ChevronDown, LoaderCircle, Search, X } from 'lucide-react';

export function PageHeader({ eyebrow, title, description, action, back }) {
  return (
    <div className="page-header">
      <div className="page-heading">
        {back && <button className="text-button back-link" onClick={back.onClick} type="button">← {back.label}</button>}
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
  );
}

export function Button({ children, variant = 'primary', size = 'md', icon: Icon, type = 'button', disabled, onClick, className = '', ...props }) {
  return (
    <button type={type} className={`button button-${variant} button-${size} ${className}`} disabled={disabled} onClick={onClick} {...props}>
      {Icon && <Icon size={16} strokeWidth={1.9} />}{children}
    </button>
  );
}

export function Field({ label, required, hint, error, id, children, className = '' }) {
  return (
    <div className={`field ${error ? 'field-error' : ''} ${className}`}>
      {label && <label htmlFor={id}>{label}{required && <span className="required-mark"> *</span>}</label>}
      {children}
      {error ? <span className="field-message error-message"><AlertCircle size={13} />{error}</span> : hint ? <span className="field-hint">{hint}</span> : null}
    </div>
  );
}

export function TextInput({ id, icon: Icon, className = '', ...props }) {
  return <div className={`input-wrap ${Icon ? 'input-with-icon' : ''} ${className}`}>{Icon && <Icon className="input-icon" size={16} />}<input id={id} className="input" {...props} /></div>;
}

export function SelectInput({ id, children, className = '', ...props }) {
  return <div className={`select-wrap ${className}`}><select id={id} className="input select-input" {...props}>{children}</select><ChevronDown size={15} /></div>;
}

export function SearchBox({ value, onChange, placeholder = 'Search', ariaLabel = 'Search', className = '' }) {
  return <div className={`search-box ${className}`}><Search size={16} /><input aria-label={ariaLabel} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></div>;
}

export function Badge({ children, tone = 'neutral', dot = false }) {
  return <span className={`badge badge-${tone}`}>{dot && <span className="badge-dot" />}{children}</span>;
}

export function Card({ children, className = '', ...props }) {
  return <section className={`card ${className}`} {...props}>{children}</section>;
}

export function DemoBanner({ compact = false }) {
  return <div className={`demo-banner ${compact ? 'demo-banner-compact' : ''}`}><span className="demo-beacon" /><span><strong>Demo environment</strong>{!compact && <span> · Sample records only. Changes are stored in this browser, not in a laboratory system.</span>}</span></div>;
}

export function EmptyState({ icon: Icon = Search, title, description, action }) {
  return <div className="empty-state"><span className="empty-icon"><Icon size={20} /></span><h3>{title}</h3><p>{description}</p>{action}</div>;
}

export function LoadingLine({ label = 'Loading' }) {
  return <div className="loading-line"><LoaderCircle size={16} className="spin" />{label}</div>;
}

export function InlineNotice({ children, tone = 'info', onDismiss }) {
  return <div className={`inline-notice notice-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>{tone === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}<span>{children}</span>{onDismiss && <button className="icon-button" aria-label="Dismiss message" onClick={onDismiss}><X size={15} /></button>}</div>;
}

export function SectionTitle({ title, detail, action }) {
  return <div className="section-title"><div><h2>{title}</h2>{detail && <p>{detail}</p>}</div>{action}</div>;
}

export function ArrowAction({ children, ...props }) {
  return <button className="arrow-action" type="button" {...props}>{children}<ArrowRight size={15} /></button>;
}

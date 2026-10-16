import React from '../reactRuntime.js';
import { useState } from 'react';
import { Activity, ArrowUpRight, Beaker, Bell, ChevronDown, CircleHelp, ClipboardList, Command, FlaskConical, LayoutDashboard, LogOut, Menu, Settings2, SlidersHorizontal, Sparkles, UsersRound, X } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../app/AuthContext.jsx';
import { apiConfig } from '../api/apiRoutes.js';
import { DemoBanner } from './UI.jsx';

const navigation = [
  { label: 'Workspace', items: [
    { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/add-test', label: 'New report', icon: Beaker },
    { to: '/reports', label: 'Patients & reports', icon: UsersRound },
  ] },
  { label: 'Laboratory', items: [
    { to: '/update-values', label: 'Reference values', icon: SlidersHorizontal },
  ] },
];

const titleByPath = [
  [/^\/$/, 'Overview'], [/^\/add-test/, 'New report'], [/^\/reports$/, 'Patients & reports'], [/^\/patients\//, 'Patient history'], [/^\/reports\//, 'Report details'], [/^\/update-values/, 'Reference values'],
];

function BrandMark({ small = false }) {
  return <span className={`brand-mark ${small ? 'brand-mark-small' : ''}`} aria-hidden="true"><svg viewBox="0 0 42 42" fill="none"><path d="M21 4.8c-4.9 7.3-12.2 14-12.2 22A12.2 12.2 0 0 0 21 39a12.2 12.2 0 0 0 12.2-12.2c0-8-7.3-14.7-12.2-22Z" stroke="currentColor" strokeWidth="1.7"/><path d="M15 23h12M15 27h8M15 31h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg></span>;
}

export { BrandMark };

export default function AppShell() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const pageTitle = titleByPath.find(([pattern]) => pattern.test(location.pathname))?.[1] || 'Workspace';
  const initials = (user?.name || 'Lab').split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="app-frame">
      <div className={`mobile-scrim ${menuOpen ? 'visible' : ''}`} onClick={() => setMenuOpen(false)} />
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup"><BrandMark /><div><strong>Clearline<span>Lab</span></strong><small>LABORATORY WORKSPACE</small></div><button className="icon-button sidebar-close" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X size={17} /></button></div>
        <div className="sidebar-lab"><span className="lab-avatar"><FlaskConical size={15} /></span><span><strong>Northfield Lab</strong><small>Clinical diagnostics</small></span><ChevronDown size={14} /></div>
        <div className="sidebar-nav">
          {navigation.map((group) => <div className="nav-group" key={group.label}><span className="nav-label">{group.label}</span>{group.items.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} onClick={() => setMenuOpen(false)}><Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'New report' && <span className="nav-shortcut">N</span>}</NavLink>)}</div>)}
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-help"><span className="help-icon"><CircleHelp size={16} /></span><span><strong>Need a hand?</strong><small>View the quick guide</small></span><ArrowUpRight size={13} /></div>
          <div className="sidebar-user"><span className="user-avatar">{initials}</span><span className="user-copy"><strong>{user?.name || 'Lab user'}</strong><small>{user?.role || 'Laboratory user'}</small></span><button className="icon-button logout-button" aria-label="Log out" title="Log out" onClick={signOut}><LogOut size={16} /></button></div>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={18} /></button>
          <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-separator">/</span><strong>{pageTitle}</strong></div>
          <div className="topbar-right"><div className={`connection-pill ${apiConfig.mockMode ? 'connection-demo' : ''}`}><span className="connection-dot" />{apiConfig.mockMode ? 'Demo mode' : 'Gateway mode'}</div><button className="icon-button topbar-bell" aria-label="Notifications"><Bell size={17} /><i /></button><span className="topbar-divider" /><span className="topbar-date"><Command size={13} /> Workspace</span></div>
        </header>
        {apiConfig.mockMode && <div className="demo-strip"><DemoBanner compact /></div>}
        <div className="page-content"><Outlet /></div>
        <footer className="app-footer"><span>Clearline Lab <span className="footer-dot">·</span> Laboratory workspace</span><span><Activity size={13} /> {apiConfig.mockMode ? 'Demo data is isolated to this browser' : `Gateway: ${apiConfig.baseUrl}`}</span></footer>
      </main>
    </div>
  );
}

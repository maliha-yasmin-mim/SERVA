import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import settingsService from '../services/settingsService';

const ThemeSettingsContext = createContext(null);

export const defaultSettings = {
  general: {
    siteName: 'SERVA',
    tagline: 'Local Help. Trusted Connections.',
    logoUrl: '',
    faviconUrl: '',
    contactEmail: 'support@serva.com.bd',
    contactPhone: '+880 1711 000001',
    whatsappNumber: '+880 1711 000001',
    officeAddress: 'House 42, Road 11, Block D, Banani, Dhaka-1213',
    locationInfo: 'Dhaka, Chattogram, Sylhet, Rajshahi & Khulna',
    copyrightText: '© 2026 SERVA Bangladesh. All rights reserved.',
    socialLinks: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com'
    }
  },
  theme: {
    activePreset: 'Default SERVA',
    primary: '#0F766E',
    secondary: '#134E4A',
    accent: '#C7F36B',
    navbarBg: '#FFFFFF',
    navbarText: '#17211F',
    navbarHover: '#0F766E',
    footerBg: '#134E4A',
    footerText: '#FFFFFF',
    btnPrimaryBg: '#0F766E',
    btnPrimaryText: '#FFFFFF',
    btnSecondaryBg: '#E6F4F2',
    btnSecondaryText: '#0F766E',
    pageBg: '#F7F9F8',
    cardBg: '#FFFFFF',
    headingColor: '#17211F',
    bodyTextColor: '#17211F',
    borderColor: '#E3EAE7',
    linkColor: '#0F766E',
    successColor: '#15803D',
    warningColor: '#D97706',
    errorColor: '#DC2626'
  },
  content: {
    homepage: {
      heroBadge: 'Verified Local Work & Escrow Payments in Bangladesh',
      heroTitle: 'Find Local Work. Build Trusted Connections.',
      heroSubtitle: 'Discover verified micro-jobs, hire trusted service professionals, sell used goods, or give away items across Bangladesh — secured by SERVA ProofBox™ & Online Escrow.',
      heroPrimaryCta: 'Explore Opportunities',
      heroSecondaryCta: 'Post Something',
      categoryTitle: 'Explore Popular Work & Services',
      categorySubtitle: 'Connect instantly with verified local workers and service experts across popular trades.',
      jobsTitle: 'Latest Verified Local Jobs',
      jobsSubtitle: 'Browse urgent tasks and apply directly with your verified SERVA profile.',
      servicesTitle: 'Hire Trusted Service Providers',
      servicesSubtitle: 'Top-rated experts ready to assist. Pay securely online via bKash or Cards.',
      marketplaceTitle: 'Community Second-Hand Marketplace',
      marketplaceSubtitle: 'Find pre-loved electronics, furniture, vehicles, and tools from verified local neighbors.',
      freeStuffTitle: 'Free Stuff Near You',
      freeStuffSubtitle: 'Neighbors helping neighbors. Pass on usable furniture, books, appliances, and clothes at zero cost.',
      finalCtaTitle: 'Your Next Opportunity Starts Here.',
      finalCtaSubtitle: 'Join thousands of verified workers, skilled service providers, and neighbors across Bangladesh. Find work, offer services, or trade goods safely.'
    },
    about: {
      title: 'About SERVA Bangladesh',
      description: 'SERVA brings local micro-work, trades, and circular marketplace exchange into one verified, accountable platform.',
      mission: 'To empower everyday workers, skilled artisans, and community members with transparent work documentation, fair compensation, and escrow-backed trust.',
      vision: 'Building the most dependable and fraud-free local micro-economy in South Asia.'
    },
    footer: {
      heading: 'Service • Exchange • Reliability • Verification • Assistance',
      description: 'Bangladesh’s verified local micro-work, service marketplace, and community exchange platform powered by the SERVA ProofBox™ trust system.',
      escrowNotice: 'Pay safely via bKash, Nagad, or Cards. Funds are only released when you approve work evidence in ProofBox.'
    },
    contact: {
      title: 'Get in Touch with SERVA',
      description: 'Have questions, need verification support, or want to dispute a transaction? Our support team is here for you.'
    }
  }
};

export const ThemeSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Apply CSS variables to root
  const applyCssVariables = useCallback((theme) => {
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary || '#0F766E');
    root.style.setProperty('--color-secondary', theme.secondary || '#134E4A');
    root.style.setProperty('--color-accent', theme.accent || '#C7F36B');
    root.style.setProperty('--color-navbar-bg', theme.navbarBg || '#FFFFFF');
    root.style.setProperty('--color-navbar-text', theme.navbarText || '#17211F');
    root.style.setProperty('--color-navbar-hover', theme.navbarHover || '#0F766E');
    root.style.setProperty('--color-footer-bg', theme.footerBg || '#134E4A');
    root.style.setProperty('--color-footer-text', theme.footerText || '#FFFFFF');
    root.style.setProperty('--color-btn-primary-bg', theme.btnPrimaryBg || '#0F766E');
    root.style.setProperty('--color-btn-primary-text', theme.btnPrimaryText || '#FFFFFF');
    root.style.setProperty('--color-btn-secondary-bg', theme.btnSecondaryBg || '#E6F4F2');
    root.style.setProperty('--color-btn-secondary-text', theme.btnSecondaryText || '#0F766E');
    root.style.setProperty('--color-page-bg', theme.pageBg || '#F7F9F8');
    root.style.setProperty('--color-card-bg', theme.cardBg || '#FFFFFF');
    root.style.setProperty('--color-heading', theme.headingColor || '#17211F');
    root.style.setProperty('--color-body-text', theme.bodyTextColor || '#17211F');
    root.style.setProperty('--color-border', theme.borderColor || '#E3EAE7');
    root.style.setProperty('--color-link', theme.linkColor || '#0F766E');
    root.style.setProperty('--color-success', theme.successColor || '#15803D');
    root.style.setProperty('--color-warning', theme.warningColor || '#D97706');
    root.style.setProperty('--color-error', theme.errorColor || '#DC2626');
  }, []);

  const updateBrowserMetadata = useCallback((general) => {
    if (!general) return;
    if (general.siteName) {
      document.title = `${general.siteName} — ${general.tagline || 'Local Help. Trusted Connections.'}`;
    }
    if (general.faviconUrl) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = general.faviconUrl;
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await settingsService.getPublicSettings();
      if (data?.settings) {
        setSettings({
          general: { ...defaultSettings.general, ...data.settings.general },
          theme: { ...defaultSettings.theme, ...data.settings.theme },
          content: {
            homepage: { ...defaultSettings.content.homepage, ...(data.settings.content?.homepage || {}) },
            about: { ...defaultSettings.content.about, ...(data.settings.content?.about || {}) },
            footer: { ...defaultSettings.content.footer, ...(data.settings.content?.footer || {}) },
            contact: { ...defaultSettings.content.contact, ...(data.settings.content?.contact || {}) }
          }
        });
        applyCssVariables(data.settings.theme);
        updateBrowserMetadata(data.settings.general);
      }
    } catch (err) {
      console.warn('Could not load dynamic website settings, using defaults:', err.message);
      applyCssVariables(defaultSettings.theme);
    } finally {
      setLoading(false);
    }
  }, [applyCssVariables, updateBrowserMetadata]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Live preview without saving
  const applyThemePreview = (previewTheme) => {
    applyCssVariables(previewTheme);
  };

  // Revert preview back to saved settings
  const resetThemePreview = () => {
    applyCssVariables(settings.theme);
  };

  const value = {
    settings,
    general: settings.general,
    theme: settings.theme,
    content: settings.content,
    loading,
    refreshSettings: fetchSettings,
    applyThemePreview,
    resetThemePreview
  };

  return (
    <ThemeSettingsContext.Provider value={value}>
      {children}
    </ThemeSettingsContext.Provider>
  );
};

export const useThemeSettings = () => {
  const context = useContext(ThemeSettingsContext);
  if (!context) {
    throw new Error('useThemeSettings must be used within ThemeSettingsProvider');
  }
  return context;
};

export default ThemeSettingsContext;


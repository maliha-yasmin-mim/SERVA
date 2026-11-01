import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import settingsService from '../../services/settingsService';
import { useThemeSettings, defaultSettings } from '../../context/ThemeSettingsContext';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import {
  Palette,
  Globe,
  Image as ImageIcon,
  FileText,
  Phone,
  Layout,
  Lock,
  CheckCircle2,
  AlertCircle,
  Upload,
  RefreshCw,
  Eye,
  Sliders,
  ShieldCheck,
  Sparkles,
  Save,
  ArrowRight
} from 'lucide-react';

const themePresets = [
  {
    name: 'Default SERVA',
    description: 'Deep Teal, Accent Lime & Crisp Slate',
    colors: {
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
    }
  },
  {
    name: 'Modern Teal',
    description: 'Vibrant Teal, Cyan Glow & Mint Highlights',
    colors: {
      primary: '#0D9488',
      secondary: '#115E59',
      accent: '#2DD4BF',
      navbarBg: '#FFFFFF',
      navbarText: '#0F172A',
      navbarHover: '#0D9488',
      footerBg: '#115E59',
      footerText: '#F0FDFA',
      btnPrimaryBg: '#0D9488',
      btnPrimaryText: '#FFFFFF',
      btnSecondaryBg: '#CCFBF1',
      btnSecondaryText: '#0D9488',
      pageBg: '#F0FDFA',
      cardBg: '#FFFFFF',
      headingColor: '#115E59',
      bodyTextColor: '#334155',
      borderColor: '#CCFBF1',
      linkColor: '#0D9488',
      successColor: '#059669',
      warningColor: '#D97706',
      errorColor: '#E11D48'
    }
  },
  {
    name: 'Professional Blue',
    description: 'Corporate Royal Blue, Navy & Sky Accent',
    colors: {
      primary: '#2563EB',
      secondary: '#1E3A8A',
      accent: '#38BDF8',
      navbarBg: '#FFFFFF',
      navbarText: '#0F172A',
      navbarHover: '#2563EB',
      footerBg: '#1E3A8A',
      footerText: '#FFFFFF',
      btnPrimaryBg: '#2563EB',
      btnPrimaryText: '#FFFFFF',
      btnSecondaryBg: '#EFF6FF',
      btnSecondaryText: '#2563EB',
      pageBg: '#F8FAFC',
      cardBg: '#FFFFFF',
      headingColor: '#1E3A8A',
      bodyTextColor: '#334155',
      borderColor: '#E2E8F0',
      linkColor: '#2563EB',
      successColor: '#16A34A',
      warningColor: '#EA580C',
      errorColor: '#DC2626'
    }
  },
  {
    name: 'Elegant Dark',
    description: 'Deep Midnight Slate with Warm Amber Accents',
    colors: {
      primary: '#0F172A',
      secondary: '#1E293B',
      accent: '#F59E0B',
      navbarBg: '#1E293B',
      navbarText: '#F8FAFC',
      navbarHover: '#F59E0B',
      footerBg: '#0F172A',
      footerText: '#F8FAFC',
      btnPrimaryBg: '#F59E0B',
      btnPrimaryText: '#0F172A',
      btnSecondaryBg: '#334155',
      btnSecondaryText: '#F8FAFC',
      pageBg: '#F1F5F9',
      cardBg: '#FFFFFF',
      headingColor: '#0F172A',
      bodyTextColor: '#334155',
      borderColor: '#CBD5E1',
      linkColor: '#F59E0B',
      successColor: '#10B981',
      warningColor: '#F59E0B',
      errorColor: '#EF4444'
    }
  },
  {
    name: 'Fresh Green',
    description: 'Emerald Nature, Forest Dark & Spring Lime',
    colors: {
      primary: '#059669',
      secondary: '#065F46',
      accent: '#84CC16',
      navbarBg: '#FFFFFF',
      navbarText: '#14532D',
      navbarHover: '#059669',
      footerBg: '#065F46',
      footerText: '#ECFDF5',
      btnPrimaryBg: '#059669',
      btnPrimaryText: '#FFFFFF',
      btnSecondaryBg: '#D1FAE5',
      btnSecondaryText: '#065F46',
      pageBg: '#F0FDF4',
      cardBg: '#FFFFFF',
      headingColor: '#065F46',
      bodyTextColor: '#1F2937',
      borderColor: '#D1FAE5',
      linkColor: '#059669',
      successColor: '#15803D',
      warningColor: '#D97706',
      errorColor: '#DC2626'
    }
  },
  {
    name: 'Minimal Light',
    description: 'Editorial Charcoal, Clean White & Indigo Accent',
    colors: {
      primary: '#262626',
      secondary: '#171717',
      accent: '#6366F1',
      navbarBg: '#FFFFFF',
      navbarText: '#171717',
      navbarHover: '#6366F1',
      footerBg: '#171717',
      footerText: '#FAFAFA',
      btnPrimaryBg: '#171717',
      btnPrimaryText: '#FFFFFF',
      btnSecondaryBg: '#F5F5F5',
      btnSecondaryText: '#171717',
      pageBg: '#FAFAFA',
      cardBg: '#FFFFFF',
      headingColor: '#171717',
      bodyTextColor: '#404040',
      borderColor: '#E5E5E5',
      linkColor: '#6366F1',
      successColor: '#16A34A',
      warningColor: '#D97706',
      errorColor: '#DC2626'
    }
  }
];

const WebsiteCustomizationPage = () => {
  const { refreshSettings, applyThemePreview, resetThemePreview } = useThemeSettings();

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'branding' | 'theme' | 'homepage' | 'about' | 'footer' | 'preview'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Local settings state being edited
  const [formData, setFormData] = useState(defaultSettings);

  // Logo & Favicon upload state
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  // Password confirmation modal state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Load existing settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await settingsService.getAdminSettings();
        if (res?.settings) {
          setFormData({
            general: { ...defaultSettings.general, ...res.settings.general },
            theme: { ...defaultSettings.theme, ...res.settings.theme },
            content: {
              homepage: { ...defaultSettings.content.homepage, ...(res.settings.content?.homepage || {}) },
              about: { ...defaultSettings.content.about, ...(res.settings.content?.about || {}) },
              footer: { ...defaultSettings.content.footer, ...(res.settings.content?.footer || {}) },
              contact: { ...defaultSettings.content.contact, ...(res.settings.content?.contact || {}) }
            }
          });
        }
      } catch (err) {
        console.error('Error fetching admin settings:', err);
        setErrorMessage('Failed to load website settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Update theme color field and trigger live preview
  const handleColorChange = (key, value) => {
    const updatedTheme = {
      ...formData.theme,
      [key]: value
    };
    setFormData((prev) => ({
      ...prev,
      theme: updatedTheme
    }));
    applyThemePreview(updatedTheme);
  };

  // Apply a preset
  const handleSelectPreset = (preset) => {
    const updatedTheme = {
      ...preset.colors,
      activePreset: preset.name
    };
    setFormData((prev) => ({
      ...prev,
      theme: updatedTheme
    }));
    applyThemePreview(updatedTheme);
  };

  // Handle Logo Upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    setUploadingLogo(true);
    try {
      const data = new FormData();
      data.append('asset', file);
      const res = await settingsService.uploadAsset(data);
      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          general: { ...prev.general, logoUrl: res.fileUrl }
        }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Logo upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Handle Favicon Upload
  const handleFaviconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFavicon(true);
    try {
      const data = new FormData();
      data.append('asset', file);
      const res = await settingsService.uploadAsset(data);
      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          general: { ...prev.general, faviconUrl: res.fileUrl }
        }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Favicon upload failed');
    } finally {
      setUploadingFavicon(false);
    }
  };

  // Submit with Password Confirmation
  const handleConfirmSave = async (e) => {
    e.preventDefault();
    if (!adminPassword) {
      setPasswordError('Please enter your administrator account password.');
      return;
    }

    setPasswordError('');
    setSaving(true);
    try {
      const res = await settingsService.verifyAndSave(adminPassword, formData);
      if (res.success) {
        setPasswordModalOpen(false);
        setAdminPassword('');
        setSuccessMessage('Website customization settings saved and published successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
        refreshSettings();
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Password verification failed. Changes not saved.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General Info', icon: Globe },
    { id: 'branding', label: 'Logo & Branding', icon: ImageIcon },
    { id: 'theme', label: 'Theme & Colors', icon: Palette },
    { id: 'homepage', label: 'Homepage Content', icon: Layout },
    { id: 'about', label: 'About & Contact', icon: Phone },
    { id: 'footer', label: 'Footer Settings', icon: FileText },
    { id: 'preview', label: 'Live Preview & Save', icon: Eye }
  ];

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Admin Suite
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Active Theme: {formData.theme.activePreset}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display mt-1">
            Website Customization & CMS
          </h1>
          <p className="text-xs sm:text-sm text-[#64716D] mt-1">
            Dynamically customize SERVA branding, logos, 21 color themes, and public content without editing code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => resetThemePreview()}
            title="Reset preview to active saved theme"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Reset Preview
          </Button>
          <Button
            variant="lime"
            size="md"
            onClick={() => setPasswordModalOpen(true)}
            className="font-bold shadow-md hover:shadow-glow-lime"
          >
            <Save className="w-4 h-4 mr-1" />
            Save Changes...
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-[#E3EAE7] shadow-soft overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'text-[#64716D] hover:bg-gray-100 hover:text-[#17211F]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: General Info */}
      {activeTab === 'general' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-6">
          <div className="border-b border-[#E3EAE7] pb-4">
            <h3 className="text-base font-extrabold text-[#17211F] font-display">
              General Website Information
            </h3>
            <p className="text-xs text-[#64716D] mt-1">
              Configure fundamental platform identity, phone numbers, and operational addresses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1.5">
                Platform Name
              </label>
              <input
                type="text"
                value={formData.general.siteName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, siteName: e.target.value }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1.5">
                Official Tagline
              </label>
              <input
                type="text"
                value={formData.general.tagline}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, tagline: e.target.value }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.general.contactEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, contactEmail: e.target.value }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1.5">
                Contact Phone
              </label>
              <input
                type="text"
                value={formData.general.contactPhone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, contactPhone: e.target.value }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1.5">
                WhatsApp Support Number
              </label>
              <input
                type="text"
                value={formData.general.whatsappNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, whatsappNumber: e.target.value }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1.5">
                Location Coverage Info
              </label>
              <input
                type="text"
                value={formData.general.locationInfo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, locationInfo: e.target.value }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1.5">
                Physical Office Address
              </label>
              <input
                type="text"
                value={formData.general.officeAddress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, officeAddress: e.target.value }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>
          </div>

          {/* Social Profiles */}
          <div className="pt-4 border-t border-[#E3EAE7] space-y-4">
            <h4 className="text-xs font-bold text-[#17211F] uppercase tracking-wider">
              Social Media Links
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['facebook', 'twitter', 'linkedin', 'instagram'].map((network) => (
                <div key={network}>
                  <label className="text-xs font-semibold text-[#64716D] capitalize block mb-1">
                    {network} Profile
                  </label>
                  <input
                    type="url"
                    value={formData.general.socialLinks?.[network] || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: {
                          ...formData.general,
                          socialLinks: {
                            ...formData.general.socialLinks,
                            [network]: e.target.value
                          }
                        }
                      })
                    }
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Logo & Branding */}
      {activeTab === 'branding' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-8">
          <div className="border-b border-[#E3EAE7] pb-4">
            <h3 className="text-base font-extrabold text-[#17211F] font-display">
              Logo & Favicon Management
            </h3>
            <p className="text-xs text-[#64716D] mt-1">
              Upload custom brand assets. Validated on the server and applied across the entire site.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Website Logo Box */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-[#E3EAE7] bg-[#F7F9F8] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] block mb-1">
                  Primary Website Logo
                </span>
                <p className="text-xs text-[#64716D]">
                  Appears on Navbar, Footer, and Auth pages. Recommended size: 240x60px (PNG, SVG, or WEBP).
                </p>

                {/* Preview Area */}
                <div className="mt-4 p-4 rounded-xl bg-white border border-[#E3EAE7] flex items-center justify-center min-h-[100px]">
                  {formData.general.logoUrl ? (
                    <img
                      src={formData.general.logoUrl}
                      alt="Website Logo Preview"
                      className="max-h-16 max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-xs text-gray-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 text-gray-300" />
                      <span>Default SERVA Brand Mark Active</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="w-full cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#134E4A] text-white text-xs font-bold transition-all shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingLogo ? 'Uploading...' : 'Upload New Logo'}</span>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.svg"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                </label>

                {formData.general.logoUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, logoUrl: '' }
                      })
                    }
                    className="w-full text-xs text-rose-600 hover:underline text-center font-semibold"
                  >
                    Reset to Default Logo
                  </button>
                )}
              </div>
            </div>

            {/* Favicon Box */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-[#E3EAE7] bg-[#F7F9F8] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] block mb-1">
                  Browser Tab Favicon
                </span>
                <p className="text-xs text-[#64716D]">
                  Displayed in browser tabs and bookmarks bar. Recommended size: 32x32px or 64x64px (ICO or PNG).
                </p>

                {/* Preview Area */}
                <div className="mt-4 p-4 rounded-xl bg-white border border-[#E3EAE7] flex items-center justify-center min-h-[100px]">
                  {formData.general.faviconUrl ? (
                    <img
                      src={formData.general.faviconUrl}
                      alt="Favicon Preview"
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <div className="text-center text-xs text-gray-400">
                      <Globe className="w-8 h-8 mx-auto mb-1 text-gray-300" />
                      <span>Default Teal Shield Active</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="w-full cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#134E4A] text-white text-xs font-bold transition-all shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingFavicon ? 'Uploading...' : 'Upload New Favicon'}</span>
                  <input
                    type="file"
                    accept=".ico,.png,.webp,.svg"
                    onChange={handleFaviconUpload}
                    disabled={uploadingFavicon}
                    className="hidden"
                  />
                </label>

                {formData.general.faviconUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, faviconUrl: '' }
                      })
                    }
                    className="w-full text-xs text-rose-600 hover:underline text-center font-semibold"
                  >
                    Reset to Default Favicon
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Theme & Colors */}
      {activeTab === 'theme' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-8">
          <div className="border-b border-[#E3EAE7] pb-4">
            <h3 className="text-base font-extrabold text-[#17211F] font-display">
              Theme & Dynamic Color Customization
            </h3>
            <p className="text-xs text-[#64716D] mt-1">
              Select from professionally designed presets or customize each individual color element with live CSS variable preview.
            </p>
          </div>

          {/* Theme Presets */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
              1. Choose a Curated Theme Preset:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {themePresets.map((preset) => {
                const isSelected = formData.theme.activePreset === preset.name;
                return (
                  <div
                    key={preset.name}
                    onClick={() => handleSelectPreset(preset)}
                    className={`cursor-pointer p-3 rounded-2xl border transition-all text-center flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#0F766E] bg-teal-50/50 ring-2 ring-[#0F766E]/20 shadow-xs'
                        : 'border-[#E3EAE7] bg-[#F7F9F8] hover:border-gray-300'
                    }`}
                  >
                    <div>
                      {/* Swatch palette */}
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <span
                          className="w-4 h-4 rounded-full border border-black/10"
                          style={{ backgroundColor: preset.colors.primary }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/10"
                          style={{ backgroundColor: preset.colors.secondary }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/10"
                          style={{ backgroundColor: preset.colors.accent }}
                        />
                      </div>
                      <h4 className="font-bold text-xs text-[#17211F]">{preset.name}</h4>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-[#0F766E] block mt-1">Active</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 21 Custom Color Inputs Grid */}
          <div className="space-y-4 pt-4 border-t border-[#E3EAE7]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
                2. Fine-Tune Specific Colors:
              </label>
              <span className="text-xs text-[#0F766E] font-medium">
                Live changes apply to preview immediately
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'primary', label: 'Primary Brand Color' },
                { key: 'secondary', label: 'Secondary Brand Color' },
                { key: 'accent', label: 'Accent Highlight Color' },
                { key: 'navbarBg', label: 'Navbar Background' },
                { key: 'navbarText', label: 'Navbar Text Color' },
                { key: 'navbarHover', label: 'Navbar Link Hover' },
                { key: 'footerBg', label: 'Footer Background' },
                { key: 'footerText', label: 'Footer Text Color' },
                { key: 'btnPrimaryBg', label: 'Primary Button Background' },
                { key: 'btnPrimaryText', label: 'Primary Button Text' },
                { key: 'btnSecondaryBg', label: 'Secondary Button Background' },
                { key: 'btnSecondaryText', label: 'Secondary Button Text' },
                { key: 'pageBg', label: 'Page Background' },
                { key: 'cardBg', label: 'Card Surface Background' },
                { key: 'headingColor', label: 'Main Headings Color' },
                { key: 'bodyTextColor', label: 'Body Text Color' },
                { key: 'borderColor', label: 'Borders & Dividers' },
                { key: 'linkColor', label: 'Links Color' },
                { key: 'successColor', label: 'Success Badges & Status' },
                { key: 'warningColor', label: 'Warning Status' },
                { key: 'errorColor', label: 'Error / Urgent Badges' }
              ].map(({ key, label }) => {
                const colorValue = formData.theme[key] || '#000000';
                return (
                  <div
                    key={key}
                    className="p-3 rounded-2xl border border-[#E3EAE7] bg-[#F7F9F8] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-[#17211F] block truncate">
                        {label}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 uppercase">
                        {colorValue}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <input
                        type="color"
                        value={colorValue}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={colorValue}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="w-18 text-[11px] font-mono p-1 rounded-lg border border-[#E3EAE7] bg-white uppercase text-center"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Homepage Content */}
      {activeTab === 'homepage' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-6">
          <div className="border-b border-[#E3EAE7] pb-4">
            <h3 className="text-base font-extrabold text-[#17211F] font-display">
              Homepage Content Management
            </h3>
            <p className="text-xs text-[#64716D] mt-1">
              Edit the text, banners, and call-to-actions displayed on the main landing page.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
              Hero Section
            </h4>

            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                Hero Pill Badge Text
              </label>
              <input
                type="text"
                value={formData.content.homepage.heroBadge}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: {
                      ...formData.content,
                      homepage: { ...formData.content.homepage, heroBadge: e.target.value }
                    }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                Main Hero Headline
              </label>
              <input
                type="text"
                value={formData.content.homepage.heroTitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: {
                      ...formData.content,
                      homepage: { ...formData.content.homepage, heroTitle: e.target.value }
                    }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                Hero Description
              </label>
              <textarea
                rows={3}
                value={formData.content.homepage.heroSubtitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: {
                      ...formData.content,
                      homepage: { ...formData.content.homepage, heroSubtitle: e.target.value }
                    }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                  Primary CTA Button Text
                </label>
                <input
                  type="text"
                  value={formData.content.homepage.heroPrimaryCta}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: {
                        ...formData.content,
                        homepage: { ...formData.content.homepage, heroPrimaryCta: e.target.value }
                      }
                    })
                  }
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                  Secondary CTA Button Text
                </label>
                <input
                  type="text"
                  value={formData.content.homepage.heroSecondaryCta}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: {
                        ...formData.content,
                        homepage: { ...formData.content.homepage, heroSecondaryCta: e.target.value }
                      }
                    })
                  }
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
                />
              </div>
            </div>
          </div>

          {/* Section Headings */}
          <div className="pt-6 border-t border-[#E3EAE7] space-y-4">
            <h4 className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
              Homepage Section Headings
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#17211F] block mb-1">
                  Featured Jobs Title
                </label>
                <input
                  type="text"
                  value={formData.content.homepage.jobsTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: {
                        ...formData.content,
                        homepage: { ...formData.content.homepage, jobsTitle: e.target.value }
                      }
                    })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E3EAE7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#17211F] block mb-1">
                  Featured Services Title
                </label>
                <input
                  type="text"
                  value={formData.content.homepage.servicesTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: {
                        ...formData.content,
                        homepage: { ...formData.content.homepage, servicesTitle: e.target.value }
                      }
                    })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E3EAE7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#17211F] block mb-1">
                  Marketplace Title
                </label>
                <input
                  type="text"
                  value={formData.content.homepage.marketplaceTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: {
                        ...formData.content,
                        homepage: { ...formData.content.homepage, marketplaceTitle: e.target.value }
                      }
                    })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E3EAE7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#17211F] block mb-1">
                  Free Stuff Title
                </label>
                <input
                  type="text"
                  value={formData.content.homepage.freeStuffTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: {
                        ...formData.content,
                        homepage: { ...formData.content.homepage, freeStuffTitle: e.target.value }
                      }
                    })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E3EAE7]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: About & Contact Content */}
      {activeTab === 'about' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-6">
          <div className="border-b border-[#E3EAE7] pb-4">
            <h3 className="text-base font-extrabold text-[#17211F] font-display">
              About & Contact Page Text
            </h3>
            <p className="text-xs text-[#64716D] mt-1">
              Configure mission statements, corporate information, and customer care intros.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                About Title
              </label>
              <input
                type="text"
                value={formData.content.about.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: {
                      ...formData.content,
                      about: { ...formData.content.about, title: e.target.value }
                    }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                About Description
              </label>
              <textarea
                rows={3}
                value={formData.content.about.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: {
                      ...formData.content,
                      about: { ...formData.content.about, description: e.target.value }
                    }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                  Mission Statement
                </label>
                <textarea
                  rows={3}
                  value={formData.content.about.mission}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: {
                        ...formData.content,
                        about: { ...formData.content.about, mission: e.target.value }
                      }
                    })
                  }
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                  Vision Statement
                </label>
                <textarea
                  rows={3}
                  value={formData.content.about.vision}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: {
                        ...formData.content,
                        about: { ...formData.content.about, vision: e.target.value }
                      }
                    })
                  }
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E3EAE7]">
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                Contact Page Title
              </label>
              <input
                type="text"
                value={formData.content.contact.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: {
                      ...formData.content,
                      contact: { ...formData.content.contact, title: e.target.value }
                    }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7]"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Footer Settings */}
      {activeTab === 'footer' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-6">
          <div className="border-b border-[#E3EAE7] pb-4">
            <h3 className="text-base font-extrabold text-[#17211F] font-display">
              Footer Content & Legal Text
            </h3>
            <p className="text-xs text-[#64716D] mt-1">
              Customize the global footer description, escrow guarantee notice, and copyright line.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                Footer Tagline / Heading
              </label>
              <input
                type="text"
                value={formData.content.footer.heading}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: {
                      ...formData.content,
                      footer: { ...formData.content.footer, heading: e.target.value }
                    }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                Footer Description Text
              </label>
              <textarea
                rows={3}
                value={formData.content.footer.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: {
                      ...formData.content,
                      footer: { ...formData.content.footer, description: e.target.value }
                    }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                Escrow & Protection Notice
              </label>
              <input
                type="text"
                value={formData.content.footer.escrowNotice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: {
                      ...formData.content,
                      footer: { ...formData.content.footer, escrowNotice: e.target.value }
                    }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                Copyright Text
              </label>
              <input
                type="text"
                value={formData.general.copyrightText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, copyrightText: e.target.value }
                  })
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7]"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: Live Preview & Save */}
      {activeTab === 'preview' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-6">
          <div className="border-b border-[#E3EAE7] pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#17211F] font-display">
                Live Interactive Component Preview
              </h3>
              <p className="text-xs text-[#64716D] mt-1">
                This shows how your chosen colors, branding, and buttons will appear to public visitors.
              </p>
            </div>
            <Button
              variant="lime"
              size="md"
              onClick={() => setPasswordModalOpen(true)}
              className="font-bold"
            >
              <Save className="w-4 h-4 mr-1" />
              Save to Live Website
            </Button>
          </div>

          {/* Interactive Mockup Container */}
          <div
            className="p-6 rounded-2xl border transition-all space-y-6"
            style={{
              backgroundColor: formData.theme.pageBg,
              borderColor: formData.theme.borderColor
            }}
          >
            {/* Mockup 1: Navbar */}
            <div
              className="p-4 rounded-xl border flex items-center justify-between shadow-xs"
              style={{
                backgroundColor: formData.theme.navbarBg,
                borderColor: formData.theme.borderColor
              }}
            >
              <div className="flex items-center gap-2">
                {formData.general.logoUrl ? (
                  <img src={formData.general.logoUrl} alt="Logo" className="h-7 object-contain" />
                ) : (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                    style={{ backgroundColor: formData.theme.primary }}
                  >
                    S
                  </div>
                )}
                <span
                  className="font-extrabold text-sm font-display"
                  style={{ color: formData.theme.navbarText }}
                >
                  {formData.general.siteName}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <span style={{ color: formData.theme.navbarHover }}>Find Work</span>
                <span style={{ color: formData.theme.navbarText }}>Services</span>
                <span style={{ color: formData.theme.navbarText }}>Marketplace</span>
              </div>

              <button
                className="px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{
                  backgroundColor: formData.theme.btnPrimaryBg,
                  color: formData.theme.btnPrimaryText
                }}
              >
                Post Something
              </button>
            </div>

            {/* Mockup 2: Sample Card */}
            <div
              className="p-5 rounded-2xl border shadow-card max-w-sm"
              style={{
                backgroundColor: formData.theme.cardBg,
                borderColor: formData.theme.borderColor
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                  style={{
                    backgroundColor: formData.theme.accent,
                    color: formData.theme.secondary
                  }}
                >
                  Verified Job
                </span>
                <span
                  className="text-xs font-extrabold font-mono"
                  style={{ color: formData.theme.primary }}
                >
                  ৳3,500 BDT
                </span>
              </div>

              <h4
                className="font-bold text-sm mb-1.5 font-display"
                style={{ color: formData.theme.headingColor }}
              >
                Sample Opportunity Card
              </h4>
              <p
                className="text-xs mb-4 leading-relaxed"
                style={{ color: formData.theme.bodyTextColor }}
              >
                Live preview of your font colors, cards, and accent badges on the chosen background.
              </p>

              <div className="flex items-center gap-2">
                <button
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-center"
                  style={{
                    backgroundColor: formData.theme.btnPrimaryBg,
                    color: formData.theme.btnPrimaryText
                  }}
                >
                  Primary Action
                </button>
                <button
                  className="py-2 px-3 rounded-xl text-xs font-bold border"
                  style={{
                    backgroundColor: formData.theme.btnSecondaryBg,
                    color: formData.theme.btnSecondaryText,
                    borderColor: formData.theme.borderColor
                  }}
                >
                  Secondary
                </button>
              </div>
            </div>

            {/* Mockup 3: Footer */}
            <div
              className="p-5 rounded-xl border flex items-center justify-between text-xs"
              style={{
                backgroundColor: formData.theme.footerBg,
                borderColor: formData.theme.borderColor,
                color: formData.theme.footerText
              }}
            >
              <div>
                <p className="font-bold">{formData.general.siteName}</p>
                <p className="text-[11px] opacity-80">{formData.general.copyrightText}</p>
              </div>
              <span
                className="text-[10px] px-2 py-1 rounded font-bold"
                style={{
                  backgroundColor: formData.theme.accent,
                  color: formData.theme.secondary
                }}
              >
                Escrow Protected
              </span>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD CONFIRMATION MODAL (FEATURE 4 SECURITY) */}
      <Modal
        isOpen={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false);
          setAdminPassword('');
          setPasswordError('');
        }}
        title="Confirm Administrator Password"
        subtitle="Security check: Enter your password to publish website customization changes"
      >
        <form onSubmit={handleConfirmSave} className="space-y-4 pt-1">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Authorized Admin Verification:</strong>
              <p className="mt-0.5">
                Modifying global branding, colors, and site content requires password re-verification via secure bcrypt check.
              </p>
            </div>
          </div>

          {passwordError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
              Your Account Password *
            </label>
            <input
              type="password"
              autoFocus
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E3EAE7]">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => {
                setPasswordModalOpen(false);
                setAdminPassword('');
                setPasswordError('');
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="lime"
              size="md"
              isLoading={saving}
              className="font-bold shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 mr-1" />
              Confirm & Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WebsiteCustomizationPage;


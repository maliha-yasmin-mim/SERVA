import mongoose from 'mongoose';

const websiteSettingsSchema = new mongoose.Schema(
  {
    // General Information
    general: {
      siteName: { type: String, default: 'SERVA' },
      tagline: { type: String, default: 'Local Help. Trusted Connections.' },
      logoUrl: { type: String, default: '' },
      faviconUrl: { type: String, default: '' },
      contactEmail: { type: String, default: 'support@serva.com.bd' },
      contactPhone: { type: String, default: '+880 1711 000001' },
      whatsappNumber: { type: String, default: '+880 1711 000001' },
      officeAddress: { type: String, default: 'House 42, Road 11, Block D, Banani, Dhaka-1213' },
      locationInfo: { type: String, default: 'Dhaka, Chattogram, Sylhet, Rajshahi & Khulna' },
      copyrightText: { type: String, default: '© 2026 SERVA Bangladesh. All rights reserved.' },
      socialLinks: {
        facebook: { type: String, default: 'https://facebook.com' },
        twitter: { type: String, default: 'https://twitter.com' },
        linkedin: { type: String, default: 'https://linkedin.com' },
        instagram: { type: String, default: 'https://instagram.com' }
      }
    },

    // Theme & Color Customization (21 customizable colors)
    theme: {
      activePreset: { type: String, default: 'Default SERVA' },
      primary: { type: String, default: '#0F766E' },
      secondary: { type: String, default: '#134E4A' },
      accent: { type: String, default: '#C7F36B' },
      navbarBg: { type: String, default: '#FFFFFF' },
      navbarText: { type: String, default: '#17211F' },
      navbarHover: { type: String, default: '#0F766E' },
      footerBg: { type: String, default: '#134E4A' },
      footerText: { type: String, default: '#FFFFFF' },
      btnPrimaryBg: { type: String, default: '#0F766E' },
      btnPrimaryText: { type: String, default: '#FFFFFF' },
      btnSecondaryBg: { type: String, default: '#E6F4F2' },
      btnSecondaryText: { type: String, default: '#0F766E' },
      pageBg: { type: String, default: '#F7F9F8' },
      cardBg: { type: String, default: '#FFFFFF' },
      headingColor: { type: String, default: '#17211F' },
      bodyTextColor: { type: String, default: '#17211F' },
      borderColor: { type: String, default: '#E3EAE7' },
      linkColor: { type: String, default: '#0F766E' },
      successColor: { type: String, default: '#15803D' },
      warningColor: { type: String, default: '#D97706' },
      errorColor: { type: String, default: '#DC2626' }
    },

    // Content Management
    content: {
      homepage: {
        heroBadge: { type: String, default: 'Verified Local Work & Escrow Payments in Bangladesh' },
        heroTitle: { type: String, default: 'Find Local Work. Build Trusted Connections.' },
        heroSubtitle: { type: String, default: 'Discover verified micro-jobs, hire trusted service professionals, sell used goods, or give away items across Bangladesh — secured by SERVA ProofBox™ & Online Escrow.' },
        heroPrimaryCta: { type: String, default: 'Explore Opportunities' },
        heroSecondaryCta: { type: String, default: 'Post Something' },
        categoryTitle: { type: String, default: 'Explore Popular Work & Services' },
        categorySubtitle: { type: String, default: 'Connect instantly with verified local workers and service experts across popular trades.' },
        jobsTitle: { type: String, default: 'Latest Verified Local Jobs' },
        jobsSubtitle: { type: String, default: 'Browse urgent tasks and apply directly with your verified SERVA profile.' },
        servicesTitle: { type: String, default: 'Hire Trusted Service Providers' },
        servicesSubtitle: { type: String, default: 'Top-rated experts ready to assist. Pay securely online via bKash or Cards.' },
        marketplaceTitle: { type: String, default: 'Community Second-Hand Marketplace' },
        marketplaceSubtitle: { type: String, default: 'Find pre-loved electronics, furniture, vehicles, and tools from verified local neighbors.' },
        freeStuffTitle: { type: String, default: 'Free Stuff Near You' },
        freeStuffSubtitle: { type: String, default: 'Neighbors helping neighbors. Pass on usable furniture, books, appliances, and clothes at zero cost.' },
        finalCtaTitle: { type: String, default: 'Your Next Opportunity Starts Here.' },
        finalCtaSubtitle: { type: String, default: 'Join thousands of verified workers, skilled service providers, and neighbors across Bangladesh. Find work, offer services, or trade goods safely.' }
      },
      about: {
        title: { type: String, default: 'About SERVA Bangladesh' },
        description: { type: String, default: 'SERVA brings local micro-work, trades, and circular marketplace exchange into one verified, accountable platform.' },
        mission: { type: String, default: 'To empower everyday workers, skilled artisans, and community members with transparent work documentation, fair compensation, and escrow-backed trust.' },
        vision: { type: String, default: 'Building the most dependable and fraud-free local micro-economy in South Asia.' }
      },
      footer: {
        heading: { type: String, default: 'Service • Exchange • Reliability • Verification • Assistance' },
        description: { type: String, default: 'Bangladesh’s verified local micro-work, service marketplace, and community exchange platform powered by the SERVA ProofBox™ trust system.' },
        escrowNotice: { type: String, default: 'Pay safely via bKash, Nagad, or Cards. Funds are only released when you approve work evidence in ProofBox.' }
      },
      contact: {
        title: { type: String, default: 'Get in Touch with SERVA' },
        description: { type: String, default: 'Have questions, need verification support, or want to dispute a transaction? Our support team is here for you.' }
      }
    },

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Method to get or initialize default settings
websiteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model('WebsiteSettings', websiteSettingsSchema);


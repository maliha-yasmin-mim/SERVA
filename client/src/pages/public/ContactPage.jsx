import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useThemeSettings } from '../../context/ThemeSettingsContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageCircle } from 'lucide-react';

const ContactPage = () => {
  const { settings } = useThemeSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const pageTitle = settings?.content?.contact?.pageTitle || 'Contact SERVA Support';
  const pageDescription =
    settings?.content?.contact?.contactDescription ||
    'Have questions about verification, safety, or need assistance with an ongoing job? Our Bangladesh support team is ready to help.';
  const contactEmail = settings?.general?.contactEmail || 'support@serva.com.bd';
  const contactPhone = settings?.general?.contactPhone || '+880 9612 000 777 (Sat - Thu, 9AM - 8PM)';
  const whatsappNumber = settings?.general?.whatsappNumber || '+880 1700 000 000';
  const officeAddress = settings?.general?.address || 'Level 8, Concord Tower, Gulshan-2, Dhaka 1212, Bangladesh';

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F7F9F8] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
            Help & Safety
          </span>
          <h1 className="text-3xl font-extrabold text-[#17211F] font-display mt-1">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#64716D] mt-2">
            {pageDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Info Side */}
          <div className="md:col-span-5 bg-[#134E4A] text-white p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold font-display">Get in Touch</h3>
            <p className="text-xs text-teal-100 leading-relaxed">
              We respond to all member inquiries, safety reports, and verification queries promptly.
            </p>

            <div className="space-y-4 pt-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C7F36B] shrink-0 mt-0.5" />
                <span>{officeAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C7F36B] shrink-0" />
                <span>{contactEmail}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C7F36B] shrink-0" />
                <span>{contactPhone}</span>
              </div>
              {whatsappNumber && (
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-[#C7F36B] shrink-0" />
                  <span>WhatsApp: {whatsappNumber}</span>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-white/10 text-xs text-teal-100 border border-white/10">
              <strong className="text-white block mb-1">Emergency Safety Notice:</strong>
              For urgent safety concerns during in-person work, always contact Bangladesh emergency services at 999.
            </div>
          </div>

          {/* Form Side */}
          <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-[#E3EAE7] shadow-soft">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#0F766E] mx-auto" />
                <h3 className="text-lg font-bold text-[#17211F]">Message Sent Successfully</h3>
                <p className="text-xs text-[#64716D] max-w-sm mx-auto">
                  Thank you for reaching out. A SERVA support agent will contact you at {email} within 24 hours.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Your Name *"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahim Chowdhury"
                />

                <Input
                  label="Your Email Address *"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />

                <Input
                  label="Subject *"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question regarding ProofBox submission"
                />

                <div>
                  <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details on how we can assist you..."
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <Button type="submit" variant="primary" size="md" className="w-full">
                  <Send className="w-4 h-4 mr-1" />
                  Submit Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

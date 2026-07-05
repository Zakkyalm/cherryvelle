'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

type PolicyType = 'privacy' | 'terms';

interface PolicyModalProps {
  type: PolicyType;
  onClose: () => void;
}

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'July 5, 2026',
    sections: [
      {
        heading: '1. Introduction',
        body: `Welcome to Cherryvelle Cosmetics ("we", "our", "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us.`,
      },
      {
        heading: '2. Information We Collect',
        body: `We may collect the following categories of personal information:

• Identity Data: first name, last name, username or similar identifier.
• Contact Data: billing address, delivery address, email address, and telephone numbers.
• Financial Data: payment card details (processed securely via our payment provider — we do not store card numbers).
• Transaction Data: details about purchases and orders you have placed with us.
• Technical Data: IP address, browser type and version, time zone setting, browser plug-in types, operating system, and other technology on the devices you use to access our site.
• Usage Data: information about how you use our website and products.
• Marketing & Communications Data: your preferences in receiving marketing from us.`,
      },
      {
        heading: '3. How We Use Your Information',
        body: `We use the information we collect to:

• Process and fulfil your orders, including managing payments and delivery.
• Manage your account and provide customer support.
• Send you order confirmations, updates, and other transactional emails.
• Send marketing communications where you have opted in to receive them.
• Improve our website, products, and services through analytics.
• Comply with legal obligations and enforce our terms.`,
      },
      {
        heading: '4. Sharing Your Information',
        body: `We do not sell, rent, or trade your personal information to third parties. We may share your information with:

• Service providers who assist us in operating our website and conducting our business (e.g., payment processors, shipping carriers, email platforms).
• Professional advisers such as lawyers, auditors, and accountants.
• Regulatory authorities when required by law.

All third parties are required to respect the security of your information and to treat it in accordance with applicable data protection law.`,
      },
      {
        heading: '5. Cookies',
        body: `Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyse site traffic, and personalise content. You can control cookie settings through your browser. Disabling certain cookies may affect the functionality of our site.`,
      },
      {
        heading: '6. Data Security',
        body: `We have implemented appropriate technical and organisational security measures to protect your personal information from accidental loss, unauthorised access, alteration, or disclosure. Access to your data is limited to employees and third parties who have a legitimate business need.`,
      },
      {
        heading: '7. Data Retention',
        body: `We retain your personal information only for as long as necessary to fulfil the purposes for which it was collected, including satisfying any legal, accounting, or reporting requirements. Typically, order data is retained for seven years for financial compliance purposes.`,
      },
      {
        heading: '8. Your Rights',
        body: `Depending on your location, you may have the right to:

• Request access to your personal data.
• Request correction of inaccurate or incomplete data.
• Request erasure of your data in certain circumstances.
• Object to or restrict processing of your data.
• Request portability of your data.
• Withdraw consent at any time where processing is based on consent.

To exercise any of these rights, please contact us at privacy@cherryvelle.com.`,
      },
      {
        heading: '9. Children\'s Privacy',
        body: `Our website is not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.`,
      },
      {
        heading: '10. Changes to This Policy',
        body: `We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically to stay informed.`,
      },
      {
        heading: '11. Contact Us',
        body: `If you have any questions about this Privacy Policy or our data practices, please contact us at:

Cherryvelle Cosmetics
Email: privacy@cherryvelle.com
Website: cherryvelle.com`,
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'July 5, 2026',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: `By accessing or using the Cherryvelle Cosmetics website and purchasing our products, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our website. We reserve the right to update these Terms at any time, and your continued use constitutes acceptance of the revised Terms.`,
      },
      {
        heading: '2. Use of the Website',
        body: `You agree to use our website only for lawful purposes and in a manner that does not infringe the rights of others or restrict or inhibit anyone else's use of the site. You must not:

• Use the site in any way that could damage, disable, or impair it.
• Attempt to gain unauthorised access to any part of our systems.
• Transmit any unsolicited or unauthorised advertising or promotional material.
• Use automated tools to scrape, crawl, or harvest data from the site without written permission.`,
      },
      {
        heading: '3. Products and Pricing',
        body: `All product descriptions and prices on our website are accurate to the best of our knowledge. We reserve the right to correct errors or update information at any time without notice. Prices are displayed in GBP (£) and include applicable taxes unless stated otherwise. We reserve the right to refuse or cancel an order if a pricing error is discovered.`,
      },
      {
        heading: '4. Orders and Payment',
        body: `When you place an order, you are making an offer to purchase the product at the stated price. An order is only accepted when we send you an order confirmation email. We accept payment via major credit/debit cards and other methods shown at checkout. All transactions are processed securely through our payment provider.`,
      },
      {
        heading: '5. Shipping and Delivery',
        body: `We aim to process and dispatch orders within 1–3 business days. Delivery times vary depending on the shipping method selected and your location. We are not responsible for delays caused by couriers, customs, or events outside our control. Risk of loss and title for products pass to you upon delivery.`,
      },
      {
        heading: '6. Returns and Refunds',
        body: `We want you to love your purchase. If you are not satisfied, you may return unused, unopened products in their original packaging within 14 days of receipt for a full refund. To initiate a return, please contact us at support@cherryvelle.com. We do not accept returns on opened cosmetic products for hygiene reasons, unless the product is faulty or not as described.`,
      },
      {
        heading: '7. Intellectual Property',
        body: `All content on this website — including text, images, logos, graphics, videos, and software — is the property of Cherryvelle Cosmetics or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without our express written permission.`,
      },
      {
        heading: '8. Disclaimer of Warranties',
        body: `Our website and products are provided "as is" without warranties of any kind, either express or implied, to the fullest extent permitted by law. We do not guarantee that the website will be error-free, uninterrupted, or free of viruses. Product results may vary between individuals.`,
      },
      {
        heading: '9. Limitation of Liability',
        body: `To the maximum extent permitted by law, Cherryvelle Cosmetics shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our website or products. Our total liability for any claim shall not exceed the amount paid by you for the specific product giving rise to the claim.`,
      },
      {
        heading: '10. Third-Party Links',
        body: `Our website may contain links to third-party websites for your convenience. These links do not constitute our endorsement of those sites or their content. We have no control over external sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.`,
      },
      {
        heading: '11. Governing Law',
        body: `These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.`,
      },
      {
        heading: '12. Contact Us',
        body: `If you have any questions about these Terms of Service, please contact us at:

Cherryvelle Cosmetics
Email: support@cherryvelle.com
Website: cherryvelle.com`,
      },
    ],
  },
};

export default function PolicyModal({ type, onClose }: PolicyModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const content = CONTENT[type];

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Close when clicking the backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: 'rgba(58, 24, 28, 0.55)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
    >
      {/* Modal panel */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: '#fcf7f3',
          animation: 'policyModalIn 0.28s cubic-bezier(0.34, 1.3, 0.64, 1) both',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b border-cherry-100 shrink-0"
          style={{ backgroundColor: '#fcf7f3' }}
        >
          <div>
            <h2 className="font-serif font-semibold text-cherry-dark text-xl sm:text-2xl">
              {content.title}
            </h2>
            <p className="text-xs text-cherry-text/60 mt-0.5">
              Last updated: {content.lastUpdated}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="ml-4 shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-cherry-text hover:text-cherry-dark hover:bg-cherry-100 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6 text-cherry-text text-sm leading-relaxed">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h3 className="font-serif font-semibold text-cherry-dark text-base mb-2">
                {section.heading}
              </h3>
              <p className="whitespace-pre-line">{section.body}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t border-cherry-100 shrink-0 flex justify-end"
          style={{ backgroundColor: '#fcf7f3' }}
        >
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: '#800020' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a333a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#800020')}
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes policyModalIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(16px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>,
    document.body
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Legal.css';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="legal-page">
            <div className="legal-header">
                <button className="legal-back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className="legal-title">Privacy Policy</h1>
            </div>

            <div className="legal-content">
                <p className="legal-updated">Last Updated: March 2025</p>

                {/* ── SUMMARY ── */}
                <div className="legal-highlight-box">
                    <p><strong>Key Points Summary</strong></p>
                    <ul>
                        <li>We collect only the data you voluntarily provide and basic app-usage analytics.</li>
                        <li>We <strong>never sell</strong> your personal data — this is prohibited under Vietnamese law (Decree 13/2023/ND-CP).</li>
                        <li>We obtain your <strong>explicit, separate consent</strong> before collecting each category of data.</li>
                        <li>You can access, correct, or delete your data within <strong>72 hours</strong> of your request.</li>
                        <li>Questions? Contact our Data Protection Officer at <a href="mailto:ceo@tecxmate.com">ceo@tecxmate.com</a>.</li>
                    </ul>
                </div>

                {/* ── 1 ── */}
                <section className="legal-section">
                    <h2>1. Introduction & Data Controller Identity</h2>
                    <p>
                        This Privacy Notice is issued by <strong>TECXMATE Corporation Ltd.</strong> (CÔNG TY TNHH TECXMATE / 達盟科技有限公司), a Limited Liability Company registered in Ho Chi Minh City, Vietnam ("we," "us," or "our"). We operate the <strong>Vietnamy</strong> language-learning application ("App" or "Services").
                    </p>
                    <p>
                        We act as the <strong>Data Controller</strong> for all personal data processed through the App. This notice explains what data we collect, why, how long we keep it, who sees it, and your rights — all in compliance with Vietnam's <strong>Decree 13/2023/ND-CP on Personal Data Protection (PDPD)</strong> and the <strong>2018 Law on Cybersecurity</strong>, as well as the forthcoming <strong>Law on Personal Data Protection (PDPL)</strong> effective January 1, 2026.
                    </p>
                    <p>
                        By using the App, you acknowledge you have read this notice. If you disagree, please discontinue use and contact us to delete your data.
                    </p>
                </section>

                {/* ── 2 ── */}
                <section className="legal-section">
                    <h2>2. What Information We Collect</h2>
                    <p>Under Vietnamese law, we classify data into two categories, each with different protection requirements.</p>

                    <h3>2.1 Basic Personal Data (Dữ Liệu Cá Nhân Cơ Bản)</h3>
                    <div className="legal-table-wrapper">
                        <table className="legal-table">
                            <thead>
                                <tr><th>Data Type</th><th>Why We Collect It</th><th>Retention</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Name &amp; display name</td><td>Personalise your experience</td><td>Duration of account + 24 months</td></tr>
                                <tr><td>Email address</td><td>Account authentication &amp; critical notices</td><td>Duration of account + 24 months</td></tr>
                                <tr><td>Device &amp; browser type</td><td>App stability &amp; troubleshooting</td><td>12 months rolling</td></tr>
                                <tr><td>IP address</td><td>Security &amp; fraud prevention</td><td>12 months rolling</td></tr>
                                <tr><td>Learning preferences &amp; progress</td><td>Personalise lessons &amp; track progress</td><td>Duration of account + 24 months</td></tr>
                                <tr><td>App usage analytics (pages, features used)</td><td>Service improvement</td><td>24 months rolling</td></tr>
                                <tr><td>Communications you send us</td><td>Support &amp; feedback</td><td>3 years</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>2.2 Sensitive Personal Data (Dữ Liệu Cá Nhân Nhạy Cảm)</h3>
                    <p>
                        Under Decree 13/2023, the following categories are classified as <strong>sensitive data</strong> and receive the highest level of protection. We <strong>currently do not collect</strong> sensitive data unless you explicitly provide it and give separate, specific consent:
                    </p>
                    <ul>
                        <li>Precise real-time geolocation (GPS coordinates) — <em>not collected by default</em></li>
                        <li>Financial information — only if you make an in-app purchase (processed by third-party payment gateway, not stored by us)</li>
                        <li>Health or biometric data — <em>not collected</em></li>
                    </ul>
                    <p>
                        If we ever introduce features that require sensitive data, you will be presented with a <strong>separate, opt-in consent screen</strong> specific to that data type and purpose before any collection begins.
                    </p>

                    <h3>2.3 Information Automatically Collected</h3>
                    <p>
                        When you use the App, we automatically collect certain technical information (e.g., device model, OS version, crash logs, and session timestamps). This does not reveal your specific identity but helps us maintain and improve the App. We use this data only for the stated purpose and retain it for 12–24 months on a rolling basis.
                    </p>

                    <h3>2.4 Information from Third Parties</h3>
                    <p>
                        If you choose to sign in using a social media account (e.g., Apple ID or Google), we receive only the basic profile information that account provider shares (typically name and email) in line with their privacy settings. We do not request additional permissions beyond what is necessary.
                    </p>
                </section>

                {/* ── 3 ── */}
                <section className="legal-section">
                    <h2>3. Legal Basis &amp; Consent (Vietnam PDPD)</h2>
                    <p>
                        Vietnam's Decree 13/2023 follows a <strong>Permission-Centric (opt-in) model</strong>. We only process your personal data when we have a valid legal basis. We rely on the following bases, which we will clearly state at the point of collection:
                    </p>
                    <ul>
                        <li><strong>Your Explicit Consent:</strong> The primary basis for all data collection. Consent must be voluntary, affirmative, and clearly given (e.g., ticking a box, pressing "I Agree"). Pre-ticked boxes and silence do not count. You may withdraw consent at any time.</li>
                        <li><strong>Contractual Necessity:</strong> Processing necessary to provide the Services you have requested (e.g., maintaining your learning account).</li>
                        <li><strong>Legal Obligation:</strong> Processing required by Vietnamese law or a lawful order from a competent authority.</li>
                        <li><strong>Legitimate Interest:</strong> Limited to security, fraud prevention, and App stability — only where these interests do not override your rights.</li>
                    </ul>
                    <p>
                        We obtain <strong>granular, separate consent</strong> for distinct purposes. For example, consenting to "using your email to send lesson reminders" is a separate consent action from "using anonymised analytics to improve the App." You can manage your consents at any time via the App settings or by emailing us.
                    </p>
                </section>

                {/* ── 4 ── */}
                <section className="legal-section">
                    <h2>4. How We Use Your Information</h2>
                    <ul>
                        <li><strong>Service Delivery:</strong> Provide, maintain, and personalise Vietnamy features (lessons, dictionary, progress tracking)</li>
                        <li><strong>Account Management:</strong> Create and manage your user account and authentication</li>
                        <li><strong>Communications:</strong> Send lesson reminders, service notices, and respond to support requests</li>
                        <li><strong>Service Improvement:</strong> Analyse anonymised usage patterns to improve features and content</li>
                        <li><strong>Security &amp; Fraud Prevention:</strong> Detect and prevent unauthorised access or abuse</li>
                        <li><strong>Legal Compliance:</strong> Comply with Vietnamese law, court orders, or regulatory requirements</li>
                        <li><strong>Marketing (with separate consent only):</strong> Send promotional content about new features — only if you have separately opted in</li>
                    </ul>
                    <p>
                        We will <strong>never use your data for a purpose incompatible</strong> with the purpose for which it was collected without obtaining new consent.
                    </p>
                </section>

                {/* ── 5 ── */}
                <section className="legal-section">
                    <h2>5. When &amp; With Whom We Share Your Data</h2>
                    <p>
                        We <strong>do not sell your personal data</strong>. Selling personal data without explicit legal permission is strictly prohibited under Vietnamese law and may result in fines of up to 10 times the revenue gained.
                    </p>
                    <p>We may share data only in the following circumstances:</p>
                    <h3>5.1 Service Providers (Data Processors)</h3>
                    <p>
                        We engage third-party service providers who process data on our behalf, under written contracts that require them to apply the same data protection standards. Categories include:
                    </p>
                    <ul>
                        <li>Cloud hosting &amp; infrastructure (servers that store App data)</li>
                        <li>Analytics services (anonymised/aggregated usage data only)</li>
                        <li>Payment processors (for premium subscriptions — they handle payment data directly; we do not store card details)</li>
                        <li>Communication tools (for sending in-app and email notifications)</li>
                    </ul>
                    <p>These providers cannot use your data for any purpose other than the specific service they provide to us.</p>

                    <h3>5.2 Legal Requirements</h3>
                    <p>
                        We may disclose your data if required by a binding order from Vietnamese law enforcement, courts, or regulatory bodies (including the Ministry of Public Security). We will notify you unless we are legally prohibited from doing so.
                    </p>

                    <h3>5.3 Business Transfers</h3>
                    <p>
                        If TECXMATE is involved in a merger, acquisition, or asset sale, your data may be transferred as part of that transaction. We will notify you and, where required, seek your consent before any such transfer.
                    </p>

                    <h3>5.4 With Your Consent</h3>
                    <p>
                        We may share your data with third parties in any other circumstance only with your explicit, informed consent.
                    </p>
                </section>

                {/* ── 6 ── */}
                <section className="legal-section">
                    <h2>6. International Data Transfers</h2>
                    <p>
                        Our primary services are operated from Vietnam. Some of our service providers (e.g., cloud hosting) may process data on servers outside Vietnam (such as in Singapore or the US).
                    </p>
                    <p>
                        Under Vietnam's <strong>Law on Cybersecurity and Decree 53/2022</strong>, if we transfer Vietnamese users' data cross-border, we are required to:
                    </p>
                    <ul>
                        <li>Conduct a <strong>Cross-border Transfer Impact Assessment (TIA)</strong></li>
                        <li>Submit a notification dossier to the Ministry of Public Security (MPS) within 60 days of commencing the transfer</li>
                        <li>Ensure contractual safeguards are in place with the receiving entity</li>
                    </ul>
                    <p>
                        We have completed or are in the process of completing these assessments. You may request details of our transfer safeguards by contacting our Data Protection Officer.
                    </p>
                </section>

                {/* ── 7 ── */}
                <section className="legal-section">
                    <h2>7. Data Retention</h2>
                    <p>
                        Under Vietnamese law (Decree 13/2023), personal data must be retained for at least <strong>24 months</strong> from the date of collection, unless a specific legal obligation requires a different period. We retain your data for as long as your account is active and for 24 months thereafter, unless:
                    </p>
                    <ul>
                        <li>You request deletion (we will process this within 72 hours, subject to legal obligations)</li>
                        <li>A longer retention period is required by Vietnamese tax, accounting, or regulatory law</li>
                    </ul>
                    <p>
                        When data is no longer needed, we will securely delete or anonymise it so it cannot be linked back to you.
                    </p>
                </section>

                {/* ── 8 ── */}
                <section className="legal-section">
                    <h2>8. Data Security</h2>
                    <p>
                        We implement appropriate technical and organisational security measures in line with the requirements of Decree 13/2023, including:
                    </p>
                    <ul>
                        <li><strong>Encryption:</strong> Data in transit is encrypted using TLS 1.2 or higher. Sensitive data at rest is encrypted.</li>
                        <li><strong>Access Controls:</strong> Strictly limited to personnel with a need-to-know basis; all access is logged.</li>
                        <li><strong>Anonymisation &amp; De-identification:</strong> Analytics data is anonymised before processing where possible.</li>
                        <li><strong>Security Audits:</strong> We conduct periodic internal security reviews and maintain a Data Processing Impact Assessment (DPIA) dossier as required by Vietnamese law.</li>
                        <li><strong>Breach Response:</strong> In the event of a data breach, we will notify the Ministry of Public Security (A05 Department) within <strong>72 hours</strong> of discovery and inform affected users without undue delay.</li>
                    </ul>
                    <p>
                        No method of transmission over the internet is 100% secure. We cannot guarantee absolute security, but we commit to reporting and responding to any known breach promptly.
                    </p>
                </section>

                {/* ── 9 ── */}
                <section className="legal-section">
                    <h2>9. Cookies &amp; Tracking Technologies</h2>
                    <p>
                        We use minimal cookies and similar technologies (local storage) to maintain your session, save your settings, and improve App performance. We do <strong>not</strong> use third-party advertising cookies or cross-site tracking pixels.
                    </p>
                    <p>
                        Under Vietnamese law, we must inform you when tracking technologies are in use and provide a clear opt-out mechanism. You can manage or clear stored data at any time through your device's app settings. Opting out of session storage may affect certain App functionality.
                    </p>
                </section>

                {/* ── 10 ── */}
                <section className="legal-section">
                    <h2>10. Children's Privacy</h2>
                    <p>
                        Our Services are not directed to individuals under the age of 18. We do not knowingly collect personal data from minors. If you believe we have inadvertently collected data from a child, please contact us immediately at <a href="mailto:ceo@tecxmate.com">ceo@tecxmate.com</a> and we will delete it within 72 hours.
                    </p>
                </section>

                {/* ── 11 ── */}
                <section className="legal-section">
                    <h2>11. Your Rights Under Vietnamese Law</h2>
                    <p>
                        Decree 13/2023 grants you <strong>11 specific rights</strong> regarding your personal data. We will respond to all requests within <strong>72 hours</strong>:
                    </p>
                    <ul>
                        <li><strong>1. Right to Know:</strong> Be informed about whether and how your data is being processed</li>
                        <li><strong>2. Right to Consent:</strong> Give or withdraw consent at any time for each data processing purpose</li>
                        <li><strong>3. Right to Access:</strong> Request a copy of the personal data we hold about you</li>
                        <li><strong>4. Right to Correction:</strong> Request correction of inaccurate or incomplete data</li>
                        <li><strong>5. Right to Deletion:</strong> Request deletion of your data (subject to legal retention obligations)</li>
                        <li><strong>6. Right to Restriction:</strong> Request that we limit how we process your data in certain circumstances</li>
                        <li><strong>7. Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
                        <li><strong>8. Right to Object:</strong> Object to processing based on legitimate interests, or to direct marketing</li>
                        <li><strong>9. Right to Opt-out of Automated Decisions:</strong> Not be subject to decisions made solely by automated means that significantly affect you</li>
                        <li><strong>10. Right to Complain:</strong> If you believe your rights have been violated, we encourage you to contact us directly first so we can resolve the matter promptly. If a resolution cannot be reached, you may escalate to the competent authority under applicable law.</li>
                        <li><strong>11. Right to Compensation:</strong> Seek compensation for damages resulting from a violation of your data rights</li>
                    </ul>
                    <p>
                        To exercise any right, email us at <a href="mailto:ceo@tecxmate.com">ceo@tecxmate.com</a> with the subject line "Data Rights Request." We will verify your identity and respond within 72 hours.
                    </p>
                    <p>
                        <strong>Withdrawing consent</strong> does not affect the lawfulness of processing that occurred before withdrawal.
                    </p>
                    <p>
                        <strong>Opting out of marketing:</strong> You may unsubscribe from promotional messages at any time via the link in the email or by emailing us. We will still send essential service notifications.
                    </p>
                </section>

                {/* ── 12 ── */}
                <section className="legal-section">
                    <h2>12. Prohibited Practices</h2>
                    <p>In accordance with Vietnamese law, we explicitly confirm:</p>
                    <ul>
                        <li><strong>No Sale of Data:</strong> We do not sell personal data to any third party. This is strictly prohibited under Decree 13/2023 and carries fines of up to 10× the revenue gained.</li>
                        <li><strong>No Unlawful ID Harvesting:</strong> We do not require copies of ID cards or passports merely for account verification.</li>
                        <li><strong>No Unlawful Profiling:</strong> We do not create profiles based on sensitive data categories (race, religion, political views, health, sexual orientation) without explicit consent.</li>
                        <li><strong>No Purpose Creep:</strong> We will not repurpose your data for uses incompatible with the original collection purpose without new consent.</li>
                    </ul>
                </section>

                {/* ── 13 ── */}
                <section className="legal-section">
                    <h2>13. Updates to This Policy</h2>
                    <p>
                        We may update this Privacy Policy to reflect changes in law or our practices. We will notify you of material changes by:
                    </p>
                    <ul>
                        <li>Posting the updated Policy in the App with a prominent notice</li>
                        <li>Updating the "Last Updated" date at the top</li>
                        <li>Sending an email notification (if you have provided your email)</li>
                    </ul>
                    <p>
                        Where changes require new consent (e.g., a new data processing purpose), we will present a consent screen before the change takes effect.
                    </p>
                </section>

                {/* ── 14 ── */}
                <section className="legal-section">
                    <h2>14. Contact — Data Protection Officer</h2>
                    <p>
                        If you have any questions, requests, or concerns about this Privacy Policy or our data practices, please contact our Data Protection Officer:
                    </p>
                    <div className="legal-contact-card">
                        <p><strong>TECXMATE Corporation Ltd.</strong><br />
                            CÔNG TY TNHH TECXMATE / 達盟科技有限公司</p>
                        <p>Villa Park Complex, Phu Huu Ward, Ho Chi Minh City, Vietnam</p>
                        <p>Email (DPO): <a href="mailto:ceo@tecxmate.com">ceo@tecxmate.com</a></p>
                        <p>Website: <a href="https://www.tecxmate.com" target="_blank" rel="noopener noreferrer">www.tecxmate.com</a></p>
                    </div>
                    <p>
                        If you are unable to resolve a concern through us directly, you may seek recourse through the competent authority or legal channels available under applicable law in your jurisdiction. We commit to cooperating in good faith with any such process.
                    </p>
                    <p className="legal-governing">
                        Governing Law: This Privacy Policy is governed by the laws of the Socialist Republic of Vietnam, including Decree 13/2023/ND-CP and the 2018 Law on Cybersecurity.
                    </p>
                    <p className="legal-governing">

                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

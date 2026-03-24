import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Legal.css';

const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <div className="legal-page">
            <div className="legal-header">
                <button className="legal-back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className="legal-title">Terms of Service</h1>
            </div>

            <div className="legal-content">
                <p className="legal-updated">Last Updated: March 2025</p>

                {/* ── INTRO ── */}
                <div className="legal-highlight-box">
                    <p><strong>Agreement to Our Legal Terms</strong></p>
                    <p>
                        We are <strong>TECXMATE Corporation Ltd.</strong> (CÔNG TY TNHH TECXMATE / 達盟科技有限公司), registered in Ho Chi Minh City, Vietnam. We operate the <strong>VNME</strong> language-learning application ("App" or "Services").
                    </p>
                    <p>
                        By accessing or using the App, you confirm that you have read, understood, and agree to these Terms of Service ("Terms"). If you do not agree, please discontinue use immediately. You can reach us at <a href="mailto:ceo@tecxmate.com">ceo@tecxmate.com</a>.
                    </p>
                </div>

                {/* ── 1 ── */}
                <section className="legal-section">
                    <h2>1. Our Services</h2>
                    <p>
                        VNME provides Vietnamese language-learning content, including lessons, vocabulary exercises, reading materials, a dictionary, grammar guides, and community features. The App is intended for personal, non-commercial educational use.
                    </p>
                    <p>
                        The Services are available globally. Users accessing the App from outside Vietnam are responsible for compliance with their local laws. The App is not intended for users under 18 years of age.
                    </p>
                    <p>
                        We reserve the right to modify, suspend, or discontinue any feature of the Services at any time, with reasonable notice where practical.
                    </p>
                </section>

                {/* ── 2 ── */}
                <section className="legal-section">
                    <h2>2. Intellectual Property Rights</h2>
                    <h3>2.1 Our Content</h3>
                    <p>
                        All content in the App — including text, audio, graphics, lesson designs, software code, trademarks, and logos — is owned by or licensed to TECXMATE and is protected by Vietnamese and international copyright and intellectual property laws.
                    </p>
                    <p>
                        We grant you a <strong>non-exclusive, non-transferable, revocable licence</strong> to access and use the App solely for your personal, non-commercial language-learning purposes. You may not copy, reproduce, redistribute, sell, or create derivative works from any App content without our express prior written permission.
                    </p>

                    <h3>2.2 Your Submissions</h3>
                    <p>
                        If you submit feedback, suggestions, or other content to us ("Submissions"), you grant TECXMATE a non-exclusive, worldwide, royalty-free licence to use, reproduce, and incorporate those Submissions to improve our Services. You retain ownership of your Submissions.
                    </p>
                    <p>
                        You are solely responsible for ensuring your Submissions do not infringe any third-party intellectual property rights or applicable laws.
                    </p>
                </section>

                {/* ── 3 ── */}
                <section className="legal-section">
                    <h2>3. User Accounts &amp; Registration</h2>
                    <p>
                        You may use the App with or without creating an account. If you register, you agree to:
                    </p>
                    <ul>
                        <li>Provide accurate, complete, and up-to-date information</li>
                        <li>Keep your login credentials confidential</li>
                        <li>Notify us immediately of any unauthorised use of your account at <a href="mailto:ceo@tecxmate.com">ceo@tecxmate.com</a></li>
                        <li>Be responsible for all activity that occurs under your account</li>
                    </ul>
                    <p>
                        We reserve the right to suspend or terminate accounts that violate these Terms, contain false information, or are used fraudulently.
                    </p>
                </section>

                {/* ── 4 ── */}
                <section className="legal-section">
                    <h2>4. Purchases, Subscriptions &amp; Payments</h2>
                    <h3>4.1 Premium Features</h3>
                    <p>
                        Certain premium features may require a paid subscription or one-time purchase. All prices are displayed in the App prior to purchase. We reserve the right to change pricing with reasonable advance notice.
                    </p>
                    <h3>4.2 Payment Processing</h3>
                    <p>
                        Payments are processed by third-party payment providers (e.g., Apple App Store, Google Play Store, or other providers). Your payment information is handled directly by these providers and is subject to their privacy policies. TECXMATE does not store your payment card details.
                    </p>
                    <h3>4.3 Subscriptions &amp; Cancellations</h3>
                    <p>
                        Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current billing period. You can manage and cancel subscriptions through your device's App Store settings. Refunds are governed by the applicable App Store's refund policy.
                    </p>
                    <h3>4.4 Refunds</h3>
                    <p>
                        For purchases made directly through TECXMATE (if applicable), please contact us within 14 days of purchase if you experience issues. We will assess refund requests on a case-by-case basis in accordance with Vietnamese consumer protection law.
                    </p>
                </section>

                {/* ── 5 ── */}
                <section className="legal-section">
                    <h2>5. Prohibited Activities</h2>
                    <p>You agree not to use the App to:</p>
                    <ul>
                        <li>Violate any applicable Vietnamese or international law or regulation</li>
                        <li>Copy, scrape, or extract App content using automated tools without permission</li>
                        <li>Reverse-engineer, decompile, or disassemble any part of the App</li>
                        <li>Impersonate another user, person, or entity</li>
                        <li>Upload or transmit malware, viruses, or any malicious code</li>
                        <li>Harass, threaten, or harm other users</li>
                        <li>Interfere with the App's servers, networks, or security features</li>
                        <li>Use the App for commercial purposes without our written permission</li>
                        <li>Attempt to gain unauthorised access to any part of the App or our systems</li>
                        <li>Post content that is defamatory, obscene, discriminatory, or illegal under Vietnamese law</li>
                    </ul>
                    <p>
                        Violations may result in immediate account suspension, reporting to Vietnamese authorities, and civil or criminal liability.
                    </p>
                </section>

                {/* ── 6 ── */}
                <section className="legal-section">
                    <h2>6. User-Generated Contributions</h2>
                    <p>
                        The App may allow you to submit content such as comments, feedback, or forum posts ("Contributions"). By submitting Contributions, you confirm that:
                    </p>
                    <ul>
                        <li>You own the content or have the necessary rights to submit it</li>
                        <li>The content does not infringe any third-party intellectual property rights</li>
                        <li>The content is accurate and not misleading</li>
                        <li>The content does not contain illegal material or violate these Terms</li>
                    </ul>
                    <p>
                        We reserve the right to remove Contributions that violate these Terms without notice. You are solely responsible for your Contributions.
                    </p>
                </section>

                {/* ── 7 ── */}
                <section className="legal-section">
                    <h2>7. Third-Party Services &amp; Links</h2>
                    <p>
                        The App may contain links to third-party websites or services (e.g., partner language resources). We are not responsible for the content, accuracy, or privacy practices of any third-party service. Accessing third-party links is at your own risk; their terms and privacy policies will apply.
                    </p>
                    <p>
                        Our App may integrate with third-party APIs (e.g., translation services, text-to-speech). Your use of features powered by these integrations is subject to both our Terms and the third party's terms.
                    </p>
                </section>

                {/* ── 8 ── */}
                <section className="legal-section">
                    <h2>8. Privacy Policy</h2>
                    <p>
                        Your use of the App is also governed by our <strong>Privacy Policy</strong>, which is incorporated into these Terms by reference. Our Privacy Policy complies with Vietnam's Decree 13/2023/ND-CP on Personal Data Protection. Please review it carefully — you can access it directly in the App's Settings menu.
                    </p>
                    <p>
                        Key privacy commitments: we do not sell your data, we obtain separate explicit consent for each data collection purpose, and we respond to all data rights requests within 72 hours.
                    </p>
                </section>

                {/* ── 9 ── */}
                <section className="legal-section">
                    <h2>9. Data Protection Obligations (Vietnam Law)</h2>
                    <p>
                        As a technology service operating in Vietnam, TECXMATE complies with:
                    </p>
                    <ul>
                        <li><strong>Decree 13/2023/ND-CP</strong> (Personal Data Protection Decree)</li>
                        <li><strong>2018 Law on Cybersecurity</strong> and its implementing decrees</li>
                        <li>The forthcoming <strong>Law on Personal Data Protection (PDPL)</strong>, effective January 1, 2026</li>
                    </ul>
                    <p>
                        We maintain a Data Processing Impact Assessment (DPIA) dossier submitted to the Department of Cybersecurity (A05), Ministry of Public Security, as required by law. For cross-border data transfers, we conduct Transfer Impact Assessments (TIA) and file notifications with the Ministry within 60 days of commencing such transfers.
                    </p>
                </section>

                {/* ── 10 ── */}
                <section className="legal-section">
                    <h2>10. Services Management</h2>
                    <p>We reserve the right to:</p>
                    <ul>
                        <li>Monitor the App for violations of these Terms</li>
                        <li>Take appropriate action (including account removal) against users who violate these Terms or applicable law</li>
                        <li>Remove or restrict content that is excessive, illegal, or harmful</li>
                        <li>Manage the App to protect our rights and ensure proper operation</li>
                    </ul>
                </section>

                {/* ── 11 ── */}
                <section className="legal-section">
                    <h2>11. Term &amp; Termination</h2>
                    <p>
                        These Terms remain in effect while you use the Services. We may suspend or terminate your access immediately, without prior liability, if you:
                    </p>
                    <ul>
                        <li>Breach any provision of these Terms</li>
                        <li>Violate applicable Vietnamese law</li>
                        <li>Engage in fraudulent or harmful activity</li>
                    </ul>
                    <p>
                        Upon termination, your licence to use the App ceases immediately. You may request deletion of your account data per our Privacy Policy. Provisions of these Terms that by their nature should survive termination (including IP rights, limitation of liability, and dispute resolution) will continue to apply.
                    </p>
                </section>

                {/* ── 12 ── */}
                <section className="legal-section">
                    <h2>12. Disclaimer of Warranties</h2>
                    <p>
                        THE APP AND ALL CONTENT ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                    </p>
                    <p>
                        We do not guarantee that the App will be error-free, uninterrupted, or free from viruses. We do not guarantee specific learning outcomes or results. You use the App at your own risk.
                    </p>
                </section>

                {/* ── 13 ── */}
                <section className="legal-section">
                    <h2>13. Limitation of Liability</h2>
                    <p>
                        TO THE MAXIMUM EXTENT PERMITTED BY VIETNAMESE LAW, TECXMATE AND ITS OFFICERS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF DATA, PROFITS, OR BUSINESS OPPORTUNITIES, ARISING FROM YOUR USE OF THE APP.
                    </p>
                    <p>
                        Our total cumulative liability for any claim arising from or related to the App shall not exceed the greater of: (a) the total amount you paid to us in the 12 months preceding the claim, or (b) USD $50.
                    </p>
                    <p>
                        Some jurisdictions do not allow limitation of liability for certain damages. In such cases, our liability is limited to the maximum extent permitted by applicable law.
                    </p>
                </section>

                {/* ── 14 ── */}
                <section className="legal-section">
                    <h2>14. Indemnification</h2>
                    <p>
                        You agree to defend, indemnify, and hold harmless TECXMATE and its affiliates, officers, employees, and agents from any claims, liabilities, damages, or expenses (including legal fees) arising from: (a) your use of the App; (b) your Contributions; (c) your breach of these Terms; or (d) your violation of any third-party rights or applicable law.
                    </p>
                </section>

                {/* ── 15 ── */}
                <section className="legal-section">
                    <h2>15. Governing Law &amp; Dispute Resolution</h2>
                    <h3>15.1 Governing Law</h3>
                    <p>
                        These Terms are governed by and construed in accordance with the laws of the <strong>Socialist Republic of Vietnam</strong>, without regard to conflict-of-law principles.
                    </p>
                    <h3>15.2 Informal Resolution</h3>
                    <p>
                        Before commencing any formal dispute process, the parties agree to attempt good-faith negotiation for at least 30 days. Please contact us at <a href="mailto:ceo@tecxmate.com">ceo@tecxmate.com</a> to initiate this process.
                    </p>
                    <h3>15.3 Jurisdiction</h3>
                    <p>
                        If informal negotiation fails, disputes shall be subject to the exclusive jurisdiction of the competent courts of <strong>Ho Chi Minh City, Vietnam</strong>. For international clients, the parties may also agree to mediation or arbitration under the Vietnam International Arbitration Centre (VIAC) rules.
                    </p>
                </section>

                {/* ── 16 ── */}
                <section className="legal-section">
                    <h2>16. Electronic Communications &amp; Signatures</h2>
                    <p>
                        By using the App, you consent to receiving electronic communications from us (via email or in-app notifications). Electronic agreements, notices, and records satisfy any requirement that such communications be in writing, in accordance with Vietnam's Law on Electronic Transactions.
                    </p>
                </section>

                {/* ── 17 ── */}
                <section className="legal-section">
                    <h2>17. Modifications to Terms</h2>
                    <p>
                        We reserve the right to update these Terms at any time. Material changes will be communicated by:
                    </p>
                    <ul>
                        <li>Posting the updated Terms in the App with a prominent notice</li>
                        <li>Updating the "Last Updated" date</li>
                        <li>Sending an email notification to registered users</li>
                    </ul>
                    <p>
                        Your continued use of the App after changes are posted constitutes acceptance of the modified Terms. If you do not agree to the updated Terms, please discontinue use and contact us to delete your account.
                    </p>
                </section>

                {/* ── 18 ── */}
                <section className="legal-section">
                    <h2>18. Miscellaneous</h2>
                    <ul>
                        <li><strong>Severability:</strong> If any provision of these Terms is unenforceable, the remaining provisions remain in full effect.</li>
                        <li><strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy, constitute the entire agreement between you and TECXMATE regarding the App.</li>
                        <li><strong>Waiver:</strong> Failure to enforce any provision does not constitute a waiver of that right.</li>
                        <li><strong>Assignment:</strong> We may assign our rights and obligations under these Terms to another entity with notice to you. You may not assign your rights without our consent.</li>
                        <li><strong>No Partnership:</strong> Nothing in these Terms creates a joint venture, partnership, or employment relationship between you and TECXMATE.</li>
                    </ul>
                </section>

                {/* ── 19 ── */}
                <section className="legal-section">
                    <h2>19. Contact Us</h2>
                    <p>For questions, complaints, or further information about these Terms, please contact us:</p>
                    <div className="legal-contact-card">
                        <p><strong>TECXMATE Corporation Ltd.</strong><br />
                            CÔNG TY TNHH TECXMATE / 達盟科技有限公司</p>
                        <p>Villa Park Complex, Phu Huu Ward, Ho Chi Minh City, Vietnam</p>
                        <p>Email: <a href="mailto:ceo@tecxmate.com">ceo@tecxmate.com</a></p>
                        <p>Website: <a href="https://www.tecxmate.com" target="_blank" rel="noopener noreferrer">www.tecxmate.com</a></p>
                    </div>
                    <p className="legal-governing">
                        Governing Law: These Terms are governed by the laws of the Socialist Republic of Vietnam.
                    </p>
                    <p className="legal-governing">

                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;

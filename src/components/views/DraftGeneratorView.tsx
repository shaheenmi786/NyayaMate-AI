import React, { useState } from 'react';
import { Copy, Bookmark, Download, FileCode, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import type { DraftNotice } from '../../types';
import { saveDraft } from '../../services/draftsService';
import { addSavedItem } from '../../services/savedItemsService';

interface DraftGeneratorViewProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const DraftGeneratorView: React.FC<DraftGeneratorViewProps> = ({ showToast }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('deposit');
  const [formData, setFormData] = useState({
    senderName: 'Aarav Sharma',
    recipientName: 'Ramesh Kumar (Landlord)',
    propertyAddress: 'Flat 302, Green Residence, Indiranagar, Bengaluru',
    depositAmount: '₹80,000',
    noticeDays: '15',
    productName: 'Smart LED TV 55-inch',
    purchaseDate: '15 August 2026',
    complaintReason: 'Display screen malfunction and authorized service center failure to repair under manufacturer warranty.',
    salaryMonths: 'August and September 2026',
    salaryAmount: '₹1,50,000',
    invoiceNumber: 'INV-2026-089',
    invoiceAmount: '₹2,45,000',
    transactionId: 'UPI/2026/0918239012',
    bankName: 'State Bank of India',
    incidentDate: '20 October 2026',
    publicAuthority: 'Public Information Officer (PIO), Bengaluru Municipal Corporation (BBMP)',
    rtiSubject: 'Status of Road Repair Works and Budget Utilization under Ward 112.',
  });

  const generateDraftText = (): string => {
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    switch (selectedTemplate) {
      case 'deposit':
        return `LEGAL NOTICE FOR REFUND OF SECURITY DEPOSIT

Date: ${today}

TO,
${formData.recipientName}
Property Address: ${formData.propertyAddress}

FROM,
${formData.senderName}

SUBJECT: Formal Demand Notice for Immediate Return of Refundable Security Deposit Amounting to ${formData.depositAmount}.

Sir / Madam,

This notice serves as a formal communication regarding the residential tenancy for premises situated at:
${formData.propertyAddress}.

1. That under the tenancy agreement entered between us, I paid a refundable security deposit of ${formData.depositAmount}.
2. That I have handed over vacant, peaceful, and unencumbered possession of the premises to you on time and in good tenantable order.
3. That as per agreed terms and statutory tenancy principles, the refundable security deposit was payable immediately upon premise handover.
4. You are hereby called upon to refund the full security deposit amount of ${formData.depositAmount} to my bank account within ${formData.noticeDays} days of receipt of this notice.
5. In the event of failure to comply, I shall be constrained to initiate appropriate civil recovery suits and lodge a formal dispute before the competent Rent Authority / Tribunal at your sole risk, costs, and consequences.

Yours sincerely,

___________________________
${formData.senderName}`;

      case 'consumer':
        return `FORMAL NOTICE UNDER CONSUMER PROTECTION ACT, 2019

Date: ${today}

TO,
The Grievance Officer / Customer Service Manager,
${formData.recipientName}

FROM,
${formData.senderName}

SUBJECT: Final Pre-Litigation Notice regarding Defective Product (${formData.productName}) and Failure to Remedy under Warranty.

Sir / Madam,

Take notice that on ${formData.purchaseDate}, I purchased:
Product: ${formData.productName}

1. The said product suffered severe defects, specifically: ${formData.complaintReason}.
2. Despite repeated escalations and service requests under the active manufacturer warranty, your authorized service network has failed to repair or replace the defective unit.
3. Such refusal constitutes a deficiency of service and unfair trade practice under Section 2(11) and Section 2(47) of the Consumer Protection Act, 2019.
4. You are hereby granted 7 business days from receipt of this notice to either replace the defective product with a new defect-free unit or issue a 100% full refund.
5. Take further notice that if you fail to resolve this dispute within the stipulated time, a formal consumer grievance will be filed on the National Consumer Helpline (1915) and an online complaint instituted on the e-Daakhil portal before the District Consumer Disputes Redressal Commission seeking refund, compensation, and litigation costs.

Yours faithfully,

___________________________
${formData.senderName}`;

      case 'salary':
        return `FORMAL DEMAND NOTICE FOR UNPAID SALARY AND SETTLEMENT DUES

Date: ${today}

TO,
Managing Director / Human Resources Department,
${formData.recipientName}

FROM,
${formData.senderName}

SUBJECT: Demand Notice for Disbursal of Unpaid Wages & Arrears Amounting to ${formData.salaryAmount}.

Sir / Madam,

I was employed with your esteemed organization. This notice is issued regarding the persistent delay in disbursing my earned remuneration:

1. That my salary for the period: ${formData.salaryMonths}, amounting to ${formData.salaryAmount}, has been unlawfully withheld without statutory justification.
2. Under the Payment of Wages Act, 1936 and Code on Wages, 2019, an employer is statutorily obligated to remit earned wages without unauthorized deductions within the stipulated wage period.
3. You are hereby called upon to credit the outstanding remuneration of ${formData.salaryAmount} along with applicable interest to my registered salary account within 10 days of receiving this notice.
4. Failing compliance, I will be constrained to approach the Office of the Deputy Labour Commissioner for statutory recovery and initiate appropriate proceedings before the Labour Court.

Sincerely,

___________________________
${formData.senderName}`;

      case 'business':
        return `DEMAND NOTICE FOR PAYMENT OF OVERDUE INVOICE (MSME / COMMERCIAL)

Date: ${today}

TO,
${formData.recipientName}

FROM,
${formData.senderName}

SUBJECT: Final Demand Notice for Payment of Overdue Commercial Invoice No. ${formData.invoiceNumber} amounting to ${formData.invoiceAmount}.

Sir / Madam,

This notice is issued in respect of goods delivered / services performed under Invoice No: ${formData.invoiceNumber}.

1. That the invoice amount of ${formData.invoiceAmount} fell due for payment upon expiry of the agreed credit period.
2. Despite repeated reminders, the outstanding sum remains unpaid in breach of commercial contract terms.
3. You are hereby called upon to liquidate the outstanding amount of ${formData.invoiceAmount} together with penal interest within ${formData.noticeDays} days from receipt of this notice.
4. Failure to comply will result in initiation of summary recovery proceedings under Order XXXVII of the Code of Civil Procedure and/or filing an application before the MSME Samadhaan Facilitation Council.

Yours faithfully,

___________________________
${formData.senderName}`;

      case 'cyber':
        return `FORMAL DISPUTE NOTICE FOR UNAUTHORIZED TRANSACTION (ZERO-LIABILITY NOTICE)

Date: ${today}

TO,
The Branch Manager / Nodal Grievance Officer,
${formData.bankName}

FROM,
${formData.senderName}

SUBJECT: Reporting Unauthorized Electronic Banking Transaction under RBI Zero-Liability Guidelines (Circular DBR.No.Leg.BC.78/09.07.005/2017-18).

Respected Sir / Madam,

I am an account holder maintaining an account with your branch. I hereby report an unauthorized fraudulent transaction that occurred on ${formData.incidentDate}:

1. Transaction ID / Reference: ${formData.transactionId}
2. The aforementioned transaction was neither authorized by me nor was OTP / confidential PIN shared with any third party.
3. As this unauthorized electronic banking transaction arose due to third-party cyber fraud and is reported within 3 working days of the incident, my entitlement to Zero Liability is protected under RBI Circular guidelines.
4. An official cybercrime incident complaint has also been registered on the National Cyber Crime Reporting Portal (cybercrime.gov.in).
5. You are requested to reverse the disputed amount of debit entry, restore my balance, and furnish the chargeback dispute tracking number immediately.

Yours sincerely,

___________________________
${formData.senderName}`;

      case 'rti':
        return `APPLICATION FOR OBTAINING INFORMATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005

Date: ${today}

TO,
${formData.publicAuthority}

FROM,
${formData.senderName}

SUBJECT: Application under Section 6(1) of the RTI Act, 2005.

Sir / Madam,

I am a citizen of India and hereby request you to provide the following information under the RTI Act, 2005:

1. Subject Matter: ${formData.rtiSubject}
2. Period to which information relates: Past 12 Months.
3. Description of Information Required:
   (a) Certified copies of work orders, sanctioned estimates, and inspection reports relating to the aforementioned subject matter.
   (b) Certified details of expenditure incurred and contractor payment clearances.
4. Application Fee: RTI fee of ₹10 is enclosed via Indian Postal Order / Online payment receipt.
5. In accordance with Section 7(1) of the RTI Act, 2005, kindly provide the requested information within the statutory period of 30 days.

Applicant Signature:

___________________________
${formData.senderName}`;

      default:
        return 'Select a template above to generate draft.';
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(generateDraftText());
    showToast('Legal draft copied to clipboard', 'success');
  };

  const handleDownload = () => {
    const text = generateDraftText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NyayaMate_${selectedTemplate.toUpperCase()}_Notice_Draft.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Draft downloaded as text file', 'success');
  };

  const handleSaveDraft = async () => {
    const text = generateDraftText();
    const titles: Record<string, string> = {
      deposit: 'Security Deposit Refund Demand Notice',
      consumer: 'Consumer Complaint Formal Notice',
      salary: 'Unpaid Salary Demand Notice',
      business: 'Commercial Overdue Invoice Notice',
      cyber: 'RBI Cyber Fraud Zero-Liability Letter',
      rti: 'RTI Application Form',
    };

    const draftTitle = titles[selectedTemplate] || 'Legal Notice Draft';

    await saveDraft({
      templateType: selectedTemplate,
      title: draftTitle,
      formData: formData,
      generatedText: text,
    });

    await addSavedItem({
      type: 'draft',
      title: draftTitle,
      category: 'Legal Draft',
      content: text,
      metadata: { templateType: selectedTemplate },
    });

    showToast('Draft saved to database and Saved Items', 'success');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Legal Draft Generator</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select an Indian legal notice template, customize details, and generate editable text for pre-litigation demands.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Draft Advisory:</strong> Generated texts are standard templates. Verify names, figures, and dates before dispatching via registered post or email.
        </span>
      </div>

      {/* Template Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <TemplateCard
          title="Deposit Refund"
          badge="Tenancy"
          selected={selectedTemplate === 'deposit'}
          onClick={() => setSelectedTemplate('deposit')}
        />
        <TemplateCard
          title="Consumer Notice"
          badge="CPA 2019"
          selected={selectedTemplate === 'consumer'}
          onClick={() => setSelectedTemplate('consumer')}
        />
        <TemplateCard
          title="Unpaid Salary"
          badge="Labour"
          selected={selectedTemplate === 'salary'}
          onClick={() => setSelectedTemplate('salary')}
        />
        <TemplateCard
          title="Invoice Due"
          badge="Commercial"
          selected={selectedTemplate === 'business'}
          onClick={() => setSelectedTemplate('business')}
        />
        <TemplateCard
          title="Cyber Dispute"
          badge="RBI Zero-Liab"
          selected={selectedTemplate === 'cyber'}
          onClick={() => setSelectedTemplate('cyber')}
        />
        <TemplateCard
          title="RTI Request"
          badge="RTI Act"
          selected={selectedTemplate === 'rti'}
          onClick={() => setSelectedTemplate('rti')}
        />
      </div>

      {/* Form + Live Draft Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Customize Notice Details</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Full Name (Sender)
            </label>
            <input
              type="text"
              value={formData.senderName}
              onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Opposite Party Name (Recipient)
            </label>
            <input
              type="text"
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {selectedTemplate === 'deposit' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tenancy Property Address
                </label>
                <input
                  type="text"
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Deposit Amount
                  </label>
                  <input
                    type="text"
                    value={formData.depositAmount}
                    onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cure Notice Days
                  </label>
                  <input
                    type="text"
                    value={formData.noticeDays}
                    onChange={(e) => setFormData({ ...formData, noticeDays: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </>
          )}

          {selectedTemplate === 'consumer' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product / Service Name
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date of Purchase
                </label>
                <input
                  type="text"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nature of Defect & Grievance
                </label>
                <textarea
                  rows={3}
                  value={formData.complaintReason}
                  onChange={(e) => setFormData({ ...formData, complaintReason: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
            </>
          )}

          {selectedTemplate === 'salary' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Unpaid Months
                </label>
                <input
                  type="text"
                  value={formData.salaryMonths}
                  onChange={(e) => setFormData({ ...formData, salaryMonths: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Total Arrears (₹)
                </label>
                <input
                  type="text"
                  value={formData.salaryAmount}
                  onChange={(e) => setFormData({ ...formData, salaryAmount: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          )}

          {selectedTemplate === 'business' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Invoice Amount (₹)
                </label>
                <input
                  type="text"
                  value={formData.invoiceAmount}
                  onChange={(e) => setFormData({ ...formData, invoiceAmount: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          )}

          {selectedTemplate === 'cyber' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bank Name & Branch
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fraud Transaction ID
                  </label>
                  <input
                    type="text"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Incident Date
                  </label>
                  <input
                    type="text"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </>
          )}

          {selectedTemplate === 'rti' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Public Authority (PIO Department)
                </label>
                <input
                  type="text"
                  value={formData.publicAuthority}
                  onChange={(e) => setFormData({ ...formData, publicAuthority: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject of Information Query
                </label>
                <input
                  type="text"
                  value={formData.rtiSubject}
                  onChange={(e) => setFormData({ ...formData, rtiSubject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
            </>
          )}
        </div>

        {/* Live Preview Text Area */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3 mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-teal-600" />
                <span>Generated Notice Preview</span>
              </h2>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded font-mono">
                Live Dynamic
              </span>
            </div>

            <textarea
              rows={14}
              value={generateDraftText()}
              readOnly
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 font-mono text-[11px] sm:text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl leading-relaxed focus:outline-none resize-none shadow-inner"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Notice</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Download as .txt"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={handleSaveDraft}
              className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Save to Supabase Drafts"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplateCard: React.FC<{
  title: string;
  badge: string;
  selected: boolean;
  onClick: () => void;
}> = ({ title, badge, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-2xl border cursor-pointer transition text-center ${
        selected
          ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-200 shadow-xs'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
      }`}
    >
      <span className="inline-block text-[9px] uppercase font-bold text-teal-600 dark:text-teal-400 bg-teal-100/60 dark:bg-teal-950 px-1.5 py-0.2 rounded mb-1">
        {badge}
      </span>
      <h3 className="font-bold text-xs truncate text-slate-800 dark:text-slate-100">{title}</h3>
    </div>
  );
};

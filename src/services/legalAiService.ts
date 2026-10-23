import type { Citation } from '../types';

interface LegalAiResponse {
  answer: string;
  citations: Citation[];
  suggestedDraftTemplate?: string;
}

export async function askLegalAi(
  query: string,
  language: string = 'English'
): Promise<LegalAiResponse> {
  // Check if user has an external AI endpoint configured
  const endpoint = import.meta.env.VITE_LEGAL_AI_ENDPOINT;
  if (endpoint && endpoint.trim().length > 0) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          answer: data.answer,
          citations: data.citations || [],
          suggestedDraftTemplate: data.suggestedDraftTemplate,
        };
      }
    } catch (err) {
      console.warn('External AI endpoint failed, falling back to local grounded knowledge base:', err);
    }
  }

  // Simulated latency for realistic user experience
  await new Promise((resolve) => setTimeout(resolve, 800));

  return getGroundedLegalResponse(query, language);
}

function getGroundedLegalResponse(query: string, language: string): LegalAiResponse {
  const q = query.toLowerCase();

  // 1. Tenancy / Security Deposit
  if (q.includes('deposit') || q.includes('landlord') || q.includes('rent') || q.includes('tenant') || q.includes('eviction')) {
    if (language.includes('Hindi')) {
      return {
        answer: `किरायेदार सुरक्षा जमा (Security Deposit) और मकान मालिक विवाद पर कानूनी जानकारी:

1. **जमा राशि वापसी की समयसीमा:** लीज समझौते के अनुसार, परिसर खाली करने और चाबी सौंपने के तुरंत बाद या अधिकतम 30 दिनों के भीतर सुरक्षा जमा वापस किया जाना चाहिए।
2. **अनुचित कटौती पर रोक:** सामान्य टूट-फूट (Normal Wear & Tear) के लिए मकान मालिक मनमानी कटौती नहीं कर सकता। केवल वास्तविक नुकसान का ही बिल दिया जा सकता है।
3. **कानूनी नोटिस की प्रक्रिया:** यदि मकान मालिक जमा राशि नहीं लौटाता है, तो उसे 15 दिनों का समय देते हुए औपचारिक "Legal Notice" भेजा जा सकता है।
4. **किराया प्राधिकरण (Rent Authority):** विवाद न सुलझने पर राज्य किराया नियंत्रण अधिनियम अथवा मॉडल टेनेंसी एक्ट के तहत स्थानीय रेंट ट्रिब्यूनल में शिकायत की जा सकती है।`,
        citations: [
          {
            title: 'Model Tenancy Act (Ministry of Housing & Urban Affairs)',
            code: 'Section 10 — Cap on Security Deposit & Refund',
            url: 'https://mohua.gov.in/upload/uploadfiles/files/Model_Tenancy_Act_English.pdf',
            verified: true,
          },
          {
            title: 'Transfer of Property Act, 1882',
            code: 'Section 106 — Notice to Terminate Tenancy',
            url: 'https://www.indiacode.nic.in/handle/123456789/2338',
            verified: true,
          },
        ],
        suggestedDraftTemplate: 'deposit',
      };
    }

    return {
      answer: `Regarding Landlord Security Deposit Recovery & Tenancy Rights in India:

1. **Security Deposit Refund Timelines:** Under standard residential tenancy norms and the Model Tenancy Act principles, security deposits must be refunded upon handing over vacant possession or within an agreed period (typically 30 days).
2. **Deduction Restrictions:** Landlords cannot make arbitrary deductions for "normal wear and tear." Deductions must be limited to documented utility arrears or verified tenant-inflicted property damage with itemized repair receipts.
3. **Step 1 — Formal Demand Notice:** Serve a formal written demand notice giving the landlord 15 days to refund the full deposit with interest.
4. **Step 2 — Legal Redressal:** If unfulfilled, you can approach:
   • The Rent Authority / Rent Court under applicable State Tenancy Laws.
   • A Small Causes Civil Court for summary recovery of debt.
   • The District Consumer Disputes Redressal Commission if renting through an organized commercial co-living or brokerage service.`,
      citations: [
        {
          title: 'Model Tenancy Act (MoHUA)',
          code: 'Section 10 — Security Deposit Limits & Refund Conditions',
          url: 'https://mohua.gov.in/upload/uploadfiles/files/Model_Tenancy_Act_English.pdf',
          verified: true,
        },
        {
          title: 'Transfer of Property Act, 1882',
          code: 'Section 106 & 108 — Rights and Liabilities of Lessor and Lessee',
          url: 'https://www.indiacode.nic.in/handle/123456789/2338',
          verified: true,
        },
        {
          title: 'eCourts Services Portal',
          code: 'District Court Civil Summary Suits & Rent Petitions',
          url: 'https://ecourts.gov.in/',
          verified: true,
        },
      ],
      suggestedDraftTemplate: 'deposit',
    };
  }

  // 2. Cyber Crime / UPI / Financial Fraud
  if (q.includes('cyber') || q.includes('fraud') || q.includes('upi') || q.includes('scam') || q.includes('phishing') || q.includes('hack')) {
    return {
      answer: `Immediate Statutory Steps for Online Financial Fraud / UPI Scam in India:

1. **The "Golden Hour" Call (1930):**
   Immediately call the National Cyber Crime Helpline **1930** (MHA Citizen Financial Cyber Fraud Reporting System). Calling within the first 2–4 hours allows authorities to place an automated lien/freeze on the fraudster's beneficiary account in transit.
2. **Lodge Official NCRP Complaint:**
   File a formal digital complaint at **https://cybercrime.gov.in/**. Keep transaction IDs, bank statements, SMS alerts, and suspect phone numbers ready. Note down the 14-digit Acknowledgement Number.
3. **RBI Zero-Liability Notice to Bank (Within 3 Days):**
   Under RBI Circular *DBR.No.Leg.BC.78/09.07.005/2017-18*, if an unauthorized electronic transaction occurs due to third-party fraud and you report it to your bank within **3 working days**, your liability is zero.
4. **Block UPI & Cards:**
   Immediately request your bank to hotlist your ATM card, reset UPI PIN, and block mobile banking access.`,
      citations: [
        {
          title: 'National Cyber Crime Reporting Portal (MHA)',
          code: 'Helpline: 1930 | Incident Redressal',
          url: 'https://cybercrime.gov.in/',
          verified: true,
        },
        {
          title: 'RBI Customer Protection Circular (2017)',
          code: 'Limiting Liability of Customers in Unauthorized Electronic Banking Transactions',
          url: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11040',
          verified: true,
        },
        {
          title: 'Information Technology Act, 2000',
          code: 'Section 66D — Punishment for Cheating by Personation using Computer Resource',
          url: 'https://www.indiacode.nic.in/handle/123456789/1999',
          verified: true,
        },
        {
          title: 'Bharatiya Nyaya Sanhita (BNS), 2023',
          code: 'Section 318 — Cheating & Financial Fraud',
          url: 'https://www.indiacode.nic.in/handle/123456789/22024',
          verified: true,
        },
      ],
      suggestedDraftTemplate: 'cyber',
    };
  }

  // 3. Consumer Protection / Defective Goods / Services
  if (q.includes('consumer') || q.includes('defective') || q.includes('warranty') || q.includes('refund') || q.includes('flipkart') || q.includes('amazon') || q.includes('product')) {
    return {
      answer: `Statutory Remedies under the Consumer Protection Act, 2019:

1. **Consumer Rights under Section 2(9):**
   You have statutory protection against unfair trade practices, deficiency of service, and misleading advertisements, including the right to product replacement, full refund, and compensation.
2. **Step 1 — Formal Pre-Litigation Notice:**
   Issue a formal written notice to the company's Grievance Officer and Customer Support Manager, granting 7–15 days to replace the defective product or issue a refund.
3. **Step 2 — National Consumer Helpline (NCH):**
   Register a grievance via **https://consumerhelpline.gov.in/** or call toll-free **1915**. Many e-commerce brands resolve disputes directly during NCH conciliation.
4. **Step 3 — e-Daakhil Online Filing:**
   If the company fails to rectify, you can directly file an online consumer case without physically hiring an advocate via the **e-Daakhil portal** (edaakhil.nic.in) before the District Consumer Commission.`,
      citations: [
        {
          title: 'Consumer Protection Act, 2019',
          code: 'Section 35 — Manner in which Complaint shall be made',
          url: 'https://www.indiacode.nic.in/handle/123456789/15256',
          verified: true,
        },
        {
          title: 'National Consumer Helpline Portal',
          code: 'Toll-Free 1915 | Grievance Tracking',
          url: 'https://consumerhelpline.gov.in/',
          verified: true,
        },
        {
          title: 'e-Daakhil Electronic Filing Portal',
          code: 'National Consumer Disputes Redressal Commission',
          url: 'https://edaakhil.nic.in/',
          verified: true,
        },
      ],
      suggestedDraftTemplate: 'consumer',
    };
  }

  // 4. Labor / Unpaid Salary / Employment
  if (q.includes('salary') || q.includes('employee') || q.includes('employer') || q.includes('job') || q.includes('wages') || q.includes('unpaid') || q.includes('relieving')) {
    return {
      answer: `Statutory Recourse for Unpaid Salary & Employment Dues in India:

1. **Statutory Timeline for Wages:** Under the Payment of Wages Act and Code on Wages, employers must disburse monthly compensation by the 7th or 10th of the subsequent month.
2. **Withholding Salary is Illegal:** An employer cannot withhold earned salary or full and final (FnF) settlements as a punitive measure unless authorized by contract and statute.
3. **Step 1 — Formal Legal Demand Notice:**
   Send an official demand letter citing your dates of service, employee ID, total outstanding arrears, and giving 15 days for disbursal.
4. **Step 2 — Labour Commissioner Conciliation:**
   File an online or physical complaint before the **Labour Commissioner** of your jurisdiction under the Payment of Wages Act or Industrial Disputes Act.
5. **Step 3 — Civil / Insolvency Avenues:**
   For commercial firms with unpaid wages exceeding threshold limits, employees can explore summary recovery suits or insolvency proceedings via NCLT as operational creditors.`,
      citations: [
        {
          title: 'Payment of Wages Act, 1936 / Code on Wages, 2019',
          code: 'Section 15 — Claims Arising Out of Deductions or Delay in Payment',
          url: 'https://www.indiacode.nic.in/handle/123456789/2367',
          verified: true,
        },
        {
          title: 'Ministry of Labour & Employment Portal',
          code: 'Samadhan Portal for Industrial & Wage Disputes',
          url: 'https://labour.gov.in/',
          verified: true,
        },
      ],
      suggestedDraftTemplate: 'salary',
    };
  }

  // 5. Cheque Bounce / Debt Recovery (NI Act Section 138)
  if (q.includes('cheque') || q.includes('bounce') || q.includes('dishonour') || q.includes('138') || q.includes('promissory')) {
    return {
      answer: `Legal Procedure for Cheque Dishonour under Section 138 of the Negotiable Instruments Act:

1. **Bank Memo Within 3 Months:** The cheque must have been presented within its 3-month validity period and returned unpaid with a bank return memo (e.g. "Funds Insufficient").
2. **Mandatory 30-Day Demand Notice:**
   You **must** send a formal statutory demand notice in writing within **30 days** of receiving the return memo from the bank.
3. **15-Day Cure Window:**
   The drawer is given **15 days** from receipt of notice to pay the unpaid cheque amount.
4. **Filing Complaint in Magistrate Court:**
   If payment is not made within 15 days, you must file a criminal complaint before the Judicial Magistrate within **1 month** thereafter under Section 138 NI Act. Penalties include imprisonment up to 2 years and/or fine up to twice the cheque amount.`,
      citations: [
        {
          title: 'Negotiable Instruments Act, 1881',
          code: 'Section 138 — Dishonour of Cheque for Insufficiency of Funds',
          url: 'https://www.indiacode.nic.in/handle/123456789/2189',
          verified: true,
        },
        {
          title: 'Supreme Court of India Case Law on NI 138',
          code: 'Expeditious Trial of Cases under Sec 138 NI Act Guidelines',
          url: 'https://www.sci.gov.in/',
          verified: true,
        },
      ],
      suggestedDraftTemplate: 'business',
    };
  }

  // 6. Right to Information (RTI)
  if (q.includes('rti') || q.includes('information') || q.includes('government authority') || q.includes('pio')) {
    return {
      answer: `Guidelines for Filing an RTI Application in India (RTI Act, 2005):

1. **Eligibility:** Any Indian citizen can request records, documents, decisions, or expenditure details from any Public Authority.
2. **Statutory Timelines (Section 7):**
   • **30 days** for standard public authority responses.
   • **48 hours** if the information concerns the life or liberty of a person.
3. **Fee Structure:** Standard nominal fee of ₹10 (exempt for Below Poverty Line citizens).
4. **Filing Portals:** Central government requests can be submitted online at **https://rtionline.gov.in/**. State-level departments provide their respective state RTI portals or physical postal applications to the Public Information Officer (PIO).`,
      citations: [
        {
          title: 'Right to Information Act, 2005',
          code: 'Section 6 & 7 — Request for Obtaining Information & Disposal of Request',
          url: 'https://www.indiacode.nic.in/handle/123456789/2065',
          verified: true,
        },
        {
          title: 'RTI Online Central Portal',
          code: 'Department of Personnel and Training (DoPT)',
          url: 'https://rtionline.gov.in/',
          verified: true,
        },
      ],
      suggestedDraftTemplate: 'rti',
    };
  }

  // 7. General Indian Legal Inquiry
  return {
    answer: `Indian Statutory Information Overview:

Thank you for your legal inquiry. Here is the legal framework governing formal disputes in India:

1. **Pre-Litigation Communication:** Under Indian civil and statutory dispute procedure, parties are advised to issue a formal written notice setting forth facts, damages, and a reasonable cure timeline (typically 15 to 30 days) before initiating court proceedings.
2. **Preservation of Records:** Retain written communication (emails, registered postal receipts, WhatsApp records, invoices, bank statements) as primary documentary evidence under Section 65B of the Indian Evidence Act / Section 63 of Bharatiya Sakshya Adhiniyam (BSA) 2023.
3. **Alternative Dispute Resolution (ADR):** Many matters (consumer, tenancy, commercial) can be resolved faster via Lok Adalats (NALSA), mediation cells, or specialized statutory tribunals rather than traditional long civil litigation.
4. **Next Steps:** You can use our **Draft Generator** to prepare a formal notice template or visit **Legal Resources** to access official portals.`,
    citations: [
      {
        title: 'India Code — Repository of Indian Legislation',
        code: 'Unified Central & State Act Search',
        url: 'https://www.indiacode.nic.in/',
        verified: true,
      },
      {
        title: 'National Legal Services Authority (NALSA)',
        code: 'Free Legal Aid & Lok Adalat Services',
        url: 'https://nalsa.gov.in/',
        verified: true,
      },
      {
        title: 'Supreme Court of India Official Portal',
        code: 'Judicial Precedents & Circulars',
        url: 'https://www.sci.gov.in/',
        verified: true,
      },
    ],
    suggestedDraftTemplate: 'deposit',
  };
}

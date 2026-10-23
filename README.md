# NyayaMate AI — Indian Legal Information Companion 🇮🇳⚖️

> **Educational Legal Information Companion for Indian Citizens, Tenants, Students & Small Businesses**  
> Grounded in the **Bharatiya Nyaya Sanhita (BNS) 2023**, **Consumer Protection Act 2019**, **Information Technology Act**, and verified official Indian court portals.

---

## 🌟 Key Features

1. **AI Legal Assistant (Chat Interface)**:
   - Natural language legal queries in **English, Hindi (हिंदी), and Kannada (ಕನ್ನಡ)**.
   - Grounded statutory answers with verified citations directly to primary sources (**India Code, Supreme Court, eCourts, NALSA, Cyber Crime Portal**).
   - Real-time conversation persistence with Supabase PostgreSQL and local session backup.
   - Interactive citation cards, copy-to-clipboard, bookmarks, and user feedback.

2. **My Conversations Manager**:
   - Manage historical consultations with title search, inline renaming, and safe deletion with Supabase cascade.

3. **Document Assistant**:
   - Drag & drop contract & agreement analyzer (PDF, DOCX, TXT up to 10MB).
   - Client-side clause extraction (security deposit refund timeline, notice period, rent escalation).
   - Identifies one-sided terms and legal risk flags (e.g. arbitrary painting deductions, unbounded indemnity).
   - One-click export of analysis summaries as formatted text documents.

4. **Legal Draft Generator**:
   - Dynamic notice generator with 6 pre-litigation templates:
     - **Security Deposit Refund Demand Notice** (Tenancy)
     - **Consumer Complaint Notice** (Defective Goods/Services under CPA 2019)
     - **Unpaid Salary Demand Letter** (Payment of Wages Act)
     - **Overdue Commercial Invoice Demand** (MSME / B2B)
     - **Cyber Fraud Zero-Liability Bank Dispute** (RBI 2017 Guidelines)
     - **Right to Information (RTI) Application** (Section 6(1) RTI Act 2005)
   - Live real-time draft generation with dynamic fields, copy-to-clipboard, .txt download, and Supabase cloud saving.

5. **Official Legal Resources Catalog**:
   - Curated directory of official Government of India (.gov.in / .nic.in) portals:
     - India Code, Supreme Court of India, eCourts Services, NALSA (Free Legal Aid), National Cyber Crime Reporting Portal (1930), National Consumer Helpline (1915), e-Daakhil, MCA21, and RTI Online.

6. **Saved Items**:
   - Bookmarking system for answers, legal drafts, official portals, and conversations.

7. **Settings & Supabase Cloud Manager**:
   - In-app Supabase connection configuration: input Project URL & Anon Key with **Live Latency & Connection Tester**.
   - Language selector, Dark/Light theme toggle, statutory citations toggle, and local session reset.

---

## 🏗️ Architecture & Tech Stack

```
Browser (React 19 + TypeScript + Vite + Tailwind CSS v4)
                    |
                    +---> Local Storage Fallback (Immediate Offline Mode)
                    |
                    v
          Supabase Backend (PostgreSQL)
          +-- public.conversations (User consultation threads)
          +-- public.messages      (Chat history + citations jsonb)
          +-- public.saved_items   (Bookmarks & resources)
          +-- public.drafts        (Generated legal notices)
          +-- public.documents     (Document summaries & clause flags)
          +-- Row Level Security   (Data isolation & privacy)
```

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React
- **Backend / Database**: Supabase (PostgreSQL, Realtime, Auth, Storage)
- **Offline / Hybrid Mode**: Works out of the box on `localhost` even without Supabase credentials! When credentials are provided, seamlessly switches to Supabase.

---

## 🚀 Quickstart — Running on Localhost

### Prerequisites
- **Node.js** (v18+ or v20+)
- **npm** (v9+ or v11+)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shaheenmi786/NyayaMate-AI.git
cd NyayaMate-AI
npm install
```

### 2. Environment Variables (Optional)
Copy the example environment file:
```bash
cp .env.example .env
```
Edit `.env` with your Supabase credentials (or enter them directly in the app via **Settings & Database**):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
*(Note: If left empty or placeholder, the app gracefully operates in Local Mode with zero errors!)*

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🗄️ Supabase Backend Setup

To connect your Supabase database:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository and run the entire script. It automatically:
   - Enables `uuid-ossp`
   - Creates `conversations`, `messages`, `saved_items`, `drafts`, and `documents` tables
   - Sets up indexes and `updated_at` triggers
   - Configures Row Level Security (RLS)
   - Seeds initial verified Indian legal resources
4. Retrieve your **Project URL** and **anon public key** from **Project Settings → API**.
5. Paste them in `.env` or open **NyayaMate AI → Settings** and click **Save & Connect**.

---

## 📤 Pushing Code to GitHub

```bash
# Check git status
git status

# Stage all files
git add .

# Commit changes
git commit -m "feat: complete end-to-end NyayaMate AI frontend with Supabase integration"

# Push to your GitHub repository
git push origin main
```

---

## ⚖️ Legal Safety & DPDP Compliance

- **No Legal Representation**: In compliance with the Advocates Act 1961, NyayaMate AI provides educational legal information and does not provide legal representation.
- **Source Verification**: All statutory sections reference verified legislation from India Code, Ministry notifications, or judicial rulings.
- **DPDP Act 2023 Compliance**: Session data is kept strictly within the user's controlled storage or isolated Supabase project.

---

## 📄 License
MIT License. Built for Indian citizens, researchers, and public legal literacy.

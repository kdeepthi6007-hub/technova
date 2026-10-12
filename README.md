# Farm2Pay AI — Complete AI-Powered Farmer Financial & Marketplace Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Automated Tests](https://img.shields.io/badge/tests-10%2F10%20passing-brightgreen)]()
[![Language Support](https://img.shields.io/badge/languages-English%20%7C%20%E0%AE%A4%E0%AE%AE%E0%AE%BF%E0%AE%B4%E0%AF%8D-blue)]()
[![Fintech Integrity](https://img.shields.io/badge/loan%20math-exact%20amortization-emerald)]()

**Farm2Pay AI** is a complete, responsive, agricultural fintech and marketplace web application designed for smallholder and marginal farmers in India. It bridges the critical gaps farmers face when selling produce, hiring machinery, managing seasonal farm bookkeeping, and navigating confusing agricultural loan contracts.

---

## 🌟 Key Problem Solved & Core Value Proposition

1. **Unfair Crop Prices & Mandi Opacity**: Middlemen quote inflated prices but subtract heavy hidden freight and APMC deductions at delivery. **Farm2Pay AI** introduces automated **Net Proceeds Calculation**:
   $$\text{Net Proceeds} = \text{Crop Value} - \text{Transport Costs} - \text{Disclosed APMC/Mandi Charges}$$
2. **Machinery Inaccessibility**: Small farmers cannot afford tractors and harvesters. The **Equipment Hub** offers hourly and daily custom-hiring with transparent operator fees and refundable deposits.
3. **Fragmented Bookkeeping**: Farmers lose track of seasonal input expenses (seeds, fertilizers, labour). **Farm2Pay AI** calculates real-time **Net Operating Profit**, **Profit Margin %**, and sounds **Budget Overrun Alarms**.
4. **Predatory & Opaque Loans**: Farmers are misled by low monthly EMIs that hide long tenures, high upfront deductions (>3.5%), and floating interest rates. The **Loan Comparison Engine** audits loans using standard reducing-balance amortization and reveals the true **Net Disbursed Amount** credited to the bank.

---

## 🏗️ The 4 Core Integrated Modules

### Module 1: Crop & Equipment Marketplace
- **Crop Marketplace**: Create, edit, filter, and view crop listings (e.g. Samba Paddy CO-51, TMV-7 Groundnut, Turmeric). Filter by Organic certification, Mandi Grade (Grade A, B, C), harvest dates, and location.
- **Multi-Buyer Offer Comparison**: Side-by-side bid comparison displaying gross crop value, transport deduction, market cess, and true net proceeds per quintal.
- **Equipment Hub**: Buy or Rent tractors, rotavators, solar pumps, and combine harvesters. Live rental cost calculator:
  $$\text{Rental Cost} = (\text{Rate} \times \text{Duration}) + \text{Disclosed Operator/Delivery Fees}$$

### Module 2: Smart Farm Expense Tracker
- **Ledger**: Record farm sales and 11 distinct expense categories (Seeds, Fertilizers, Bio-control, Labour, Irrigation, Fuel, Equipment, Loan Service).
- **Financial Analytics**: Automated calculations for Total Income, Total Expenses, Net Profit, and Profit Margin %.
- **Budget Alarms**: Seasonal budget limits with warning thresholds (80%) and over-budget alerts.
- **Data Export**: One-click CSV exports for bank loan audits.

### Module 3: AI Loan Comparison Assistant
- **Exact EMI Engine**: Fully amortizing standard formula:
  $$\text{EMI} = P \times r \times \frac{(1 + r)^n}{(1 + r)^n - 1}$$
  with safe handling for 0% interest subvention loans ($\text{EMI} = P / n$).
- **Transparency Metrics**:
  - **Net Disbursed Amount** = $\text{Principal} - \text{Upfront Fees & Insurance}$
  - **Total Borrowing Cost** = $\text{Total Interest} + \text{All Fees}$
- **Automated Risk Flags**: Automatically flags unverified private lenders, floating-rate risks, high upfront deductions (>3%), and harsh late penalties.
- **9 Essential Terms Guide**: Plain-language definitions for Principal, EMI, Moratorium, Collateral, Foreclosure fees, etc.

### Module 4: Unified Dashboard & AI Farm Assistant
- **Executive Dashboard**: Real-time KPI cards synced with the active ledger, monthly cash flow charts, category distribution pies, and pending buyer bids.
- **AI Farm Assistant**: Grounded, contextual bilingual assistant (English & Tamil) answering farmer inquiries based on actual recorded transactions, crop bids, and loan entries.

---

## 👥 1-Click Demo Personas (Role Switching)

Switch perspectives in 1 click from the header or settings menu:
- **🌾 Ramesh Kannan (Farmer)**: 6.5-acre paddy farmer in Thiruvaiyaru, Thanjavur.
- **🏢 Senthil Kumar (Buyer)**: Kaveri Agro Mills procurement manager in Tiruchirappalli Mandi.
- **🚜 Murugan K (Machinery Owner)**: Custom Hire Center owner in Papanasam.
- **🛡️ Platform Administrator**: System governance and verification status management.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite 8.
- **Styling**: Tailwind CSS with an agricultural theme (forest green, warm cream, earthy tones).
- **Icons**: Lucide React.
- **Data Visualization**: Recharts (Bar Charts, Pie Charts).
- **Testing**: Vitest automated test suite.
- **Persistence**: Browser-backed local demo store with seed data, persistent state synchronization, and instant "Reset Demo Store" capability.
- **Internationalization**: Full bilingual support for **English** and **Tamil (தமிழ்)**, extensible to Telugu.

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- Node.js (v18 or higher; tested on Node.js v24)
- npm (v9 or higher)

### 2. Installation
```bash
git clone <repository-url>
cd Farm2Pay-AI
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open **[http://127.0.0.1:5173/](http://127.0.0.1:5173/)** in your web browser.

### 4. Run Automated Test Suite
```bash
npm run test
```
Runs 10 automated unit tests verifying the amortizing EMI formula, zero-interest calculations, net crop proceeds, equipment rental costs, and budget threshold alarms.

### 5. Production Build
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory.

---

## 🧪 Automated Test Coverage Summary

| Test Case | Module | Formula / Verification | Status |
|:---|:---|:---|:---:|
| Standard Positive Interest EMI | Loan Engine | $P=100,000, r=12\%, n=12 \implies \text{EMI} = ₹8,884.88$ | ✅ PASSED |
| 7% KCC Production Credit EMI | Loan Engine | $P=200,000, r=7\%, n=24 \implies \text{EMI} \approx ₹8,954$ | ✅ PASSED |
| Zero-Interest Scheme EMI | Loan Engine | $P=60,000, r=0\%, n=6 \implies \text{EMI} = ₹10,000$ | ✅ PASSED |
| Invalid / Zero Tenure Safety | Loan Engine | Tenure $\le 0 \implies \text{Safe } 0$ (No division by zero) | ✅ PASSED |
| Net Disbursed & Total Borrowing Cost | Loan Engine | $\text{Principal} - \text{Upfront Deductions}$ | ✅ PASSED |
| Crop Net Proceeds Calculation | Marketplace | $\text{Gross Value} - \text{Transport} - \text{APMC Cess}$ | ✅ PASSED |
| Equipment Rental Calculation | Machinery Hub | $(\text{Rate} \times \text{Duration}) + \text{Operator Fee}$ | ✅ PASSED |
| Financial Summaries & Profit Margins | Accounting | $\text{Income} - \text{Expense}$ & Operating Margin % | ✅ PASSED |
| Monthly Cash Flow Grouping | Accounting | Aggregation without double counting | ✅ PASSED |
| Budget Overrun & Warning Thresholds | Accounting | 80% warning triggers & exceeded flags | ✅ PASSED |

---

## ⚖️ Simulation & Integrity Disclosure

- **Demo Prototype Notice**: All transactions, buyer offers, and bank offers are simulated using realistic Indian agricultural context (Thanjavur delta region, KCC loans, APMC mandi cess). 
- **No False Assurances**: Simulated payments or bank disbursements are never misrepresented as real bank transfers.
- **Privacy**: No personal banking credentials or passwords are collected.

---

## 📄 License
MIT License. Built for the Agricultural Hackathon to empower Indian farmers with financial transparency.

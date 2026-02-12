# Expense Tracker

## Description
Business expense management with EU VAT compliance, automated categorization, and intelligent receipt processing. Built for Belgian accounting standards and Ollama cloud-powered analysis.

## Installation

```bash
pip install pandas ollama sqlite3 pillow qrcode
```

## Configuration

Add to `.env`:
```bash
OLLAMA_CLOUD_URL=https://api.cloud.ollama.com/v1
OLLAMA_CLOUD_API_KEY=your-api-key
EXPENSE_MODEL=llama3-70b-instruct
DATABASE=expenses.db
VAT_RATE=21.0
CURRENCY=EUR
COMPANY_TYPE=bvba
```

## Usage

### Add expense
```bash
expense-tracker add \
  --amount 245.50 \
  --description "Business dinner with client" \
  --category meals-entertainment \
  --vat 21 \
  --receipt scan1.pdf \
  --client Acme-NV
```

### Weekly report
```bash
expense-tracker weekly \
  --week 2024-04 \
  --summary \
  --by-category \
  --export weekly_report.xlsx
```

### VAT reclaim preparation
```bash
expense-tracker vat-reclaim \
  --quarter Q1-2024 \
  --eligible-only \
  --validate-receipts \
  --output vat_reclaim_q1.json
```

### Analyze spending patterns
```bash
expense-tracker analyze \
  --period 6m \
  --identify-anomalies \
  --trend-analysis \
  --output analysis.pdf
```

### Receipt scanning
```bash
expense-tracker scan \
  receipt.jpg \
  --auto-extract \
  --smart-categorize \
  --ocr-language nl \
  --confidence-threshold 0.8
```

### Company car expenses
```bash
expense-tracker car \
  --fuel 67.45 \
  --distance 450 \
  --purpose business \
  --receipt fuel_receipt.pdf \
  --co2-category B
```

## Features

- **VAT compliance**: Belgian VAT rules (standard 21%, reduced 12%/6%)
- **Receipt scanning**: OCR for paper receipts and invoices
- **AI categorization**: Automatic expense classification
- **Multi-currency**: EUR, USD, GBP, CHF with FX rates
- **Approval workflow**: Multi-level approval chains
- **Per diems**: Belgian per diem rates for business travel
- **Car expenses**: Complete car cost tracking with CO2 brackets
- **Business miles**: Mileage reimbursement tracking
- **Compliance checks**: Deductibility validation
- **Export**: Exact Online, CSV, Excel, PDF
- **Budget alerts**: Real-time spending alerts
- **Fraud detection**: AI-powered anomaly detection

## Expense Categories (Belgian)

### Fully Deductible (100%)
- Professional fees (accountant, lawyer)
- Office rent and utilities
- Insurance premiums
- Advertising and marketing
- Business travel (hotels, flights)

### Partially Deductible
- **Car expenses**: Based on CO2 emissions bracket
  - A (0-79g): 100% deductible
  - B (80-99g): 90% deductible
  - C (100-119g): 80% deductible
  - D (120-139g): 70% deductible
  - E (140-159g): 60% deductible
  - F (160+): 50% deductible
- **Restaurant meals**: 69% deductible (31% considered private)
- **Representation**: 50% deductible (lunches with clients, gifts)

### Non-Deductible
- Personal expenses
- Fines and penalties
- Private portion (car private use must be tracked)

## Belgian Per Diem Rates

### Domestic (Belgium)
- **Full day**: €23.50
- **Half day (4-8h)**: €11.75
- **Less than 4h**: €0

### International (examples)
- **Netherlands**: €61/day
- **France**: €66/day
- **Germany**: €48/day
- **UK**: €62/day
- **US**: varies by city

### Conditions
- Must be away from usual workplace
- Must substantiate business purpose
- No free meals provided
- For >30 days, rates may change

## Car Expenses Breakdown

### Fuel
- Gasoline/diesel receipts
- Must track business vs private use
- CO2 category determines deductibility

### Maintenance & Repairs
- Regular service
- Repairs from accidents
- Tires, oil changes

### Insurance
- Liability insurance (BA)
- Comprehensive coverage
- Legal protection

### Other Costs
- Road tax (belastingen)
- Interest on car loan (if applicable)
- Parking and tolls

## Examples

### Quick Expense Entry
```bash
expense-tracker quick \
  45.80 \
  --description "Parking at Brussels Expo" \
  --business-trip EUBUSINESS2024
```

Auto-categorizes as "Travel - Parking" and validates receipt requirement.

### Monthly Analysis
```bash
expense-tracker monthly \
  --month 2024-03 \
  --compare 2024-02 \
  --trends \
  --top-vendors \
  --identify-savings \
  --export march_analysis.xlsx
```

Shows: Total €4,850 (+12% vs Feb), Top vendor: Acme NV (€1,245), Potential savings: €340

### Travel Day (Multiple Expenses)
```bash
expense-tracker travel-day \
  --trip-id AMS-BRU-20240115 \
  --destination Brussels \
  --add-transaction 87.50 "Hotel Brussels" hotels-and-lodging 6 \
  --add-transaction 23.60 "Dinner" meals 21 \
  --add-transaction 15.00 "Taxi to meeting" transport-land \
  --daily-summary
```

Creates travel bundle with automatic per diem validation.

### Receipt Validation
```bash
expense-tracker validate-receipts \
  --year 2024 \
  --check-required-fields \
  --flag-missing-vat \
  --suggest-corrections \
  --output validation_report.json
```

Checks each receipt for: required fields, VAT validity, amount consistency, date validity.

### Budget Monitoring
```bash
expense-tracker budget \
  --category marketing \
  --limit 5000 \
  --alert-at 80 \
  --month 2024-04 \
  --track-daily
```

Monitors spending vs. budget with real-time alerts.

### VAT Reclaim Summary
```bash
expense-tracker vat-summary \
  --quarter Q2-2024 \
  --eligible-vat \
  --by-vat-rate \
  --export belcotax-format \
  --accountant-copy
```

Generates:
- Total VAT paid: €3,245.60
- Eligible for reclaim: €2,890.30
- By rate: 21%: €2,340.50 | 12%: €549.80 | 6%: €0

## Integration with OpenClaw

All commands registered as tools:
- `expense-tracker add`
- `expense-tracker weekly`
- `expense-tracker vat-reclaim`
- `expense-tracker analyze`
- `expense-tracker scan`
- `expense-tracker car`
- `expense-tracker quick`
- `expense-tracker monthly`
- `expense-tracker travel-day`
- `expense-tracker validate-receipts`
- `expense-tracker budget`
- `expense-tracker vat-summary`

## Model Recommendations

- **llama3-70b-instruct**: Best for expense categorization and anomaly detection
- **mistral-large**: Excellent for OCR and receipt text extraction
- **mixtral-8x22b**: Superior for spending pattern analysis

All models optimized for Belgian accounting rules and multilingual receipt processing.
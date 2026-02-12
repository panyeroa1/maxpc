# Invoice Processor

## Description
Automated PDF invoice and receipt processing with VAT tracking, optical character recognition, and integration with Belgian accounting systems. Uses Ollama cloud for intelligent data extraction and categorization.

## Installation

```bash
pip install pytesseract pdf2image pillow ollama pandas
```

## Configuration

Add to `.env`:
```bash
OLLAMA_CLOUD_URL=https://api.cloud.ollama.com/v1
OLLAMA_CLOUD_API_KEY=your-api-key
OCR_LANGUAGE=eng+nld+fra
INVOICE_MODEL=llama3-70b-instruct
VAT_DEFAULT=21.0  # Belgium standard VAT
ACCOUNTING_INTEGRATION=exactonline  # or off
```

## Usage

### Process single invoice
```bash
invoice-processor extract \
  invoice.pdf \
  --output-format json \
  --extract-line-items \
  --calculate-vat \
  --categorize-expenses
```

### Batch process invoices
```bash
invoice-processor batch \
  invoices/*.pdf \
  --output-dir ./processed/ \
  --create-archive \
  --summary-report
```

### Upload to accounting system
```bash
invoice-processor upload \
  processed_invoices.json \
  --target exactonline \
  --account your-account \
  --auto-match-vendors \
  --await-approval
```

### VAT validation
```bash
invoice-processor validate-vat \
  invoice_scanned.pdf \
  --check-vat-number \
  --cross-reference-belgian-database \
  --verify-vat-calculations
```

### Expense categorization
```bash
invoice-processor categorize \
  receipts/ \
  --use-ai-categorization \
  --business-rules your_rules.json \
  --output expenses_by_category.xlsx
```

### Generate payment reminder
```bash
invoice-processor reminder \
  --invoice-number INV-2024-001 \
  --due-date 2024-02-15 \
  --days-overdue 15 \
  --client "Acme NV" \
  --language nl \
  --output reminder.pdf
```

## Features

- **OCR**: Extract text from scanned PDFs and images
- **VAT handling**: Belgian standard (21%), reduced (6%, 12%), and exempt
- **Multi-language**: Dutch, French, German invoice recognition
- **AI categorization**: Automatic expense categorization
- **Validation**: VAT number verification, calculation checks
- **Accounting integration**: Exact Online, Yuki, Accountview, Octopus
- **Belcotax**: Generate Belcotax declarations
- **Batch processing**: Process hundreds of invoices
- **Audit trail**: Detailed logging and compliance tracking
- **Currency conversion**: Multi-currency support for international invoices

## Belgian Invoice Requirements

### Mandatory Elements
- **Date**: Invoice date and, if different, supply date
- **Number**: Sequential invoice number
- **VAT number**: Your Belgian VAT number (BE 0123.456.789)
- **Client VAT**: Customer VAT number (if applicable)
- **Description**: Clear description of goods/services
- **Amounts**: Unit prices, quantities, discounts, VAT

### VAT Rules
- **Standard**: 21% (most goods and services)
- **Reduced**: 12% (restaurant, food products, social housing)
- **Reduced**: 6% (essential food, books, water)
- **Exempt**: Export outside EU, intra-community supplies (0%)

### Language
- Can issue in Dutch, French, or German based on customer preference
- Keep copies for 7 years (Belgian requirement)

## Expense Categories (Belgian Accounting)

### Overheads
- Office supplies
- Communication (phone, internet)
- Professional fees
- Insurance
- Marketing and advertising

### Car & Travel
- Fuel and maintenance
- Public transport
- Hotels and meals (travel)
- Parking

### IT & Technology
- Hardware
- Software licenses
- Cloud services
- IT support

### Staff
- Salaries and benefits
- Training
- Recruitment
- Team building

## Examples

### Quick Invoice Processing
```bash
invoice-processor quick \
  scan_20240115.pdf \
  --language nl \
  --recognize-belgian-vat \
  --categorize \
  --output summary.txt
```

Extracts: Invoice number, date, amounts, VAT, and categorizes expense automatically.

### Monthly Processing Batch
```bash
invoice-processor monthly-batch \
  2024/01/*.pdf \
  --create-quicksnap \
  --generate-vat-summary \
  --upload-to-accounting \
  --notify-accountant
```

Creates summary: Total €45,320.50 | VAT €7,912.50 | Net €37,408.00
Categorizes by: IT (€12,000), Travel (€8,500), Marketing (€24,820.50)

### Vendor Recognition
```bash
invoice-processor vendor \
  --learn-folder training_invoices/ \
  --build-vendor-database \
  --vendor-mapping vendors.json
```

Learns to recognize vendors automatically and maps to correct accounts.

### Quarterly VAT Check
```bash
invoice-processor quarterly-vat \
  --quarter Q4-2024 \
  --validate-all-vat-numbers \
  --check-calculations \
  --identify-issues \
  --output-vat_issues.json
```

### Receipt Scanner on Mobile
```bash
invoice-processor mobile-scan \
  --image receipt.jpg \
  --gps-location \
  --currency-auto-detect \
  --expense-category auto \
  --append-to "Weekly Expenses"
```

## Integration with OpenClaw

All commands registered as tools:
- `invoice-processor extract`
- `invoice-processor batch`
- `invoice-processor upload`
- `invoice-processor validate-vat`
- `invoice-processor categorize`
- `invoice-processor reminder`
- `invoice-processor quick`
- `invoice-processor monthly-batch`
- `invoice-processor vendor`
- `invoice-processor quarterly-vat`
- `invoice-processor mobile-scan`

## Model Recommendations

- **llama3-70b-instruct**: Best for document structure recognition and data extraction
- **mistral-large**: Excellent for multi-language invoice processing
- **mixtral-8x22b**: Superior for complex invoice categorization and anomaly detection

All models optimized for European invoice formats and multilingual business documents.
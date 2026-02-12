# Financial Analyzer

## Description
Multi-currency financial analysis, market trends, and investment insights optimized for Belgian and EU businesses. Leverages Ollama cloud models for intelligent financial analysis and anomaly detection.

## Installation

```bash
pip install pandas yfinance currencyconverter ollama
```

## Configuration

Add to `.env`:
```bash
OLLAMA_CLOUD_URL=https://api.cloud.ollama.com/v1
OLLAMA_CLOUD_API_KEY=your-api-key
FINANCIAL_MODEL=llama3-70b-instruct
ALTERNATIVE_MODEL=mistral-large
DEFAULT_CURRENCIES=EUR,USD,GBP,CHF
VAT_RATE=21.0  # Belgium standard VAT
```

## Usage

### Analyze financial statements
```bash
financial-analyzer analyze \
  financial_statement_2023.xlsx \
  --report-type profit-loss \
  --compare-year 2022 \
  --output analysis_report.md
```

### Convert currency with business rates
```bash
financial-analyzer currency \
  --amount 100000 \
  --from EUR \
  --to USD \
  --apply-fx-markup 0.5
```

### Track exchange rates
```bash
financial-analyzer fx-track \
  --base EUR \
  --targets USD,GBP,CHF \
  --alert-threshold 0.02 \
  --monitor
```

### Calculate VAT
```bash
financial-analyzer vat \
  --amount 5000 \
  --vat-rate 21 \
  --type inclusive
```

### Market trend analysis
```bash
financial-analyzer market \
  --ticker "EUMV.DE" \
  --period 1y \
  --analyze-volatility \
  --output chart.png
```

### Portfolio analysis
```bash
financial-analyzer portfolio \
  portfolio.csv \
  --base-currency EUR \
  --risk-profile moderate \
  --rebalancing-strategy quarterly
```

### Invoice validation
```bash
financial-analyzer validate-invoice \
  invoice.pdf \
  --check-vat-compliance \
  --detect-anomalies \
  --currency-check EUR
```

## Features

- **Multi-currency support**: EUR, USD, GBP, CHF and 150+ currencies
- **VAT calculations**: Belgian standard (21%) and reduced rates (6%, 12%)
- **Real-time FX rates**: ECB, Yahoo Finance, and commercial rates
- **FX markup**: Apply business FX margins automatically
- **Anomaly detection**: AI-powered fraud and error detection
- **Trend analysis**: Historical data and forecast modeling
- **EU market focus**: Euronext Brussels, Amsterdam, Paris stocks
- **Report generation**: PDF, Excel, Markdown formats

## Belgian Business Focus

### VAT Rates
- **Standard**: 21% (most goods and services)
- **Reduced**: 12% (food, water, certain services)
- **Reduced**: 6% (essential goods, books)

### Business Types
- **SME focus**: Optimized for BVBA/SPRL-S, NV, SC
- **International trade**: Import/export calculations
- **Intrastat reporting**: EU trade statistics support
- **VAT MOSS**: Digital services VAT for EU

### Currency Pairs (Common in Belgium)
- EUR/USD (trade with US)
- EUR/CHF (trade with Switzerland)
- EUR/GBP (trade with UK)
- EUR/CNY (growing China trade)

### Examples

#### Quick Profit/Loss Analysis
```bash
financial-analyzer quick-analyze \
  --month 2024-01 \
  --revenue 250000 \
  --expenses 180000 \
  --currency EUR \
  --tax-rate 25.5
```

Output includes gross profit, net profit, margin percentage, and tax projections.

#### Invoice with VAT
```bash
financial-analyzer create-invoice \
  --amount 10000 \
  --vat-rate 21 \
  --vat-type exclusive \
  --description "Consulting services" \
  --client "Acme NV"
```

Creates invoice with: Subtotal €10,000 + VAT €2,100 = Total €12,100

#### FX Trend Alert
```bash
financial-analyzer fx-alerts \
  --pair EUR/USD \
  --alert-on 1.10 \
  --direction below \
  --notify
```

Monitors exchange rate and alerts when EUR/USD drops below 1.10

#### Portfolio Rebalancing
```bash
financial-analyzer rebalance \
  --target-allocation \
    "European_equities:40" \
    "US_equities:30" \
    "Bonds:20" \
    "Cash:10" \
  --current-portfolio portfolio.json \
  --base-currency EUR \
  --tax-efficiency
```

Provides rebalancing recommendations optimized for Belgian tax treatment.

## Integration with OpenClaw

All commands registered as tools:
- `financial-analyzer analyze`
- `financial-analyzer currency`
- `financial-analyzer fx-track`
- `financial-analyzer vat`
- `financial-analyzer market`
- `financial-analyzer portfolio`
- `financial-analyzer validate-invoice`
- `financial-analyzer quick-analyze`
- `financial-analyzer create-invoice`
- `financial-analyzer fx-alerts`
- `financial-analyzer rebalance`

## Model Recommendations

- **llama3-70b-instruct**: Best for numerical analysis and financial calculations
- **mistral-large**: Excellent for market trend interpretation
- **mixtral-8x22b**: Most accurate for complex financial modeling

All models are optimized for EU financial regulations and accounting standards (BAS/BE GAAP).
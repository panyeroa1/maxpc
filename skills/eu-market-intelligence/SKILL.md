# EU Market Intelligence

## Description
Competitor analysis, market research, and business intelligence tools optimized for Belgian and EU markets. Uses Ollama cloud models for intelligent market analysis and trend identification.

## Installation

```bash
pip install requests beautifulsoup4 pandas ollama
```

## Configuration

Add to `.env`:
```bash
OLLAMA_CLOUD_URL=https://api.cloud.ollama.com/v1
OLLAMA_CLOUD_API_KEY=your-api-key
INTELLIGENCE_MODEL=mistral-large
ANALYSIS_MODEL=llama3-70b-instruct
DEFAULT_REGION=EU
FOCUS_COUNTRIES=BE,NL,FR,DE
DEFAULT_LANGUAGE=auto  # Auto-detects from sources
```

## Usage

### Competitor analysis
```bash
eu-market-intelligence analyze-competitor \
  --company "Acme NV" \
  --website https://acme.be \
  --social-linkedin acme-nv \
  --output competitor_profile.json
```

### Market trend analysis
```bash
eu-market-intelligence trend \
  --keyword "sustainable packaging" \
  --region EU \
  --timeframe 12m \
  --output trend_report.pdf
```

### Industry news monitoring
```bash
eu-market-intelligence monitor \
  --industry "renewable energy" \
  --countries BE,FR,NL \
  --sources "euronews,demorgen,lesoir" \
  --alert-new-competitor \
  --frequency daily
```

### Pricing intelligence
```bash
eu-market-intelligence prices \
  --product "industrial automation sensors" \
  --competitors "companyA,companyB,companyC" \
  --output pricing_matrix.xlsx
```

### Lead generation
```bash
eu-market-intelligence generate-leads \
  --sector manufacturing \
  --location Belgium \
  --company-size "10-50 employees" \
  --output leads.csv
```

## Features

- **Multi-country focus**: Belgium, Netherlands, France, Germany, Luxembourg
- **EU market data**: Euronext listings, EU statistical data
- **Competitor tracking**: Website changes, news mentions, job postings
- **Industry analysis**: Sector-specific intelligence
- **News monitoring**: Customized news feeds
- **Social monitoring**: LinkedIn, X (Twitter) company tracking
- **Pricing intelligence**: Automated price tracking
- **Lead generation**: Find potential customers/partners
- **Report generation**: PDF, Excel, PPT exports

## Belgian Market Focus

### Regional Industries
- **Flanders**: Chemicals, automotive, logistics (Antwerp port)
- **Wallonia**: Glass, steel, aerospace, biotech
- **Brussels**: EU institutions, finance, services

### Data Sources
- **Official**: StatBel, NBB (National Bank of Belgium), EUROSTAT
- **Business**: Beci, Voka, UWE
- **News**: De Tijd, L'Echo, De Standaard, Le Soir, Der Standard
- **Financial**: Euronext Brussels, companies house data

### Language Support
- Dutch (Flemish business media)
- French (Belgian and French sources)
- German (German-speaking region and Germany)
- English (international sources)

## Examples

### Quick Belgian Market Overview
```bash
eu-market-intelligence overview \
  --sector "food processing" \
  --focus Belgium \
  --include-competitors 5 \
  --market-size-estimate \
  --output market_overview_be.md
```

Output includes market size, key players, recent trends, growth projections, and regulatory landscape.

### Competitor Monitoring Setup
```bash
eu-market-intelligence setup-monitor \
  --competitors "competitor1.be,competitor2.nl,competitor3.fr" \
  --track website_changes \
  --track job_postings \
  --track pricing \
  --alert-email alerts@yourcompany.be \
  --daily-summary
```

### EU Tender Intelligence
```bash
eu-market-intelligence tenders \
  --cpv-codes 45200000,45300000 \
  --countries BE,DE,NL,FR \
  --value-min 500000 \
  --value-currency EUR \
  --match-keywords "sustainable infrastructure" \
  --output upcoming_tenders.csv
```

Tracks EU public procurement tenders relevant to your business.

### Trade Show Intelligence
```bash
eu-market-intelligence trade-shows \
  --industry "pharmaceutical" \
  --upcoming \
  --in "Belgium,Netherlands,Germany" \
  --output 2024_trade_shows.xlsx
```

Find relevant trade shows and exhibitions with exhibitor lists.

### Intellectual Property Monitoring
```bash
eu-market-intelligence ip-monitor \
  --search "renewable energy battery" \
  --patent-office EP,BE \
  --track-competitor-patents \
  --alert-new-applications \
  --output patent_landscape.pdf
```

Monitor patents and IP filings in your sector.

## Integration with OpenClaw

All commands registered as OpenClaw tools:
- `eu-market-intelligence analyze-competitor`
- `eu-market-intelligence trend`
- `eu-market-intelligence monitor`
- `eu-market-intelligence prices`
- `eu-market-intelligence generate-leads`
- `eu-market-intelligence overview`
- `eu-market-intelligence setup-monitor`
- `eu-market-intelligence tenders`
- `eu-market-intelligence trade-shows`
- `eu-market-intelligence ip-monitor`

## Model Recommendations

- **mistral-large**: Best for multilingual market analysis and trend identification
- **llama3-70b-instruct**: Excellent for competitor analysis and report generation
- **mixtral-8x22b**: Most accurate for complex business intelligence tasks

All models optimized for EU business context and regulatory environment.
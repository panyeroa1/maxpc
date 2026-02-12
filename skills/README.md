# Belgian Business Skills Directory

## Overview
Essential skills for a Belgian businessman using Ollama cloud models. All skills support Dutch, French, German, and English.

## Core Business Skills

### 1. **eu-business-compliance**
GDPR and EU regulations compliance checker with Belgian law integration.

**Commands:**
- `eu-business-compliance check-gdpr`
- `eu-business-compliance analyze-dpa`
- `eu-business-compliance check-belgian-law`
- `eu-business-compliance generate-cookie-policy`
- `eu-business-compliance scan-website`
- `eu-business-compliance quick-check`
- `eu-business-compliance generate-privacy-policy`

**Model:** llama3-70b-instruct, mistral-large, mixtral-8x22b

---

### 2. **multi-language-translator**
Professional translation for business communications.

**Commands:**
- `multi-language-translator translate`
- `multi-language-translator document`
- `multi-language-translator batch`
- `multi-language-translator email`
- `multi-language-translator chat`
- `multi-language-translator detect`
- `multi-language-translator summarize`

**Model:** mistral-large, llama3-70b-instruct, mixtral-8x22b

---

### 3. **financial-analyzer**
Multi-currency market analysis and investment insights.

**Commands:**
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

**Model:** llama3-70b-instruct, mistral-large, mixtral-8x22b

---

### 4. **contract-law-reviewer**
EU and Belgian contract law review with risk assessment.

**Commands:**
- `contract-law-reviewer review`
- `contract-law-reviewer risk-scan`
- `contract-law-reviewer extract`
- `contract-law-reviewer compare`
- `contract-law-reviewer template`
- `contract-law-reviewer check-unfair`
- `contract-law-reviewer quick`
- `contract-law-reviewer generate`
- `contract-law-reviewer employment-check`

**Model:** llama3-70b-instruct, mistral-large, mixtral-8x22b

---

### 5. **eu-market-intelligence**
Competitor analysis and business intelligence.

**Commands:**
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

**Model:** mistral-large, llama3-70b-instruct, mixtral-8x22b

---

### 6. **expense-tracker**
VAT-compliant expense management with receipt scanning.

**Commands:**
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

**Model:** llama3-70b-instruct, mistral-large, mixtral-8x22b

---

### 7. **invoice-processor**
PDF invoice processing with accounting integration.

**Commands:**
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

**Model:** llama3-70b-instruct, mistral-large, mixtral-8x22b

---

### 8. **business-networker**
LinkedIn and professional networking automation.

**Commands:**
- `business-networker connect`
- `business-networker track`
- `business-networker follow-up`
- `business-networker report`
- `business-networker event`
- `business-networker campaign`
- `business-networker trade-show`
- `business-networker partnership`
- `business-networker maintain`

**Model:** mistral-large, llama3-70b-instruct, mixtral-8x22b

---

### 9. **meeting-summarizer**
Multi-language meeting notes with action items.

**Commands:**
- `meeting-summarizer text`
- `meeting-summarizer audio`
- `meeting-summarizer video`
- `meeting-summarizer actions`
- `meeting-summarizer email`
- `meeting-summarizer server`
- `meeting-summarizer analyze-series`

**Model:** mistral-large (summarization), whisper-medium (audio), llama3-70b-instruct, mixtral-8x22b

---

### 10. **wine-expert**
Business dining guide and wine recommendations.

**Commands:**
- `wine-expert recommend`
- `wine-expert business-dinner`
- `wine-expert etiquette`
- `wine-expert cellar`
- `wine-expert guide`
- `wine-expert client-gift`

**Model:** mistral-large, llama3-70b-instruct, mixtral-8x22b

---

### 11. **travel-planner**
EU business travel coordination and expense tracking.

**Commands:**
- `travel-planner plan`
- `travel-planner multi-city`
- `travel-planner budget`
- `travel-planner meetings`
- `travel-planner insights`
- `travel-planner quick-trip`
- `travel-planner sales-tour`
- `travel-planner client-visits`
- `travel-planner analyze-spend`
- `travel-planner emergency`
- `travel-planner sustainable`

**Model:** mistral-large, llama3-70b-instruct, mixtral-8x22b

---

### 12. **eu-regulatory-updates**
Track EU regulations and Belgian implementations.

**Commands:**
- `eu-regulatory-updates monitor`
- `eu-regulatory-updates directives`
- `eu-regulatory-updates belgian-law`
- `eu-regulatory-updates sector`
- `eu-regulatory-updates gdpr`
- `eu-regulatory-updates checklist`
- `eu-regulatory-updates check`
- `eu-regulatory-updates manufacturing`
- `eu-regulatory-updates fintech`
- `eu-regulatory-updates quarterly`
- `eu-regulatory-updates green-deal`

**Model:** mistral-large, llama3-70b-instruct, mixtral-8x22b

---

### 13. **timezone-scheduler**
CET/CEST meeting coordination across timezones.

**Commands:**
- `timezone-scheduler optimal`
- `timezone-scheduler recurring`
- `timezone-scheduler check`
- `timezone-scheduler world-clock`
- `timezone-scheduler schedule`
- `timezone-scheduler schedule-presentation`
- `timezone-scheduler resolve-conflict`
- `timezone-scheduler holiday-aware`

**Model:** mistral-large, llama3-70b-instruct, mixtral-8x22b

---

## Configuration

All skills require Ollama cloud configuration in `.env`:

```bash
OLLAMA_CLOUD_URL=https://api.cloud.ollama.com/v1
OLLAMA_CLOUD_API_KEY=your-api-key
PREFERRED_MODEL=llama3-70b-instruct
DEFAULT_LANGUAGE=auto  # auto | nl | fr | de | en
HOME_BASE=Brussels, Belgium
```

## Quick Start

1. **Set up environment**: Configure `.env` with Ollama cloud credentials
2. **Explore skills**: Read individual SKILL.md files for detailed usage
3. **Choose use case**: Start with one business need (e.g., expense tracking)
4. **Test commands**: Run sample commands to verify setup
5. **Automate workflows**: Combine multiple skills for complete workflows

## Example Workflows

### Client Meeting Workflow
1. `timezone-scheduler optimal` - Find best meeting time
2. `multi-language-translator email` - Send invite in client's language
3. `travel-planner plan` - Arrange business dinner if needed
4. `wine-expert recommend` - Suggest wine pairing
5. `meeting-summarizer audio` - Transcribe meeting
6. `expense-tracker add` - Record expenses

### Contract Review Workflow
1. `contract-law-reviewer review` - Analyze contract
2. `eu-business-compliance check-gdpr` - Verify data protection
3. `multi-language-translator document` - Translate if needed
4. `financial-analyzer validate-invoice` - Verify financial terms
5. `eu-regulatory-updates check` - Ensure current regulation compliance

### Travel Workflow
1. `travel-planner plan` - Create itinerary
2. `timezone-scheduler optimal` - Schedule client meetings
3. `expense-tracker travel-day` - Track daily expenses
4. `invoice-processor mobile-scan` - Scan receipts
5. `expense-tracker vat-reclaim` - Prepare VAT reclaim

## Model Recommendations by Task

**Legal Analysis**: llama3-70b-instruct or mixtral-8x22b
**Translation**: mistral-large
**Financial**: llama3-70b-instruct
**Meeting/Summarization**: mistral-large
**Travel**: mistral-large
**Networking**: mistral-large

## Belgian Business Culture Notes

- **Languages**: Dutch (Flanders), French (Wallonia), German (Eupen)
- **Business Hours**: 09:00-18:00 CET/CEST
- **Lunch**: 12:00-13:00 typically, avoid meetings
- **Holidays**: Respected across all regions
- **VAT**: Standard 21%, reduced 12%/6%
- **Punctuality**: Highly valued (especially Flanders)
- **Formality**: Professional, use titles initially
- **EU Context**: Brussels is EU capital, many EU-related activities
# Multi-Language Translator

## Description
Real-time professional translation for business communications. Supports Dutch (Flemish), French, German, and English. Optimized for formal business language with Ollama cloud models.

## Installation

```bash
pip install python-docx ollama pypdf2
```

## Configuration

Add to `.env`:
```bash
OLLAMA_CLOUD_URL=https://api.cloud.ollama.com/v1
OLLAMA_CLOUD_API_KEY=your-api-key
TRANSLATION_MODEL=mistral-large  # Excellent for multilingual translation
FALLBACK_MODEL=llama3-70b-instruct
```

## Usage

### Translate text
```bash
multi-language-translator translate \
  --text "Het contract moet morgen ondertekend worden" \
  --source nl \
  --target fr \
  --formality business
```

### Translate document
```bash
multi-language-translator document \
  contract_dutch.pdf \
  --source auto \
  --target de \
  --output contract_deutsch.docx \
  --preserve-formatting
```

### Batch translate files
```bash
multi-language-translator batch \
  *.pdf \
  --source nl \
  --targets fr,en \
  --output-dir ./translations/
```

### Email translation
```bash
multi-language-translator email \
  --subject "Contract proposal" \
  --body email_body.txt \
  --source en \
  --target nl \
  --business-tone formal
```

### Real-time chat translation
```bash
multi-language-translator chat \
  --monitor \
  --source nl \
  --target fr \
  --auto-translate
```

### Detect language
```bash
multi-language-translator detect "Ce document est important pour le projet"
```

## Features

- **Language Support**: 
  - Dutch (Flemish - Belgian Dutch)
  - French (French + Belgian French variants)
  - German
  - English (UK/US variants)
- **Business Formality Levels**: informal, standard, formal, business (default)
- **Document Types**: PDF, DOCX, TXT, HTML
- **Auto-detection**: Detects source language automatically
- **Batch Processing**: Translate multiple files at once
- **Format Preservation**: Keeps formatting, headers, and structure
- **Context-aware**: Understands business context and terminology

## Business-Specific Terminology

### Dutch (NL)
- BVNA/SPRL legal terms
- Formal business address formats (Geachte heer/mevrouw)
- Belgian business conventions

### French (FR)
- Belgian French business terminology
- Formal correspondence formats
- Legal terms specific to Belgian law

### German (DE)
- Formal business language (Sie form)
- German business etiquette
- Legal and banking terminology

### Examples

#### Quick Email Translation
```bash
multi-language-translator translate \
  --text "Thank you for your proposal. We will review it and get back to you by Friday." \
  --source en \
  --target nl \
  --formality business
```

Output: `Dank u voor uw voorstel. We zullen dit beoordelen en u voor vrijdag terug contacteren.`

#### Legal Document Translation
```bash
multi-language-translator document \
  contrat_fr.pdf \
  --source fr \
  --target nl \
  --preserve-legal-terms \
  --output contract_nl_belgian_variant.pdf
```

#### Business Meeting Notes
```bash
multi-language-translator summarize \
  meeting_notes_en.docx \
  --source en \
  --target fr,de,nl \
  --extract-action-items \
  --output-dir ./meeting_summaries/
```

## Integration with OpenClaw

All commands registered as tools:
- `multi-language-translator translate`
- `multi-language-translator document`
- `multi-language-translator batch`
- `multi-language-translator email`
- `multi-language-translator chat`
- `multi-language-translator detect`
- `multi-language-translator summarize`

## Model Recommendations

- **mistral-large**: Best for translation accuracy and nuance
- **mixtral-8x22b**: Excellent for large documents
- **llama3-70b-instruct**: Good all-around performance

All models support multilingual context and business terminology.
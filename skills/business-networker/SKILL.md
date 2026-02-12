# Business Networker

## Description
LinkedIn and professional networking automation for Belgian business professionals. Manages contacts, tracks interactions, and schedules follow-ups using Ollama cloud models.

## Installation

```bash
pip install linkedin-api requests oauth2 ollama
```

## Configuration

Add to `.env`:
```bash
LINKEDIN_USERNAME=your-linkedin-email
LINKEDIN_PASSWORD=your-linkedin-password
LINKEDIN_ACCESS_TOKEN=your-access-token
OLLAMA_CLOUD_URL=https://api.cloud.ollama.com/v1
OLLAMA_CLOUD_API_KEY=your-api-key
NETWORKING_MODEL=mistral-large
```

## Usage

### Connect with potential clients
```bash
business-networker connect \
  --search "renewable energy" \
  --location "Belgium" \
  --role "Director" \
  --personalized-message \
  --language nl \
  --daily-limit 5
```

### Track contact history
```bash
business-networker track \
  --contact "John Smith" \
  --add-interaction "Meeting at EUBusiness Summit" \
  --date 2024-01-15 \
  --notes "Discussed partnership opportunities"
```

### Schedule follow-ups
```bash
business-networker follow-up \
  --from last-meeting --days 7 \
  --template business-cooperation \
  --language fr \
  --send-reminder
```

### Generate networking report
```bash
business-networker report \
  --period month \
  --new-connections \
  --interaction-frequency \
  --output networking_report.xlsx
```

### Event-based networking
```bash
business-networker event \
  --event "EUBusinessSummit2024" \
  --export-attendees attendees.csv \
  --generate-connection-messages \
  --message-template follow-up-on-meeting
```

## Features

- **LinkedIn automation**: Find and connect with professionals
- **Language support**: Dutch, French, German, English
- **Business focus**: EU and Belgian market
- **Personalization**: AI-generated personalized messages
- **Connection limits**: Respect LinkedIn rate limits
- **CRM-like tracking**: Contact interaction history
- **Follow-up scheduling**: Reminders and scheduling
- **Templates**: Business collaboration, partnership, sales
- **Reporting**: Networking metrics and insights
- **Data export**: CSV, Excel, JSON

## Networking Strategies

### Event Follow-up
- Quick follow-up within 24-48 hours
- Reference specific conversation points
- Propose concrete next steps

### Partnership Outreach
- Research target company thoroughly
- Highlight mutual benefits
- Suggest low-commitment first meeting

### Cold Outreach (Warm)
- Mention common connections
- Reference shared interests
- Offer value (insights, introductions)

### Content-Based Connection
- Comment on recent posts
- Share relevant articles
- Build rapport before asking

## Message Templates

### Event Follow-up (NL)
```
Beste [Name],

Het was prettig u te ontmoeten op [Event] in [Location]. Ik heb de discussie over [Topic] zeer interessant gevonden.

Zoals besproken, zou het interessant zijn om te verkennen hoe onze bedrijven kunnen samenwerken op gebied van [Specific area].

Zijn de komende dagen geschikt voor een kort telefoongesprek of lunchgesprek? 

Met vriendelijke groet,
[Your name]
```

### Partnership Proposal (FR)
```
Bonjour [Name],

Je vous ai découvert récemment via LinkedIn et j'ai été impressionné par [Specific achievement or company milestone].

Je suis [Your name] de [Company], où nous développons [Your product/service]. J'ai identifié un potentiel de synergie entre nos entreprises dans le domaine de [Specific area].

Serait-il possible de programmer un appel de 20 minutes dans les prochains jours pour explorer de possibles collaborations ?

Cordialement,
[Your name]
```

### Connection Request (EN)
```
Hi [Name],

I came across your profile while researching experts in [Industry/Field]. Your experience with [Specific project] at [Company] caught my attention.

At [Your company], we're working on [Related area]. I'd love to learn more about your approach to [Specific challenge] and potentially explore collaboration opportunities.

Would you be open to a brief conversation?

Best regards,
[Your name]
```

## Examples

### LinkedIn Campaign
```bash
business-networker campaign \
  --target "fintech" \
  --region "Belgium,Netherlands" \
  --position "CTO,VP Engineering" \
  --personalize-with-role \
  --daily-connections 10 \
  --campaign-length 2 \  # weeks
  --output campaign_results.json
```

Schedules connections over time with personalized messages.

### Trade Show Networking
```bash
business-networker trade-show \
  --event "EUBusinessSummit2024" \
  --export-attendees attendees.csv \
  --pre-event-outreach \
  --meeting-scheduler \
  --personalized-follow-ups \
  --booth-visitors
```

Comprehensive trade show networking automation.

### Partnership Development
```bash
business-networker partnership \
  --search "logistics" \
  --company-size "50-500" \
  --seniority "Director,VP,C-level" \
  --geographic "Benelux" \
  --warm-introduction \
  --nurture-sequence 3 \
  --track-conversions
```

Multi-touch partnership development campaign.

### Contact Maintenance
```bash
business-networker maintain \
  --inactive-days 90 \
  --send-touch-base \
  --schedule-calls \
  --prioritize-by-value \
  --output maintenance_schedule.csv
```

Keeps connections warm with scheduled check-ins.

## Integration with OpenClaw

All commands registered as tools:
- `business-networker connect`
- `business-networker track`
- `business-networker follow-up`
- `business-networker report`
- `business-networker event`
- `business-networker campaign`
- `business-networker trade-show`
- `business-networker partnership`
- `business-networker maintain`

## Model Recommendations

- **mistral-large**: Best for personalized message generation
- **llama3-70b-instruct**: Excellent for multi-language professional communication
- **mixtral-8x22b**: Superior for complex networking strategies and campaign planning

All models optimized for Belgian business culture and multi-language professional communication.

## Belgian Business Culture Notes

- **Formal approach**: Use formal language initially (Dutch: "Beste", French: "Monsieur/Madame")
- **Multilingual**: Adapt message based on contact's preferred language
- **Long-term focus**: Belgians value relationship building over quick sales
- **Personal touch**: Reference specific events, common connections
- **Honesty**: Be direct about business objectives and limitations
- **Flexibility**: Understand regional differences (Flanders, Wallonia, Brussels)
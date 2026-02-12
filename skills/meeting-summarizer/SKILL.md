# Meeting Summarizer

## Description
Multi-language meeting notes and action item extraction using Ollama cloud models. Supports Dutch, French, German, and English with business-focused summarization.

## Installation

```bash
pip install ollama numpy soundfile
```

## Configuration

Add to `.env`:
```bash
OLLAMA_CLOUD_URL=https://api.cloud.ollama.com/v1
OLLAMA_CLOUD_API_KEY=your-api-key
SUMMARY_MODEL=mistral-large
AUDIO_MODEL=whisper-medium
DEFAULT_LANGUAGE=auto  # Auto-detect
OUTPUT_FORMAT=markdown  # markdown | pdf | json
```

## Usage

### Summarize meeting notes
```bash
meeting-summarizer text \
  meeting_notes.txt \
  --language auto \
  --extract-action-items \
  --assign-responsibilities \
  --output summary.md
```

### Audio transcription
```bash
meeting-summarizer audio \
  meeting_recording.mp3 \
  --language nl \
  --multiple-speakers \
  --identify-speakers \
  --output transcript_and_summary.md
```

### Video conference recording
```bash
meeting-summarizer video \
  teams_recording.mp4 \
  --language auto \
  --platform teams \
  --extract-slides \
  --output comprehensive_summary.md
```

### Action items only
```bash
meeting-summarizer actions \
  meeting_transcript.docx \
  --language fr \
  --format-table \
  --assign-owners \
  --deadline-detection \
  --output actions_only.xlsx
```

### Email thread summary
```bash
meeting-summarizer email \
  --thread-id "Project Alpha Discussion" \
  --start-date 2024-01-10 \
  --extract-decisions \
  --output decisions_summary.md
```

## Features

- **Multi-language**: Dutch, French, German, English
- **Text summarization**: Extract key points and decisions
- **Action item extraction**: Identify tasks and deadlines
- **Speaker identification**: Recognise different speakers
- **Audio transcription**: Convert speech to text
- **Video processing**: Extract from video recordings
- **Responsibility assignment**: Identify who said what
- **Follow-up scheduling**: Suggest next meeting dates
- **Format flexibility**: Extract slides, charts, notes
- **Email integration**: Summarize email threads
- **Export options**: Markdown, PDF, Excel, JSON

## Multi-language Support

### Dutch/Flemish
- Formal business language
- Belgian business terminology
- Cultural nuances (Geachte, Met vriendelijke groet)

### French
- Formal business communication
- Belgian French business terms
- Professional closing formulas

### German
- Formal Sie form
- German business etiquette
- Industry-specific terminology

### English
- UK and US variants
- Business English
- Professional terminology

## Meeting Types

### Internal Meetings
- Team meetings
- Project updates
- Status reviews
- Planning sessions

### Client Meetings
- Client presentations
- Contract negotiations
- QBR (Quarterly Business Reviews)
- Feedback sessions

### Vendor Meetings
- Procurement calls
- Partnership discussions
- Service reviews

### Conferences/Presentations
- Industry conferences
- Webinars
- Training sessions
- Workshops

## Examples

### Audio Meeting Transcription
```bash
meeting-summarizer audio \
  brussels_office_2024-01-15.mp3 \
  --language nl \
  --multiple-speakers 4 \
  --identify-speakers \
  --extract-action-items \
  --priority-actions \
  --output meeting_summary_dutch.md
```

Creates:
- Full transcript with speaker labels
- 3-paragraph executive summary
- Action items with owners and deadlines
- Key decisions section
- Follow-up meeting suggestions

### Email Thread Decision Extraction
```bash
meeting-summarizer email \
  --thread "Project Alpha Budget Approval" \
  --extract-decisions \
  --who-made-decision \
  --deadline-set \
  --output decisions.json
```

Extracts:
- "Budget approved for €45,000" - Decision by Sarah (CFO), deadline: Jan 30
- "Q1 launch confirmed" - Decision by Mike (Product), deadline: Mar 31

### Real-time Transcription Server
```bash
meeting-summarizer server \
  --host 0.0.0.0 \
  --port 8080 \
  --real-time-transcription \
  --language auto \
  --buffer-size 30 \
  --auto-summarize-every 5min \
  --output-live http://localhost:8080/live
```

Provides real-time transcription and periodic summaries.

### Multi-Meeting Analysis
```bash
meeting-summarizer analyze-series \
  meetings/2024-01/ \
  --extract-recurring-themes \
  --track-action-item-completion \
  --identify-bottlenecks \
  --progress-report \
  --output january_analysis.pdf
```

Analyzes patterns across multiple meetings for project tracking.

### Video Conference with Slides
```bash
meeting-summarizer video \
  2024-01-15_teams_meeting.mp4 \
  --platform teams \
  --extract-slides \
  --identify-presenter \
  --extract-chart-data \
  --output meeting_pack.zip
```

Creates package with transcript, extracted slides, charts, and summary.

## Integration with OpenClaw

All commands registered as tools:
- `meeting-summarizer text`
- `meeting-summarizer audio`
- `meeting-summarizer video`
- `meeting-summarizer actions`
- `meeting-summarizer email`
- `meeting-summarizer server`
- `meeting-summarizer analyze-series`

## Model Recommendations

- **mistral-large**: Best for meeting summarization and action item extraction
- **whisper-medium**: Excellent for audio transcription in multiple languages
- **llama3-70b-instruct**: Superior for speaker identification and context understanding
- **mixtral-8x22b**: Most accurate for complex multi-speaker meetings

All models optimized for business language and multi-language professional communication.
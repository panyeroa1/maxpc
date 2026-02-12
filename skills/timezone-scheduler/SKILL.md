# Timezone Scheduler

## Description
CET/CEST meeting coordination across timezones with automatic availability detection, scheduling optimization, and cultural awareness for Belgian business professionals.

## Installation

```bash
pip install timezonefinder pytz pandas ollama
```

## Configuration

Add to `.env`:
```bash
OLLAMA_CLOUD_URL=https://api.cloud.ollama.com/v1
OLLAMA_CLOUD_API_KEY=your-api-key
SCHEDULING_MODEL=mistral-large
DEFAULT_TZ=Europe/Brussels
BUSINESS_HOURS_START=09:00
BUSINESS_HOURS_END=18:00
WORKING_DAYS=Monday,Tuesday,Wednesday,Thursday,Friday
PREFERRED_LANGUAGE=nl  # nl | fr | de | en
```

## Usage

### Find optimal meeting time
```bash
timezone-scheduler optimal \
  --participants "Brussels,Belgium; Amsterdam,Netherlands; Frankfurt,Germany; Paris,France" \
  --duration 60 \
  --next-week \
  --respect-business-hours \
  --ranking-scoring \
  --output optimal_slots.json
```

### Schedule recurring meeting
```bash
timezone-scheduler recurring \
  --title "Monthly Strategy Meeting" \
  --participants "Brussels,New York,London" \
  --frequency monthly \
  --day-of-week Tuesday \
  --time-slot 15:00-16:00 \
  --rotation-strategy fair \
  --generate-calendar-links
```

### Check availability
```bash
timezone-scheduler check \
  --participants "team@company1.com,client@company2.fr,partner@company3.nl" \
  --time-proposed "2024-03-20 14:00 CET" \
  --duration 90 \
  --calendar-integration outlook,google \
  --conflicts-detection \
  --alternative-suggestions
```

### World clock display
```bash
timezone-scheduler world-clock \
  --cities "Brussels,Paris,Amsterdam,Frankfurt,London,Milan" \
  --business-hours-highlight \
  --current-time \
  --working-hours \
  --output clock_view.html
```

### Meeting scheduler
```bash
timezone-scheduler schedule \
  --organizer "Brussels,Belgium" \
  --attendees "San Francisco,USA; Tokyo,Japan; Stockholm,Sweden" \
  --purpose "client presentation" \
  --duration 120 \
  --this-month \
  --business-hours-only \
  --cultural-considerations \
  --output meeting_invitations.zip
```

## Features

- **Timezone intelligence**: CET, CEST, UTC+1, UTC+2
- **Business hours**: Respect 09:00-18:00 across timezones
- **Multi-language**: Dutch, French, German, English
- **Availability detection**: Calendar integration (Google, Outlook, Apple)
- **Optimal scheduling**: Algorithmic ranking of time slots
- **Recurring meetings**: Fair rotation across timezones
- **World clock**: Real-time time display for all participants
- **Cultural awareness**: Holiday calendars, lunch breaks
- **Meeting types**: Internal, client, investor, partner
- **Duration optimization**: Best slots for meeting length
- **Calendar integration**: Generate invite links
- **Conflict detection**: Find alternate times
- **Email integration**: Send invites with timezone info

## Timezone Overview (Belgian Business)

### Europe (Common)
- **Brussels, Paris, Amsterdam, Frankfurt**: CET (UTC+1), CEST (UTC+2)
- **London**: GMT (UTC+0), BST (UTC+1)
- **Stockholm**: CET (UTC+1), CEST (UTC+2)
- **Milan**: CET (UTC+1), CEST (UTC+2)
- **Zurich**: CET (UTC+1), CEST (UTC+2)
- **Madrid**: CET (UTC+1), CEST (UTC+2)

### Americas
- **New York**: EST (UTC-5), EDT (UTC-4)
- **Los Angeles**: PST (UTC-8), PDT (UTC-7)
- **Chicago**: CST (UTC-6), CDT (UTC-5)
- **São Paulo**: BRT (UTC-3)
- **Toronto**: EST (UTC-5), EDT (UTC-4)

### Asia Pacific
- **Tokyo**: JST (UTC+9)
- **Singapore**: SGT (UTC+8)
- **Hong Kong**: HKT (UTC+8)
- **Sydney**: AEDT (UTC+11), AEST (UTC+10)
- **Shanghai**: CST (UTC+8)

### Middle East & Africa
- **Dubai**: GST (UTC+4)
- **Cape Town**: SAST (UTC+2)
- **Nairobi**: EAT (UTC+3)

## Belgian Holidays (2024-2025)

### National Holidays (No work)
- **January 1**: New Year's Day
- **Easter Monday**: Variable
- **May 1**: Labour Day
- **Ascension Day**: Variable (Thursday)
- **Whit Monday**: Variable
- **July 21**: Belgian National Day
- **August 15**: Assumption of Mary
- **November 1**: All Saints' Day
- **November 11**: Armistice Day (1918)
- **December 25**: Christmas Day

### Regional (Brussels, Flanders, Wallonia)
- **Brussels**: May 9 (Day of the Flemish Community)
- **Flanders**: July 11 (Day of the Flemish Community)
- **Wallonia**: September 27 (Day of the French Community)
- **German-speaking**: November 15 (Day of the German-speaking Community)

## Common Meeting Time Challenges

### Brussels-New York (6h difference)
- **Optimal**: 14:00-16:00 CET = 08:00-10:00 EST
- **Challenging**: 17:00+ CET = 11:00+ EST (late for US)
- **Avoid**: 09:00 CET = 03:00 EST (middle of night)

### Brussels-Tokyo (8h difference)
- **Optimal**: 09:00-11:00 CET = 17:00-19:00 JST (after work Japan)
- **Challenging**: 15:00+ CET = 23:00+ JST (late night Japan)
- **Avoid**: 07:00 CET = 15:00 JST (before work Belgium)

### Brussels-San Francisco (9h difference)
- **Optimal**: 17:00-18:00 CET = 08:00-09:00 PST
- **Challenging**: 14:00 CET = 05:00 PST (very early US)
- **Avoid**: 10:00 CET = 01:00 PST (middle of night)

### Multi-Region (Brussels, NY, Tokyo)
- **Very difficult**: Need compromise time (e.g., 13:00 CET = 07:00 EST = 21:00 JST)
- **Best strategy**: Rotate meeting times fairly across timezones, or split into regional meetings

## Meeting Best Practices

### Internal Meetings
- **Same timezone**: Aim for 10:00-16:00 CET
- **Multi-EU**: 14:00-16:00 CET works for most of Europe
- **Global team**: Rotate times or record for async viewing

### Client Meetings
- **Belgian client**: Prefer morning (09:00-11:00) or early afternoon (14:00-16:00)
- **Foreign client**: Adapt to client's timezone when possible
- **Multi-partner**: Find compromise time, explain trade-offs

### Recurring Meetings
- **Weekly team**: Same time each week for consistency
- **Monthly all-hands**: Rotate across timezones for fairness
- **Quarterly reviews**: Plan well in advance for timezone conflicts

### Cultural Considerations

#### Flanders (Dutch-speaking)
- **Punctuality**: Highly valued, start on time
- **Scheduling**: Prefer advance notice (1-2 weeks)
- **Meeting length**: Efficient, respect end time
- **Lunch**: 12:00-13:00 typically, avoid meetings

#### Wallonia (French-speaking)
- **Punctuality**: Important but slightly more flexible
- **Relationship**: Allow time for rapport-building
- **Meals**: Important social bonding time
- **Friday afternoons**: Often less productive

#### Brussels (International)
- **Flexibility**: Most accommodating to foreign schedules
- **Languages**: English common for business
- **EU context**: Many meetings revolve around EU institutions schedule

## Examples

### Optimal Meeting Time Finder
```bash
timezone-scheduler optimal \
  --participants "Brussels:Belgium,Stockholm:Sweden,London:UK" \
  --duration 60 \
  --this-week \
  --business-hours-only \
  --score-business-effectiveness \
  --output optimal_times.html
```

Returns ranked time slots: Tuesday 14:00 CET (Score: 95/100), Wednesday 10:00 (Score: 88/100)

### Global Team Recurring Meeting
```bash
timezone-scheduler recurring \
  --title "Global Product Sync" \
  --participants "Brussels,San Francisco,Tokyo,Sydney,London" \
  --frequency weekly \
  --day Thursday \
  --rotation-monthly \
  --duration 90 \
  --record-when-inconvenient \
  --generate-calendar-invites \
  --output recurring_schedule.json
```

Sets up rotating schedule where each region gets optimal time once per quarter.

### Client Presentation Scheduling
```bash
timezone-scheduler schedule-presentation \
  --client-location "New York,USA" \
  --your-location "Brussels,Belgium" \
  --duration 120 \
  --include-lunch-break \
  --optimal-for-client \
  --send-proposal \
  --wait-confirmation \
  --alternative-options 3
```

Sends client 3 options with timezone details in both CET and EST.

### Meeting Conflict Resolution
```bash
timezone-scheduler resolve-conflict \
  --conflict detected \
  --participants-schedules \
  --alternative-times 5 \
  --send-to-all \
  --poll-preferences \
  --auto-schedule-after 48h \
  --output conflict_resolution.pdf
```

Finds alternatives and sends polling link to participants.

### Holiday-Aware Scheduling
```bash
timezone-scheduler holiday-aware \
  --region Europe \
  --date-range 2023-12-15:2024-01-15 \
  --holidays BE,NL,DE,FR,UK \
  --exclude-days \
  --propose-alternatives \
  --output holiday_calendar.html
```

Shows available days excluding Christmas, New Year's, and regional holidays.

## Integration with OpenClaw

All commands registered as tools:
- `timezone-scheduler optimal`
- `timezone-scheduler recurring`
- `timezone-scheduler check`
- `timezone-scheduler world-clock`
- `timezone-scheduler schedule`
- `timezone-scheduler schedule-presentation`
- `timezone-scheduler resolve-conflict`
- `timezone-scheduler holiday-aware`

## Model Recommendations

- **mistral-large**: Best for timezone calculations and optimal slot finding
- **llama3-70b-instruct**: Excellent for cultural considerations and etiquette
- **mixtral-8x22b**: Superior for complex multi-timezone meeting optimization

All models optimized for European business culture and multilingual scheduling communication.
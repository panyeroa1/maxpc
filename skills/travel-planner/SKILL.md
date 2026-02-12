# Travel Planner

## Description
EU business travel coordination with itinerary optimization, expense tracking, and local business insights. Uses Ollama cloud models for intelligent route planning and recommendations.

## Installation

```bash
pip install googlemaps requests pandas ollama
```

## Configuration

Add to `.env`:
```bash
OLLAMA_CLOUD_URL=https://api.cloud.ollama.com/v1
OLLAMA_CLOUD_API_KEY=your-api-key
TRAVEL_MODEL=mistral-large
GOOGLE_MAPS_API_KEY=your-google-maps-key
HOME_BASE=Brussels, Belgium
DEFAULT_CURRENCY=EUR
```

## Usage

### Plan business trip
```bash
travel-planner plan \
  --destination "Berlin, Germany" \
  --dates 2024-03-15:2024-03-18 \
  --business-purpose "client meetings" \
  --transport-optimization \
  --hotel-business-district \
  --output itinerary.json
```

### Optimize multi-city itinerary
```bash
travel-planner multi-city \
  --cities "Amsterdam,Rotterdam,Antwerp" \
  --start-date 2024-04-02 \
  --days-per-city 2,1,2 \
  --transport rail \
  --business-distances \
  --output optimized_route.pdf
```

### Expense projection
```bash
travel-planner budget \
  --destination Paris \
  --duration 3 \
  --hotel-category business \
  --per-diem-belgian-rates \
  --transport-first-class \
  --output expense_projection.xlsx
```

### Client meeting coordination
```bash
travel-planner meetings \
  --location Frankfurt \
  --meeting-times "09:00,14:00,16:30" \
  --travel-between \
  --buffer-time 30 \
  --optimize-sequence \
  --output schedule.html
```

### Local business insights
```bash
travel-planner insights \
  --city Munich \
  --business-district suggestions \
  --restaurant-recommendations \
  --cultural-tips \
  --etiquette-business-meals
```

## Features

- **Multi-city optimization**: Optimal route across 3+ cities
- **Transport modes**: Flight, train, car, or combination
- **Business districts**: Hotel near business areas
- **Meeting coordination**: Schedule with travel time
- **Expense tracking**: Per-diem, hotel, transport
- **EU rail network**: Optimal train routes
- **Belgian per diems**: Automatic Brussels rates
- **CO2 optimization**: Carbon footprint consideration
- **Visa requirements**: EU/non-EU travel documents
- **Local insights**: Restaurants, customs, etiquette
- **Backup plans**: Weather/cancellation contingencies

## Belgian Business Travel

### Common Destinations
- **Netherlands** (Amsterdam, Rotterdam)
- **Germany** (Frankfurt, Berlin, Munich, Düsseldorf)
- **France** (Paris, Lille, Lyon)
- **Luxembourg** (Luxembourg City)
- **UK** (London)
- **Beyond EU**: US, Switzerland, China

### Transport Preferences
- **Train** (Thalys, Eurostar): Brussels-Paris (1h22), Amsterdam (1h50), London (2h)
- **Short haul flights**: Frankfurt (1h), Milan (1h30)
- **Car**: Short distances within Belgium, Netherlands

### Per Diem Rates (2024)
- **Netherlands**: €61/day
- **Germany**: €48/day
- **France (Paris)**: €66/day
- **France (other)**: €51/day
- **UK (London)**: €62/day
- **Switzerland**: €86/day

Full list in Belgian law for 250+ countries.

### Travel Insurance
- **Business travel insurance**: Medical, cancellation, equipment
- **Liability**: Professional liability coverage abroad
- **Equipment**: Laptop, phone insurance

### Corporate Cards
- **Company credit cards**: Universal acceptance
- **EuroCard/MasterCard**: Widely accepted in EU
- **VAT reclaim**: Track all receipts

## Examples

### Quick Brussels-Paris Trip
```bash
travel-planner quick-trip \
  --from Brussels \
  --to Paris \
  --dates 2024-03-20:2024-03-22 \
  --hotel-star business \
  --thalys \
  --generate-expense-estimate \
  --output paris_trip_2024.pdf
```

Creates: Thalys tickets (€168), Hotel (€280), Per diem (€132), Total €580

### Multi-Country Sales Tour
```bash
travel-planner sales-tour \
  --countries "Netherlands,Germany,Switzerland" \
  --cities "Amsterdam,Frankfurt,Munich,Zurich" \
  --start 2024-04-15 \
  --business-days-per-city 2 \
  --weekend-stay-optional \
  --optimize-rail \
  --budget-limit 3000 \
  --output tour_itinerary.html
```

Optimizes route: Brussels → Amsterdam (train) → Frankfurt (train) → Munich (train) → Zurich (train).

### Client Visit Coordination
```bash
travel-planner client-visits \
  --base-city Brussels \
  --clients \
    "Acme NV:Rotterdam:2024-05-10" \
    "TechCorp:Frankfurt:2024-05-11" \
    "Innovate SA:Paris:2024-05-12" \
  --morning-meetings \
  --hotel-central \
  --transport-first-class \
  --output client_visit_plan.xlsx
```

Schedules meetings with travel time, books hotels near business districts.

### Budget Analysis
```bash
travel-planner analyze-spend \
  --year 2024 \
  --quarter Q1 \
  --compare-q1-2023 \
  --cost-per-trip \
  --top-destinations \
  --savings-opportunities \
  --expense-report
```

Shows: Average per trip cost, top 5 destinations, savings from early booking.

### Emergency Re-routing
```bash
travel-planner emergency \
  --flight-cancelled BA123-LHR \
  --alternative-airports \
  --ground-transport-options \
  --hotel-availability \
  --next-available \
  --cost-difference \
  --booking-options
```

Provides backup options when travel disruptions occur.

### Sustainable Travel Options
```bash
travel-planner sustainable \
  --destination Barcelona \
  --dates 2024-06-15:2024-06-19 \
  --transport-train \
  --hotel-eco-certified \
  --co2-calculation \
  --carbon-offset-options \
  --output eco_itinerary.pdf
```

## Integration with OpenClaw

All commands registered as tools:
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

## Model Recommendations

- **mistral-large**: Best for itinerary optimization and local insights
- **llama3-70b-instruct**: Excellent for expense projections and meeting coordination
- **mixtral-8x22b**: Superior for multi-city route planning and contingency planning

All models optimized for EU business travel and Belgian traveler preferences.
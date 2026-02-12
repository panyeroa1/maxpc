# Wine Expert

## Description
Belgian business dining and wine culture guide with recommendations, pairing suggestions, and etiquette. Uses Ollama cloud models for personalized wine recommendations.

## Installation

```bash
pip install ollama pandas numpy
```

## Configuration

Add to `.env`:
```bash
OLLAMA_CLOUD_URL=https://api.cloud.ollama.com/v1
OLLAMA_CLOUD_API_KEY=your-api-key
WINE_MODEL=mistral-large
BUDGET_MIN=15  # Euros per bottle minimum
BUDGET_MAX=150  # Euros per bottle maximum
PREFERENCES_FILE=wine_preferences.json
```

## Usage

### Get wine recommendation
```bash
wine-expert recommend \
  --cuisine belgian \
  --dish "Carbonade Flamande" \
  --budget 25 \
  --location Belgium \
  --region preferences
```

### Business dinner selection
```bash
wine-expert business-dinner \
  --guests 4 \
  --occasion "client meeting" \
  --client-nationality french \
  --budget-per-person 75 \
  --venue-type restaurant \
  --output recommendations.txt
```

### Learn wine etiquette
```bash
wine-expert etiquette \
  --scenario "business dinner" \
  --location Belgium \
  --language-specific \
  --cultural-nuances
```

### Wine cellar management
```bash
wine-expert cellar \
  --list-wines \
  --suggest-aging \
  --ready-to-drink \
  --dinner-planning 2024-02-20
```

### Belgian wine regions guide
```bash
wine-expert guide \
  --region Belgium \
  --highlight-wine-estates \
  --tasting-notes \
  --purchase-locations
```

## Features

- **Belgian Business Dining**: Guide to business meals in Belgium
- **Wine Recommendations**: AI-powered personalized suggestions
- **Food Pairing**: Optimal wine pairings for Belgian and international cuisine
- **Wine Etiquette**: Professional dining protocols
- **Regional Knowledge**: Belgian wine regions, French, Italian, Spanish wines
- **Cultural Nuances**: Flemish vs Walloon business dining differences
- **Budget Guidance**: Price ranges for different occasions
- **Cellar Management**: Track and manage wine inventory
- **Tasting Notes**: Generate professional tasting notes
- **Multi-language**: Dutch, French, German, English

## Belgian Wine Regions

### Flanders
**Hageland (Flemish Brabant)**
- White wines: Chardonnay, Pinot Gris
- Sparkling wines

**Haspengouw (Limburg)**
- Whites and rosés
- Chardonnay, Pinot Noir

**Maasland (Limburg)**
- AOC designation
- High-quality experimental wines

### Wallonia
**Côtes de Sambre et Meuse**
- Traditional grape varieties
- Hybrid varieties

**Entre-Sambre-et-Meuse**
- Boutique wineries
- Unique terroir expressions

**Côtes de Moselle/Lorraine**
- Near French border
- Similar to French styles

## Business Dining Etiquette (Belgium)

### General Rules
- **Punctuality**: Arrive on time (Belgian business culture values punctuality)
- **Dress**: Business formal or smart casual depending on venue
- **Language**: Match language to client's preference (Dutch, French, or English)
- **Table manners**: Continental European style (fork in left, knife in right)

### Ordering Wine
- **Let client choose**: Offer client to select or defer to sommelier
- **Price point**: Mid-range unless client indicates otherwise
- **Tasting ritual**: Accept taste, swirl, smell, approve politely
- **Pouring etiquette**: Host pours for guests, women typically served first

### Regional Differences

#### Flanders (Flemish)
- More casual business dining
- Beer often precedes wine
- Direct communication style
- Focus on efficiency

#### Wallonia (French-speaking)
- More formal dining protocol
- Multiple courses with wine pairings
- Relationship-building focus
- Longer meals, more conversation

#### Brussels (International)
- Mix of Flemish, French, and international styles
- Language flexibility
- EU/business culture blend
- Adapt to client's preference

## Wine Recommendations by Occasion

### Client Meeting (First Time)
- **White**: Chablis, Sancerre, Belgian Chardonnay
- **Red**: Bordeaux Supérieur, Côtes du Rhône, Belgian Pinot Noir
- **Budget**: €35-75 per bottle
- **Approach**: Safe, well-known regions

### Established Client (Regular Dinner)
- **White**: Meursault, White Burgundy
- **Red**: Saint-Émilion, Chianti Classico, Rioja Reserva
- **Budget**: €50-125 per bottle
- **Approach**: Show expertise, introduce variety

### Celebration/Closing Deal
- **Champagne**: NV or Vintage depending on deal size
- **Red**: Grand Cru Burgundy, Barolo, Brunello
- **Dessert**: Sauternes, Port
- **Budget**: €100-300+ per bottle

### Casual Business Lunch
- **White**: Muscadet, Picpoul, Belgian sparkling
- **Red**: Beaujolais, Côtes de Provence rosé
- **Budget**: €20-40 per bottle
- **Approach**: Light, food-friendly

## Examples

### Dinner Recommendation
```bash
wine-expert recommend \
  --cuisine belgian \
  --dish "mussels and fries" \
  --location "Brussels restaurant" \
  --budget 40 \
  --pairings 3 \
  --output recommendations.txt
```

Generates: Belgian white (Chardonnay), French Muscadet, Belgian sparkling

### Belgian Wine Discovery
```bash
wine-expert guide \
  --region Haspengouw \
  --type visit \
  --duration day-trip \
  --wineries 3-4 \
  --lunch-included \
  --output itinerary.md
```

Creates day trip itinerary with tasting appointments.

### Client Gift Selection
```bash
wine-expert client-gift \
  --client-type "long-term business partner" \
  --budget 60 \
  --nationality french \
  --personalization \
  --gift-message \
  --delivery-Belgium
```

Suggests wine with personalized tasting notes and gift message.

### Cellar Organization
```bash
wine-expert cellar \
  --my-wines cellar_inventory.xlsx \
  --dinner-date 2024-02-20 \
  --guests 6 \
  --menu-3-courses \
  --serving-suggestions \
  --output dinner_plan.md
```

Creates complete dinner wine plan with serving order and temperatures.

## Integration with OpenClaw

All commands registered as tools:
- `wine-expert recommend`
- `wine-expert business-dinner`
- `wine-expert etiquette`
- `wine-expert cellar`
- `wine-expert guide`
- `wine-expert client-gift`

## Model Recommendations

- **mistral-large**: Best for comprehensive wine knowledge and pairing suggestions
- **llama3-70b-instruct**: Excellent for cultural context and etiquette advice
- **mixtral-8x22b**: Superior for personalized recommendations and cellar management

All models trained on extensive wine knowledge, Belgian business dining culture, and multilingual communication.
# BiteBuddy

A smart recipe management and nutrition tracking application built with Next.js and Sanity CMS.

## Features

- 🍳 **Recipe Management**: Create, edit, and organize recipes with detailed ingredients and instructions
- 🤖 **AI Recipe Generator**: Generate UK copycat recipes using OpenAI with automatic ingredient creation and nutrition data
- 📊 **Automatic Nutrition Calculation**: Smart nutrition tracking with unit conversion and per-serving calculations
- 🔄 **Real-time Updates**: Automatic nutrition recalculation when recipes or ingredients change
- 🥕 **Ingredient Database**: Comprehensive ingredient database with AI-generated nutrition data per 100g
- 🔍 **Smart Search**: Flexible ingredient-based search with multi-format input support
- ⭐ **Recipe Ratings**: Interactive star rating system with aggregate scoring
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- 🏷️ **Brand System**: Organize recipes by restaurant chains and brands

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **CMS**: Sanity Studio for content management
- **Nutrition Engine**: Custom nutrition calculation with unit conversion
- **Deployment**: Ready for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Sanity account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bitebuddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create `.env.local` and configure:
   ```env
   # Sanity CMS
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   SANITY_WRITE_TOKEN=your-write-token

   # Webhooks
   NUTRITION_WEBHOOK_SECRET=your-webhook-secret

   # AI Recipe Generator (Optional)
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

## Nutrition System

BiteBuddy features a sophisticated nutrition calculation system that automatically tracks calories, protein, fat, and carbs for your recipes.

### Key Features

- **Automatic Calculation**: Nutrition updates automatically when you modify recipes or ingredients
- **Unit Conversion**: Supports weight (g, kg), volume (ml, l, tsp, tbsp, cup), and piece-based measurements
- **Per-Serving Values**: Automatically calculates nutrition per serving based on recipe yield
- **Ingredient Database**: Store nutrition data per 100g for accurate calculations

### Setting Up Automatic Recalculation

1. **Test the API endpoints**
   ```bash
   npm run test-nutrition auto
   ```

2. **Set up Sanity webhooks** (see [WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md) for detailed instructions)

3. **Manual recalculation** (if needed)
   ```bash
   curl -X POST http://localhost:3000/api/recalc-nutrition?secret=your-secret \\
     -H "Content-Type: application/json" \\
     -d '{"recipeId": "recipe-id"}'
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test-nutrition` - Test nutrition calculation APIs
- `npm run setup-webhooks` - Set up Sanity webhooks (experimental)

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API endpoints
│   │   └── recalc-nutrition/  # Nutrition calculation APIs
│   ├── recipes/           # Recipe pages
│   └── studio/            # Sanity Studio
├── sanity/                # Sanity configuration
│   ├── schemaTypes/       # Content schemas
│   └── client.ts          # Sanity client
└── lib/
    └── nutrition.ts       # Nutrition calculation engine

scripts/
├── test-nutrition-api.ts  # API testing utilities
└── setup-nutrition-webhooks.ts  # Webhook setup (experimental)
```

## Content Management

### Sanity Schemas

- **Recipe**: Complete recipe data with ingredients, instructions, and nutrition
- **Ingredient**: Ingredient database with nutrition per 100g and unit conversion data
- **Collection**: Curated recipe collections

### Content Types

1. **Recipes**: Full recipe management with grouped ingredients, instructions, and metadata
2. **Ingredients**: Nutrition database with support for density and piece-based measurements
3. **Collections**: Organize recipes into themed collections

## Deployment

### Vercel (Recommended)

1. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

2. **Set environment variables** in Vercel dashboard

3. **Update webhook URLs** in Sanity to use your production domain

### Other Platforms

The application is built on standard Next.js and can be deployed to any platform that supports Node.js applications.

## API Endpoints

- `GET /api/recipes` - List recipes with search and filtering
- `POST /api/recalc-nutrition` - Recalculate nutrition for a specific recipe
- `POST /api/recalc-nutrition/ingredient-changed` - Recalculate nutrition for all recipes using a changed ingredient

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
1. Check the [troubleshooting section](./WEBHOOK_SETUP.md#troubleshooting) in the webhook setup guide
2. Review the API testing results with `npm run test-nutrition auto`
3. Open an issue on GitHub with detailed information about your problem
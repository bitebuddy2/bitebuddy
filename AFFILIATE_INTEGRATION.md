# Affiliate Button Integration Guide

## Overview
The `AffiliateButton` component tracks clicks and redirects users to retailer affiliate links while capturing analytics data.

## Components Created

### 1. AffiliateButton (`src/components/AffiliateButton.tsx`)
Renders a clickable button that:
- Fires Google Analytics `affiliate_click` event with ingredient and retailer data
- Redirects to `/go?u=<encoded-url>` for tracking

### 2. Redirect Page (`src/app/go/page.tsx`)
Intermediate page that:
- Ensures GA tracking fires before external redirect
- Shows loading state during redirect
- Handles missing URL errors

## Usage in Recipe Pages

### Option 1: Add to Sanity Schema (Recommended)

First, add retailer links to your ingredient schema:

```typescript
// src/sanity/schemaTypes/ingredient.ts
export default defineType({
  name: "ingredient",
  title: "Ingredient",
  type: "document",
  fields: [
    // ... existing fields
    defineField({
      name: "retailerLinks",
      title: "Retailer Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "retailer", type: "string", title: "Retailer" },
            { name: "url", type: "url", title: "Affiliate URL" },
            { name: "label", type: "string", title: "Button Label" },
          ],
        },
      ],
    }),
  ],
});
```

### Option 2: Use in Recipe Detail Page

Update `src/app/recipes/[slug]/page.tsx`:

```typescript
import AffiliateButton from "@/components/AffiliateButton";

// In the ingredients section, around line 276-284:
return (
  <li key={ii} className="flex items-start gap-2">
    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
    <div className="flex-1">
      <div>
        <strong>{label}</strong>
        {it.notes ? ` — ${it.notes}` : ""}
      </div>

      {/* Add affiliate buttons if ingredient has retailer links */}
      {it.ingredientRef?.retailerLinks && it.ingredientRef.retailerLinks.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {it.ingredientRef.retailerLinks.map((link: any, idx: number) => (
            <AffiliateButton
              key={idx}
              url={link.url}
              retailer={link.retailer}
              ingredient={name}
              label={link.label || `Buy at ${link.retailer}`}
            />
          ))}
        </div>
      )}
    </div>
  </li>
);
```

### Option 3: Manual Integration Example

```typescript
import AffiliateButton from "@/components/AffiliateButton";

// Anywhere in your component:
<AffiliateButton
  url="https://www.tesco.com/groceries/en-GB/products/123456"
  retailer="Tesco"
  ingredient="Sausage meat"
  label="Buy at Tesco"
/>
```

## Testing

1. Visit `/products` to see demo affiliate buttons
2. Click a button (ensure analytics cookies are accepted)
3. Check GA4 → Reports → Engagement → Events
4. Look for `affiliate_click` events
5. Mark as conversion in GA4

## Analytics Setup

1. In GA4, go to Admin → Events
2. Find `affiliate_click` event
3. Toggle "Mark as conversion"
4. Add custom dimensions for `ingredient` and `retailer` to analyze performance

## Next Steps

1. Add `retailerLinks` field to ingredient schema in Sanity
2. Populate retailer links for common ingredients
3. Update recipe detail page to show affiliate buttons
4. Monitor conversion data in GA4
5. Remove demo section from `/products` once tested

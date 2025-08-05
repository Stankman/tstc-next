# Kuali API Integration Setup

This guide explains how to integrate Kuali program data into your WordPress programs.

## 1. Environment Setup

Add your Kuali API token to your environment variables:

```bash
# .env.local
KUALI_API_TOKEN=your_kuali_bearer_token_here
```

## 2. WordPress Program Mapping

Your WordPress programs should already have the Kuali program ID available via the ACF field `kuali_id`. The integration automatically looks for this field:

```typescript
// The integration uses this field from your WordPress program
program.acf?.kuali_id
```

### WordPress Types

Your WordPress types already include the kuali_id field:

```typescript
// In src/lib/wordpress.d.ts
export interface Program extends Post {
    acf: {
        short_description?: string;
        tuition?: string;
        kuali_id?: string; // This field is used for Kuali integration
    };
    industry: number[];
    schedule: number[];
    award: number[];
    campus: number[];
}
```

## 3. API Endpoints

The integration creates the following API endpoint:

- `GET /api/kuali/[programId]` - Fetches comprehensive program data from Kuali

### Response Structure

```json
{
  "program": {
    "id": "program-id",
    "status": "active",
    "title": "Program Title",
    "description": "Program description..."
  },
  "locations": [
    { "id": "loc-1", "name": "Campus A" },
    { "id": "loc-2", "name": "Campus B" }
  ],
  "degreeTypes": [
    { "id": "deg-1", "name": "Associate" },
    { "id": "deg-2", "name": "Certificate" }
  ],
  "modalities": [
    { "id": "mod-1", "name": "In-Person" },
    { "id": "mod-2", "name": "Online" }
  ]
}
```

## 4. Usage in Components

The integration is automatically included in your program pages at `/programs/[slug]`. The Kuali data will be fetched and passed to:

- `StatsCard` component - Shows summary information
- `ProgramInformation` component - Shows detailed information including locations, degree types, and modalities

## 5. Error Handling

- If a program is not found in Kuali or not active, the page will still render using only WordPress data
- If the Kuali API is unavailable, the page gracefully falls back to WordPress-only data
- All errors are logged to the console for debugging

## 6. Performance Considerations

- Kuali data is fetched server-side during page generation
- Data is cached using Next.js revalidation (1 hour by default)
- Failed requests don't block page rendering

## 7. Testing the Integration

1. Make sure you have a program in WordPress with a `kuali_id` field populated
2. Ensure the corresponding program exists in Kuali and has status 'active'
3. Visit `/programs/[your-program-slug]` to see the integrated data

## 8. Customization

You can customize the display of Kuali data by modifying:

- `src/components/programs/single/stats-card.tsx` - For summary display
- `src/components/programs/single/program-information.tsx` - For detailed display
- `src/lib/kuali.ts` - For data fetching logic

## 9. Debugging

If Kuali data isn't showing:

1. Check browser console for error messages
2. Verify the `KUALI_API_TOKEN` environment variable is set
3. Ensure the program has a valid `kuali_id` in the ACF field
4. Test the API directly: `/api/kuali/[program-id]`
5. Check that the Kuali program status is 'active'

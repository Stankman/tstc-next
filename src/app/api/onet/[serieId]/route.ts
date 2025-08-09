import { NextRequest, NextResponse } from 'next/server';

interface BLSResponse {
  status: string;
  responseTime: number;
  message: string[];
  Results: {
    series: Array<{
      seriesID: string;
      catalog: {
        occupation: string;
        [key: string]: any;
      };
      data: Array<{
        year: string;
        period: string;
        periodName: string;
        latest: string;
        value: string;
        footnotes: any[];
      }>;
    }>;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serieId: string }> }
) {
  try {
    const { serieId: serieIdCode } = await params;

    if (!serieIdCode) {
      return NextResponse.json(
        { error: 'Serie ID code is required' },
        { status: 400 }
      );
    }

    // Validate that serieIdCode is a number
    if (!/^\d+$/.test(serieIdCode)) {
      return NextResponse.json(
        { error: 'Serie ID must be a number. The given ID is wrong.' },
        { status: 400 }
      );
    }

    // Optional: Validate length (typically 6 digits for ONET codes)
    if (serieIdCode.length !== 6) {
      return NextResponse.json(
        { error: 'Serie ID must be exactly 6 digits. The given ID is wrong.' },
        { status: 400 }
      );
    }

    // Construct the full serie ID: OEUS4800000000000[serieId]13
    const fullSerieId = `OEUS4800000000000${serieIdCode}13`;

    const payload = {
      seriesid: [fullSerieId],
      catalog: true,
      registrationkey: '1233e4360da84368a966958a9603405a'
    };

    const response = await fetch('https://api.bls.gov/publicAPI/v2/timeseries/data/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`BLS API responded with status: ${response.status}`);
    }

    const data: BLSResponse = await response.json();

    if (data.status !== 'REQUEST_SUCCEEDED') {
      throw new Error(`BLS API error: ${data.message.join(', ')}`);
    }

    const series = data.Results.series;
    
    if (!series || series.length === 0) {
      return NextResponse.json(
        { error: 'No data found for the provided serie ID' },
        { status: 404 }
      );
    }

    const mySeries = series[0];

    // Extract the required data
    const result = {
      serieId: serieIdCode,
      fullSerieId: fullSerieId,
      occupation: mySeries.catalog?.occupation || 'Unknown Occupation',
      annualMedian: mySeries.data?.[0]?.value || 'N/A'
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('ONET API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch ONET data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

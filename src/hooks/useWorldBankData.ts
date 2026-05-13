import { useState, useEffect, useMemo } from 'react';

interface WBCountryData {
  country: string;
  countryCode: string;
  gdpPerCapita: number;
  year: number;
}

const COUNTRY_CODES: Record<string, string> = {
  'Japan': 'JPN',
  'South Korea': 'KOR',
  'China': 'CHN',
  'Hong Kong': 'HKG',
  'Taiwan': 'TWN',
  'Singapore': 'SGP',
  'Malaysia': 'MYS',
  'Thailand': 'THA',
  'Philippines': 'PHL',
  'Indonesia': 'IDN',
  'Vietnam': 'VNM',
  'Cambodia': 'KHM',
  'Laos': 'LAO',
  'Myanmar': 'MMR',
  'India': 'IND',
  'Bangladesh': 'BGD',
  'Pakistan': 'PAK',
  'Nepal': 'NPL',
  'Sri Lanka': 'LKA',
  'Brunei': 'BRN',
  'Mongolia': 'MNG',
};

export function useWorldBankData() {
  const [data, setData] = useState<WBCountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const codes = Object.values(COUNTRY_CODES).join(';');
    const url = `https://api.worldbank.org/v2/country/${codes}/indicator/NY.GDP.PCAP.CD?date=2023&format=json&per_page=50`;

    fetch(url)
      .then(r => r.json())
      .then((result) => {
        if (!Array.isArray(result) || result.length < 2) {
          setError('Invalid response');
          setLoading(false);
          return;
        }
        const entries = result[1] as Array<{
          country: { value: string };
          countryiso3code: string;
          value: number | null;
          date: string;
        }>;
        const mapped: WBCountryData[] = entries
          .filter(e => e.value !== null)
          .map(e => ({
            country: e.country.value,
            countryCode: e.countryiso3code,
            gdpPerCapita: e.value!,
            year: parseInt(e.date),
          }));
        setData(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getGdpForCountry = (countryName: string): number | null => {
    const code = COUNTRY_CODES[countryName];
    if (!code) return null;
    const entry = data.find(d => d.countryCode === code);
    return entry?.gdpPerCapita ?? null;
  };

  const getGdpForCode = (code: string): number | null => {
    const entry = data.find(d => d.countryCode === code);
    return entry?.gdpPerCapita ?? null;
  };

  return useMemo(() => ({
    data,
    loading,
    error,
    getGdpForCountry,
    getGdpForCode,
  }), [data, loading, error]);
}

export type { WBCountryData };

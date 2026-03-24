import { useState, useEffect } from 'react';

interface PhotoData {
  id: string;
  link: string;
  photographer: string;
  thumbnail_large: {
    src: string;
    size: {
      width: number;
      height: number;
    };
  };
}

interface AircraftPhotoResponse {
  photos: PhotoData[];
}

export function useAircraftPhoto(hex: string | null) {
  const [photo, setPhoto] = useState<PhotoData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hex) {
      setPhoto(null);
      return;
    }

    let cancelled = false;

    const hexUpper = hex.toUpperCase();

    async function fetchPhoto() {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.planespotters.net/pub/photos/hex/${hexUpper}`
        );

        if (!response.ok) {
          setPhoto(null);
          return;
        }

        const data: AircraftPhotoResponse = await response.json();

        if (!cancelled && data.photos && data.photos.length > 0) {
          setPhoto(data.photos[0]);
        } else {
          setPhoto(null);
        }
      } catch (error) {
        if (!cancelled) {
          setPhoto(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPhoto();

    return () => {
      cancelled = true;
    };
  }, [hex]);

  return { photo, loading };
}

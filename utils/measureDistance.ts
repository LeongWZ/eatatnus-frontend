/*
Mesaure distance (in meters) between two points given their latitude and longitude
using the Haversine formula. Rounded up to the nearest integer.
https://en.wikipedia.org/wiki/Haversine_formula
*/
export default function measureDistance(
  lat1: number,
  long1: number,
  lat2: number,
  long2: number,
): number {
  const r = 6371e3; // metres

  const lat1Rad = toRadians(lat1);
  const long1Rad = toRadians(long1);

  const lat2Rad = toRadians(lat2);
  const long2Rad = toRadians(long2);

  return Math.round(
    2 *
      r *
      Math.asin(
        Math.sqrt(
          (1 / 2) *
            (1 -
              Math.cos(lat2Rad - lat1Rad) +
              Math.cos(lat1Rad) *
                Math.cos(lat2Rad) *
                (1 - Math.cos(long2Rad - long1Rad))),
        ),
      ),
  );
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export type Geocoding = {
  point: {
    lat: number
    lng: number
  }
  [key: string]: any
};

export const autoComplete = async (
  input: string,
  point: [number, number] | null,
  osmTag?: string
) => {
  const q = new URLSearchParams();
  q.set("q", input);
  if (point) q.set("point", `${point[0]},${point[1]}`);
  if (osmTag) q.set("osm_tag", osmTag);

  const { data, error } = await fetch("/api/geocoding/autocomplete?" + q.toString())
    .then((res) => res.json());

  if (error) {
    console.error(error);
    return [];
  };

  return data as Geocoding[];
};
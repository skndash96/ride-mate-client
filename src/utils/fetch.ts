export type Geocoding = {
  point: {
    lat: number
    lng: number
  }
  [key: string]: any
};

export const apiFetch = async (url: string, {
  fetchOptions,
  addNotification
}: {
  fetchOptions?: RequestInit,
  addNotification?: (message: string, type: "error" | "success") => void
}) => {
  try {
    const { data, error } = await fetch(url, fetchOptions).then(res => res.json());

    if (error) {
      addNotification?.(error, "error");
      console.log(error);
    }

    return data;
  } catch (e) {
    addNotification?.("Something went wrong. Please try again later.", "error");
    console.error(e);

    return null;
  }
}
export const apiFetch = async <T>(url: string, {
  fetchOptions,
  addNotification
}: {
  fetchOptions?: RequestInit,
  addNotification?: (message: string, type: "error" | "success") => void
}): Promise<T | false | null> => {
  try {
    const { data, error } = await fetch(url, fetchOptions).then(res => res.json());

    if (error) {
      addNotification?.(error, "error");
      console.log(error);

      return false;
    }

    return data;
  } catch (e) {
    addNotification?.("Something went wrong. Please try again later.", "error");
    console.error(e);

    return false;
  }
}
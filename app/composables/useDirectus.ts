export function useDirectus() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.directusUrl as string;
  const token = config.public.directusToken as string;
  const ceremoniesCollection =
    (config.public.directusCeremoniesCollection as string) || "ceremonies1";
  const galleryCollection =
    (config.public.directusGalleryCollection as string) || "gallery_items1";
  const guestsCollection =
    (config.public.directusGuestsCollection as string) || "guests1";
  const weddingSettingsIndex = Number(
    config.public.directusWeddingSettingsIndex ?? 1,
  );

  function directusFetch<T>(
    endpoint: string,
    params?: Record<string, string>,
  ): Promise<T> {
    const url = `${baseUrl}${endpoint}`;
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return $fetch<T>(url, {
      headers,
      params,
    });
  }

  async function getWeddingSettings(): Promise<WeddingSettings> {
    const res = await directusFetch<DirectusResponse<WeddingSettings[]>>(
      "/items/wedding_settings",
      {
        limit: String(weddingSettingsIndex + 1),
        sort: "id",
      },
    );
    const settings = res.data[weddingSettingsIndex];
    if (!settings) {
      throw createError({
        statusCode: 500,
        statusMessage: `Wedding settings not found at index ${weddingSettingsIndex}`,
      });
    }
    return settings;
  }

  async function getCeremonies(): Promise<Ceremony[]> {
    const res = await directusFetch<DirectusResponse<Ceremony[]>>(
      `/items/${ceremoniesCollection}`,
      {
        sort: "sort",
      },
    );
    return res.data;
  }

  async function getGallery(): Promise<GalleryItem[]> {
    const res = await directusFetch<DirectusResponse<GalleryItem[]>>(
      `/items/${galleryCollection}`,
      {
        sort: "sort",
      },
    );
    return res.data;
  }

  async function getGuest(id: string): Promise<Guest> {
    const res = await directusFetch<DirectusResponse<Guest>>(
      `/items/${guestsCollection}/${id}`,
    );
    return res.data;
  }

  function assetUrl(
    fileId: string,
    transforms?: { width?: number; height?: number; quality?: number },
  ): string {
    if (!fileId) return "";
    let url = `${baseUrl}/assets/${fileId}`;
    const params = new URLSearchParams();
    if (transforms?.width) params.set("width", String(transforms.width));
    if (transforms?.height) params.set("height", String(transforms.height));
    if (transforms?.quality) params.set("quality", String(transforms.quality));
    const qs = params.toString();
    return qs ? `${url}?${qs}` : url;
  }

  return {
    directusFetch,
    getWeddingSettings,
    getCeremonies,
    getGallery,
    getGuest,
    assetUrl,
  };
}

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
export async function updateSetting(
  userId: string,
  updatedFields: Partial<{
    fontSize: string;
    fontFamily: string;
    Theme: string;
    lineSpacing: string;
  }>
) {
  const res = await fetch(`${BASE_URL}/api/setting/update-setting`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      ...updatedFields,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update setting");
  }

  return await res.json();
}

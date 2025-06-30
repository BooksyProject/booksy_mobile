import { SettingResponseDTO } from "@/dtos/SettingDTO";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
export async function updateSetting(
  userId: string | null,
  updatedFields: Partial<{
    fontSize: boolean;
    fontFamily: string;
    Theme: boolean;
    lineSpacing: number;
  }>
) {
  const res = await fetch(`${BASE_URL}/setting/update-setting`, {
    method: "PATCH",
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

export async function getSettingByUserId(
  userId: string
): Promise<SettingResponseDTO> {
  try {
    const response = await fetch(
      `${BASE_URL}/setting/get-my-setting?userId=${userId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch setting");
    }

    const data = await response.json();
    return data as SettingResponseDTO;
  } catch (error: any) {
    console.error("Error fetching setting:", error.message);
    throw error;
  }
}

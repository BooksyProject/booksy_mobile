const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export async function sendOTP(phoneNumber: string) {
  try {
    const response = await fetch(`${BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });
    if (!response.ok) {
      throw new Error("Error send otp");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to send otp:", error);
    throw error;
  }
}

export async function verifyOTP(phoneNumber: string, code: string) {
  try {
    const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, code }),
    });
    if (!response.ok) {
      throw new Error("Error verify otp");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to verify otp:", error);
    throw error;
  }
}

export async function resetPassword(phoneNumber: string, newPassword: string) {
  try {
    const response = await fetch(`${BASE_URL}/auth/forget-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, newPassword }),
    });
    if (!response.ok) {
      throw new Error("Error set new password");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed set new password:", error);
    throw error;
  }
}

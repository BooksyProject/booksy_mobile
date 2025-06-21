import { UserLoginDTO } from "@/dtos/UserDTO";
import { UserRegisterDTO } from "@/dtos/UserDTO";
// import { UpdateUserDTO } from "@/dtos/UserDTO";
import { UserResponseDTO } from "@/dtos/UserDTO";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export async function fetchUsers(): Promise<UserResponseDTO[]> {
  try {
    const response = await fetch(`${BASE_URL}/user/all`);
    if (!response.ok) {
      throw new Error("Error fetching users");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
}

export async function register(
  userData: UserRegisterDTO
): Promise<UserResponseDTO> {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error registering user");
    }
    const newUser = await response.json();
    return newUser;
  } catch (error) {
    console.error("Failed to register user:", error);
    throw error;
  }
}

export async function login(userData: UserLoginDTO) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function getMyProfile(id: string | null) {
  try {
    const response = await fetch(
      `${BASE_URL}/user/get-my-profile?userId=${id}`
    );

    if (!response.ok) {
      throw new Error("Error fetching users");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
}

export async function getMyPosts(id: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/get-my-posts?userId=${id}`);
    if (!response.ok) {
      throw new Error("Error fetching posts");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

export async function uploadAvatar(formData: any, token: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/upload-avatar`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error upload avatar");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to upload avatar", err);
  }
}

// export async function updateInfo(params: UpdateUserDTO, token: string | null) {
//   try {
//     const response = await fetch(`${BASE_URL}/user/update`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `${token}`,
//       },
//       body: JSON.stringify(params),
//     });

//     if (!response.ok) {
//       throw new Error("Error update bio");
//     }

//     const data = await response.json();
//     return data;
//   } catch (err) {
//     console.error("Failed to update bio", err);
//   }
// }

export async function getMyLikedPosts(id: string | null) {
  try {
    const response = await fetch(
      `${BASE_URL}/user/get-my-liked-posts?userId=${id}`
    );

    if (!response.ok) {
      throw new Error("Error fetching posts");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string
) {
  try {
    const response = await fetch(`${BASE_URL}/user/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error change password");
    }
    const newUser = await response.json();
    return newUser;
  } catch (error) {
    console.error("Failed to change password:", error);
    throw error;
  }
}

export async function findUserByPhoneNumber(phoneNumber: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/user/get-user-by-phone-number?phoneNumber=${phoneNumber}`
    );
    if (!response.ok) {
      throw new Error("Error fetching user");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
}

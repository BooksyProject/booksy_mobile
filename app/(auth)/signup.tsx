// ✅ SignUp.tsx
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../../styles/colors";
import { useRouter } from "expo-router";
import { register } from "@/lib/service/user.service";
import { useTheme } from "@/contexts/ThemeContext";
import SignUpSteps from "@/components/form/user/SignUpStep";
import { sendOTP, verifyOTP } from "@/lib/service/auth.service";
import OTPModal from "@/components/form/user/OTP";

const SignUp = () => {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);

  const handleOtpSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const verifyResult = await verifyOTP(phoneNumber, otp);
      if (!verifyResult.success) {
        setErrorMessage("Invalid or expired OTP.");
        return;
      }

      const userData = {
        firstName,
        lastName,
        username,
        phoneNumber,
        email,
        password,
        rePassword: confirmPassword,
        gender: gender === "male",
      };

      try {
        const newUser = await register(userData);
        if (newUser) {
          setSuccessMessage("Registration successful! Please log in.");
          setFirstName("");
          setLastName("");
          setUsername("");
          setEmail("");
          setPhoneNumber("");
          setGender("");
          setPassword("");
          setConfirmPassword("");
          setIsOtpStep(false);
          router.push("signin" as any);
        } else {
          setErrorMessage("Registration failed!");
        }
      } catch (error: any) {
        console.error("Error during registration:", error);
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    } catch (error: any) {
      console.error("Error during OTP verification:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  const handleOtpRequest = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");

    try {
      const otpResponse = await sendOTP(phoneNumber);
      setGeneratedOtp(otpResponse.otp);
      setIsOtpStep(true);
    } catch (error: any) {
      console.error("Error during OTP request:", error);
      setErrorMessage(error.message || "Failed to send OTP.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        className="w-full h-full"
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor:
            colorScheme === "dark" ? colors.dark[200] : colors.light[200],
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="w-full px-7"
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View className="w-full space-y-10">
            <Text
              className="font-msemibold mb-5 text-[36px] text-center"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
            >
              Sign Up
            </Text>

            <SignUpSteps
              step={step}
              colorScheme={colorScheme}
              data={{
                firstName,
                lastName,
                username,
                email,
                phoneNumber,
                gender,
                password,
                confirmPassword,
              }}
              setters={{
                setFirstName,
                setLastName,
                setUsername,
                setEmail,
                setPhoneNumber,
                setGender,
                setPassword,
                setConfirmPassword,
                setStep,
              }}
              onRegisterPress={handleOtpRequest}
            />
            <View className="mt-4 mb-10 w-full flex flex-row items-center justify-center">
              <Text
                className="font-mregular text-[16px]  "
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                Already have an account?{" "}
                <Text
                  onPress={() => router.push("signin" as any)}
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[100],
                  }}
                  className="font-mbold  text-[16px] "
                >
                  Login
                </Text>
              </Text>
            </View>

            <OTPModal
              visible={isOtpStep}
              onClose={() => setIsOtpStep(false)}
              onSubmit={handleOtpSubmit}
              otp={otp}
              setOtp={setOtp}
            />
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;

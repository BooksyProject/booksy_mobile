import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { colors } from "@/styles/colors";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

interface Props {
  step: number;
  colorScheme: "light" | "dark";
  data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    gender: string;
    password: string;
    confirmPassword: string;
  };
  setters: {
    setFirstName: (v: string) => void;
    setLastName: (v: string) => void;
    setUsername: (v: string) => void;
    setEmail: (v: string) => void;
    setPhoneNumber: (v: string) => void;
    setGender: (v: string) => void;
    setPassword: (v: string) => void;
    setConfirmPassword: (v: string) => void;
    setStep: (v: number) => void;
  };
  onRegisterPress: () => void;
}

const SignUpSteps: React.FC<Props> = ({
  step,
  colorScheme,
  data,
  setters,
  onRegisterPress,
}) => {
  const {
    firstName,
    lastName,
    username,
    email,
    phoneNumber,
    gender,
    password,
    confirmPassword,
  } = data;

  const {
    setFirstName,
    setLastName,
    setUsername,
    setEmail,
    setPhoneNumber,
    setGender,
    setPassword,
    setConfirmPassword,
    setStep,
  } = setters;

  switch (step) {
    case 1:
      return (
        <View className="flex flex-col space-y-8 w-full" style={{ gap: 20 }}>
          <View className="relative w-full">
            <View
              className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[200] : colors.light[200], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
            >
              <Text
                className="font-mregular text-[12px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                First Name <Text style={{ color: "red" }}>*</Text>
              </Text>
            </View>

            <Input
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
              fontFamily="Montserrat-Regular"
              height={56}
            />
          </View>
          <View className="relative w-full">
            <View
              className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[200] : colors.light[200], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
            >
              <Text
                className="font-mregular text-[12px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                Last Name <Text style={{ color: "red" }}>*</Text>
              </Text>
            </View>

            <Input
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
              fontFamily="Montserrat-Regular"
              height={56}
            />
          </View>
          <View className="relative">
            <View
              className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[200] : colors.light[200],
                flex: 1,
              }}
            >
              <Text
                className="font-mregular text-[12px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                Phone Number <Text style={{ color: "red" }}>*</Text>
              </Text>
            </View>

            {/* Input */}
            <Input
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Phone Number"
              fontFamily="Montserrat-Regular"
              height={56}
              fontSize={14}
              style={{ zIndex: 1 }} // Đảm bảo input có z-index thấp hơn nhãn
            />
          </View>
          <View className="relative mb-8">
            <View
              className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[200] : colors.light[200], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
            >
              <Text
                className="font-mregular text-[12px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                Email <Text style={{ color: "red" }}>*</Text>
              </Text>
            </View>

            {/* Input */}
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Email@gmail.com"
              fontFamily="Montserrat-Regular"
              height={56}
            />
          </View>
          <Button
            title="Next"
            onPress={() => setStep(2)}
            fontColor={
              colorScheme === "dark" ? colors.dark[100] : colors.light[200]
            }
          />
        </View>
      );
    case 2:
      return (
        <View className="w-full space-y-10" style={{ gap: 20 }}>
          <View className="mb-3">
            <Text className="mb-1 text-sm ">
              Gender <Text style={{ color: "red" }}>*</Text>
            </Text>
            <Picker selectedValue={gender} onValueChange={setGender}>
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>

          <View className="relative w-full">
            <View
              className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[200] : colors.light[200], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
            >
              <Text
                className="font-mregular text-[12px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                Username <Text style={{ color: "red" }}>*</Text>
              </Text>
            </View>

            <Input
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              fontFamily="Montserrat-Regular"
              height={56}
            />
          </View>

          <Button
            title="Next"
            onPress={() => setStep(3)}
            fontColor={
              colorScheme === "dark" ? colors.dark[100] : colors.light[200]
            }
          />
        </View>
      );
    case 3:
      return (
        <View className="w-full space-y-8" style={{ gap: 20 }}>
          <View className="relative w-full">
            <View
              className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[200] : colors.light[200], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
            >
              <Text
                className="font-mregular text-[12px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                Password <Text style={{ color: "red" }}>*</Text>
              </Text>
            </View>

            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              fontFamily="Montserrat-Regular"
              height={56}
            />
          </View>
          <View className="relative w-full mb-8">
            {/* Nhãn (Label) */}
            <View
              className="absolute left-3 -top-2  flex flex-row items-center px-1 z-10"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[200] : colors.light[200],
                flex: 1,
              }}
            >
              <Text
                className="font-mregular text-[12px]"
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
              >
                Confirm password <Text style={{ color: "red" }}>*</Text>
              </Text>
            </View>

            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              fontFamily="Montserrat-Regular"
              height={56}
            />
          </View>

          <Button
            title="Register"
            onPress={onRegisterPress}
            fontColor={
              colorScheme === "dark" ? colors.dark[100] : colors.light[200]
            }
          />
        </View>
      );

    default:
      return null;
  }
};

export default SignUpSteps;

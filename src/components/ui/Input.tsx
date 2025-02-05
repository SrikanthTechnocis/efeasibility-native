import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface CustomTextInputProps extends TextInputProps {
  label: string;
  error?: boolean;
  errorText?: string;
}

const Input: React.FC<CustomTextInputProps> = ({
  label,
  className,
  error,
  errorText,
  ...props
}) => {
  return (
    <View className="m-2">
      {label && <Text className="label">{label}</Text>}
      <TextInput className="input" {...props} />
      {error && <Text className="text-sm text-red-500">{errorText}</Text>}
    </View>
  );
};

export default Input;

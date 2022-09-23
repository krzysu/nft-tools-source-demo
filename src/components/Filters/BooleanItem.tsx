import React, { FC } from "react";
import {
  FormControl,
  FormControlProps,
  FormLabel,
  Switch,
} from "@chakra-ui/react";

type Props = {
  isChecked: boolean;
  value: string;
  onValueChange: (newValue?: "1") => void;
  label: string;
};

export const BooleanItem: FC<FormControlProps & Props> = ({
  isChecked,
  value,
  onValueChange,
  label,
  ...rest
}) => {
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    onValueChange(event.currentTarget.checked ? "1" : undefined);
  };

  return (
    <FormControl
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      {...rest}
    >
      <FormLabel htmlFor={value} mb="0">
        {label}
      </FormLabel>
      <Switch
        id={value}
        value={value}
        isChecked={isChecked}
        onChange={handleChange}
        size="lg"
      />
    </FormControl>
  );
};

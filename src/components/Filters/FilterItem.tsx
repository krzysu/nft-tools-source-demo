import React, { FC } from "react";
import {
  Select,
  FormControl,
  FormControlProps,
  FormLabel,
  useColorModeValue,
} from "@chakra-ui/react";

type Item = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  onValueChange: (newValue: any) => void;
  label: string;
  items: Item[];
  isActive?: boolean;
};

export const FilterItem: FC<Props & FormControlProps> = ({
  value,
  onValueChange,
  label,
  items,
  isActive = false,
  ...rest
}) => {
  const activeColor = useColorModeValue("blue.800", "blue.200");
  return (
    <FormControl {...rest}>
      <FormLabel htmlFor={label} mb="1">
        {label}
      </FormLabel>
      <Select
        id={label}
        onChange={(e) => onValueChange(e.target.value)}
        value={value}
        borderColor={isActive ? activeColor : undefined}
      >
        {items.map((item) => (
          <option key={item.label} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

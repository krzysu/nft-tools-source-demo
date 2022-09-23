import React, { FC } from "react";
import {
  Input,
  InputProps,
  Flex,
  FormControl,
  FormControlProps,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import { DEFAULT_RANGE_FILTER_VALUE } from "../../helpers/filters";

const MyInput = (props: InputProps) => (
  <Input size="md" type="number" min="0" {...props} />
);

type Props = {
  value?: string;
  onValueChange: (newValue?: string) => void;
  label: string;
};

export const RangeFilterItem: FC<Props & FormControlProps> = ({
  value,
  onValueChange,
  label,
  ...rest
}) => {
  const tempValue =
    value && typeof value === "string"
      ? value.split("-")
      : DEFAULT_RANGE_FILTER_VALUE;

  const handleChange =
    (index: number) => (event: React.FormEvent<HTMLInputElement>) => {
      const newValueArray = [...tempValue];
      newValueArray[index] = event.currentTarget.value;
      const newValue = newValueArray.join("-");

      onValueChange(newValue.length > 1 ? newValue : undefined);
    };

  return (
    <FormControl {...rest}>
      <FormLabel htmlFor={label} mb="1">
        {label}
      </FormLabel>
      <Flex justifyContent="space-between" alignItems="center">
        <MyInput
          placeholder="from"
          value={tempValue[0]}
          onChange={handleChange(0)}
        />
        <Text fontWeight="bold" mx="4">
          -
        </Text>
        <MyInput
          placeholder="to"
          value={tempValue[1]}
          onChange={handleChange(1)}
        />
      </Flex>
    </FormControl>
  );
};

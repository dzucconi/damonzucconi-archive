import React from "react";
import { Stack, Cell, StackProps } from "@auspices/eos";

type NavigationProps = StackProps;

export const Navigation: React.FC<NavigationProps> = ({ ...rest }) => {
  return (
    <Stack
      direction={["vertical", "horizontal"]}
      justifyContent="center"
      textAlign="center"
      {...rest}
    >
      <Cell>not everything</Cell>
      <Cell>mostly everything</Cell>
      <Cell>only websites</Cell>
      <Cell>other information</Cell>
      <Cell>retail</Cell>
    </Stack>
  );
};

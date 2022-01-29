import React from "react";
import { Stack, Cell, StackProps, Box, themeGet, color } from "@auspices/eos";
import styled from "styled-components";

type NavigationProps = StackProps;

export const Navigation: React.FC<NavigationProps> = ({ ...rest }) => {
  return (
    <Container
      position="fixed"
      top={5}
      left={5}
      zIndex={1}
      display="none"
      {...rest}
    >
      <Stack
        direction={["vertical", "vertical", "horizontal"]}
        justifyContent="center"
        textAlign="center"
      >
        <NavigationCell>not everything</NavigationCell>
        <NavigationCell>mostly everything</NavigationCell>
        <NavigationCell>only websites</NavigationCell>
        <NavigationCell>other information</NavigationCell>
        <NavigationCell>retail</NavigationCell>
      </Stack>
    </Container>
  );
};

const NavigationCell = styled(Cell)``;

NavigationCell.defaultProps = {
  fontSize: 1,
  px: 3,
  py: 2,
  bg: "transparent",
};

const Container = styled(Box)`
  backdrop-filter: blur(${themeGet("space.3")});
  background-color: ${color("background", 0.25)};
`;

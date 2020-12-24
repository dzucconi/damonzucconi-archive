import React from "react";
import styled from "styled-components";
import { Grid, GridProps } from "../core/Grid";

type ThumbnailsProps = GridProps;

export const Thumbnails = styled(Grid)<ThumbnailsProps>``;

Thumbnails.defaultProps = {
  gridTemplateColumns: ["repeat(2, 1fr)", "repeat(4, 1fr)", "repeat(6, 1fr)"],
  gridColumnGap: 3,
  gridRowGap: 5,
};

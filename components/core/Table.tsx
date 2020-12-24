import { themeGet } from "@styled-system/theme-get";
import { boxMixin, BoxProps } from "@auspices/eos";
import styled from "styled-components";

export const Table = styled.table<BoxProps>`
  width: 100%;
  border: 1px solid ${themeGet("primary")};
  border-collapse: collapse;
  ${boxMixin}

  tr > th {
    text-align: left;
    font-weight: normal;
  }

  tr > th,
  tr > td {
    border-bottom: 1px solid ${themeGet("primary")};
    border-left: 1px solid ${themeGet("primary")};
  }

  tr > th:first-of-type,
  tr > td:first-of-type {
    border-left: 0;
  }

  tr:last-of-type > td {
    border-bottom: 0;
  }
`;

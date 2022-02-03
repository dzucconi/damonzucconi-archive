import { Box, Spinner as _Spinner } from "@auspices/eos";
import { FC } from "react";

export const Spinner: FC = () => {
  return (
    <Box position="fixed" top={0} left={0} bottom={0} right={0} display="flex">
      <_Spinner m="auto" />
    </Box>
  );
};

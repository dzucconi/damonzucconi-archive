"use client";

import Link from "next/link";
import { Box, Stack, Tag } from "@auspices/eos/client";
import { ClientDemo } from "./client-demo";

export default function AppRouterPage() {
  return (
    <Box p={6}>
      <Stack spacing={3}>
        <Tag>next: app router enabled</Tag>
        <Tag>eos: client/server entrypoints in use</Tag>
        <Tag>styled-components: app router registry configured</Tag>
        <Link href="/">Return to current pages-router site</Link>
      </Stack>
      <ClientDemo />
    </Box>
  );
}

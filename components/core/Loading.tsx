import { FC } from "react";
import { Meta } from "./Meta";
import { Spinner } from "./Spinner";

export const Loading: FC = () => {
  return (
    <>
      <Meta title="Loading" />

      <Spinner />
    </>
  );
};

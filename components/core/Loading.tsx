import { FC } from "react";
import { Meta } from "./Meta";
import { Spinner } from "./Spinner";

type LoadingProps = {
  title?: string;
};

export const Loading: FC<LoadingProps> = ({ title = "Loading" }) => {
  return (
    <>
      <Meta title={title} />

      <Spinner />
    </>
  );
};

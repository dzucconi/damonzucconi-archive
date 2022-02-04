import { Button, ButtonProps } from "@auspices/eos";
import { useRouter } from "next/router";
import { FC } from "react";

export const Back: FC<ButtonProps> = (props) => {
  const router = useRouter();

  const handleClick = () => {
    if (window.history.state.idx === 0) {
      router.push("/");
      return;
    }

    router.back();
  };

  return (
    <Button fontSize={1} px={3} py={2} onClick={handleClick} {...props}>
      ←
    </Button>
  );
};

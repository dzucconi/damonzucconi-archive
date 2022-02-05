import { Button, ButtonProps } from "@auspices/eos";
import { useRouter } from "next/router";
import { FC } from "react";

type BackProps = ButtonProps & {
  href?: string;
};

export const Back: FC<BackProps> = ({ href = "/", ...rest }) => {
  const router = useRouter();

  const handleClick = () => {
    if (window.history.state.idx === 0) {
      router.push(href);
      return;
    }

    router.back();
  };

  return (
    <Button fontSize={1} px={3} py={2} onClick={handleClick} {...rest}>
      ←
    </Button>
  );
};

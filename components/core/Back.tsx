import { Button, ButtonProps } from "@auspices/eos";
import { useRouter } from "next/router";
import { FC } from "react";
import { useHistory } from "../../lib/useHistory";

type BackProps = ButtonProps & {
  href?: string;
};

export const Back: FC<BackProps> = ({ href = "/", ...rest }) => {
  const router = useRouter();

  const { history } = useHistory();

  const handleClick = () => {
    if (history.length === 1) {
      router.push(href);
      return;
    }

    router.back();
  };

  return (
    <Button variant="small" onClick={handleClick} aria-label="Back" {...rest}>
      ←
    </Button>
  );
};

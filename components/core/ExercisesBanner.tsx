import { Banner, Clickable } from "@auspices/eos";
import { FC, useEffect, useState } from "react";
import { randomTriplet } from "../../lib/exercises";

export const ExercisesBanner: FC = () => {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    setText(randomTriplet());
  }, []);

  return (
    <Banner bg="external">
      {(
        <>
          {text}{" "}
          <Clickable
            textDecoration="underline"
            cursor="pointer"
            fontSize={1}
            color="currentColor"
            onClick={() => {
              setText(randomTriplet());
            }}
          >
            OK?
          </Clickable>
        </>
      ) || <>&nbsp;</>}
    </Banner>
  );
};

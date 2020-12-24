import { styleFn } from "styled-system";

export const splitProps = <T>(mixin: styleFn) => {
  const re = new RegExp(`^(${mixin.propNames?.join("|")})$`);

  return <U>(props: U): [T, Omit<U, keyof T>] => {
    const leftProps = {} as T;
    const rightProps = {} as Omit<U, keyof T>;

    for (const key of Object.keys(props)) {
      if (re.test(key)) {
        // @ts-ignore
        leftProps[key] = props[key];
        continue;
      }

      // @ts-ignore
      rightProps[key] = props[key];
    }

    return [leftProps, rightProps];
  };
};

import type { ShadowVar } from '../cssVariables.ts';
import { cssVar } from '../cssVariables.ts';

export type ShadowProps = {
  shadow?: ShadowVar;
};

export const getShadowStyles = ({ shadow }: ShadowProps) => ({
  boxShadow: shadow && cssVar(`shadow-${shadow}`),
});

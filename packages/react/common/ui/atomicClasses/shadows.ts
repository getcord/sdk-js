import type { ShadowVar } from '../cssVariables';
import { cssVar } from '../cssVariables';

export type ShadowProps = {
  shadow?: ShadowVar;
};

export const getShadowStyles = ({ shadow }: ShadowProps) => ({
  boxShadow: shadow && cssVar(`shadow-${shadow}`),
});

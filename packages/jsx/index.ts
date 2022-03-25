import { DetailedHTMLProps, HTMLAttributes } from 'react';
import {
  componentAttributes,
  componentNames,
  ElementName,
} from 'opensource/cord-sdk/packages/components';

// This lets us return custom elements in React tsx code, with typed props
type CordComponentReactInterface<T extends string> = DetailedHTMLProps<
  HTMLAttributes<HTMLElement> & { [P in T]?: string } & { class?: string },
  HTMLElement
>;

type AttributeNames = {
  [N in ElementName]: keyof typeof componentAttributes[typeof componentNames[N]];
};

type CordElements = {
  [N in ElementName]: CordComponentReactInterface<AttributeNames[N]>;
};

declare global {
  namespace JSX {
    interface IntrinsicElements extends CordElements {}
  }
}

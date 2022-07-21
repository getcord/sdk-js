import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { Location, AnnotationHandler, ICordSDK } from '@cord-sdk/types';
import {
  CORD_ANNOTATION_LOCATION_DATA_ATTRIBUTE,
  locationJson,
} from '@cord-sdk/types';
import { useCordContext } from '../contexts/CordContext';

function useAnnotationHandler<
  L extends Location,
  T extends keyof AnnotationHandler,
>(
  sdk: ICordSDK | null,
  type: T,
  locationString: string,
  callback: AnnotationHandler<L>[T] | undefined,
) {
  useEffect(() => {
    if (!callback || !sdk) {
      return;
    }

    sdk.annotations.setAnnotationHandler(type, locationString, callback);
    return () => {
      sdk.annotations.setAnnotationHandler(type, locationString, null);
    };
  }, [sdk, type, locationString, callback]);
}

const doNothing = () => {};

export function useCordAnnotationRenderer<L extends Location = {}>(
  location: Partial<L>,
  handler: AnnotationHandler<L>['getAnnotationPosition'],
): { redrawAnnotations: () => void } {
  const { sdk } = useCordContext('useCordAnnotationRenderer');

  useAnnotationHandler(
    sdk,
    'getAnnotationPosition',
    locationJson(location),
    handler,
  );

  return {
    redrawAnnotations: sdk?.annotations.redrawAnnotations ?? doNothing,
  };
}

export function useCordAnnotationCaptureHandler<L extends Location = {}>(
  location: Partial<L>,
  handler: AnnotationHandler<L>['onAnnotationCapture'],
) {
  const { sdk } = useCordContext('useCordAnnotationCaptureHandler');
  useAnnotationHandler(
    sdk,
    'onAnnotationCapture',
    locationJson(location),
    handler,
  );
}

export function useCordAnnotationClickHandler<L extends Location = {}>(
  location: Partial<L>,
  handler: AnnotationHandler<L>['onAnnotationClick'],
) {
  const { sdk } = useCordContext('useCordAnnotationClickHandler');
  useAnnotationHandler(
    sdk,
    'onAnnotationClick',
    locationJson(location),
    handler,
  );
}

function useRefWithUpdateBehaviour<E extends HTMLElement>(
  callback: (element: E | null) => unknown,
  cleanup?: (element: E | null) => unknown,
): React.MutableRefObject<E | null> {
  const elementRef = useRef<E | null>(null);

  return useMemo(
    () => ({
      get current() {
        return elementRef.current;
      },
      set current(value) {
        if (elementRef.current !== value) {
          cleanup?.(elementRef.current);
          elementRef.current = value;
          callback(value);
        }
      },
    }),
    [callback, cleanup],
  );
}

export function useCordAnnotationTargetRef<
  E extends HTMLElement,
  L extends Location = {},
>(location: Partial<L>) {
  const locationString = locationJson(location);

  const setCordLocationAttribute = useCallback(
    (element: E | null) => {
      element?.setAttribute(
        CORD_ANNOTATION_LOCATION_DATA_ATTRIBUTE,
        locationString,
      );
    },
    [locationString],
  );

  const removeCordLocationAttribute = useCallback((element: E | null) => {
    element?.removeAttribute(CORD_ANNOTATION_LOCATION_DATA_ATTRIBUTE);
  }, []);

  return useRefWithUpdateBehaviour<E>(
    setCordLocationAttribute,
    removeCordLocationAttribute,
  );
}

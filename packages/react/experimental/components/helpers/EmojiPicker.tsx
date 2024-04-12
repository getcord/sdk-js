import * as React from 'react';
import { useCallback, useState, forwardRef, useRef, useEffect } from 'react';
import withCord from '../hoc/withCord.js';
import { useComposedRefs } from '../../../common/lib/composeRefs.js';
import { useCordTranslation } from '../../../index.js';
import classes from '../../../components/helpers/EmojiPicker.css.js';
import { WithPopper } from './WithPopper.js';

type EmojiEvent = {
  detail: {
    unicode: string; // The actual emoji, e.g. 😀
    skinTone: number;
    emoji: {
      emoticon: string; // The text version, e.g. ":D"
      annotation: string; // Description, e.g. "grinning face"
    };
  };
};

type EmojiButtonRef = {
  /**
   * The emoji to use for the skin tone picker
   */
  skinToneEmoji: string;
  /**
   * URL to fetch the emoji data from.
   */
  dataSource: string;
  // https://www.npmjs.com/package/emoji-picker-element#internationalization
  i18n?: Record<string, unknown>;
} & HTMLDivElement;

export type EmojiPickerProps = {
  onClose: () => void;
  onClickEmoji: (emoji: string) => void;
};

export const EmojiPicker = withCord<React.PropsWithChildren<EmojiPickerProps>>(
  forwardRef(function EmojiPicker(
    props: EmojiPickerProps,
    ref?: React.ForwardedRef<HTMLDivElement>,
  ) {
    const innerRef = useRef<EmojiButtonRef | null>(null);
    const { i18n } = useCordTranslation();

    const composedRefs = useComposedRefs(ref, innerRef);
    const addEmoji = useCallback(
      (event: any) => {
        const {
          detail: { unicode: emoji },
        } = event as EmojiEvent;
        props.onClose();
        props.onClickEmoji(emoji);
      },
      [props],
    );

    useEffect(
      () => innerRef.current?.shadowRoot?.getElementById('search')?.focus(),
      [],
    );

    const handleClick = useCallback((event: MouseEvent) => {
      event.stopPropagation();
    }, []);

    useEffect(() => {
      if (!innerRef.current) {
        return;
      }

      const { current } = innerRef;

      // Serve emoji data from our own domain, so that clients CSP
      // won't block the request.
      innerRef.current.dataSource = `https://app.cord.com/static/emoji-data.json`;

      innerRef.current.i18n =
        i18n.getResourceBundle(i18n.language, 'emoji_picker') ??
        i18n.getResourceBundle('en', 'emoji_picker');

      current.addEventListener('emoji-click', addEmoji);

      current.addEventListener('click', handleClick);

      return () => {
        current.removeEventListener('emoji-click', addEmoji);
        current.removeEventListener('click', handleClick);
      };
    }, [addEmoji, composedRefs, handleClick, i18n, props]);

    return React.createElement('emoji-picker', {
      ref: composedRefs,
      class: `light ${classes.emojiPicker}`,
    });
  }),
  'EmojiPicker',
);

function isClient() {
  return typeof window !== 'undefined';
}

void (async () => {
  if (isClient()) {
    await import('emoji-picker-element');
  }
})();

async function hasIDB() {
  if (typeof indexedDB === 'undefined') {
    return false;
  }

  try {
    const idbFailed = await new Promise((resolve) => {
      const db = indexedDB.open('test-idb');
      db.onerror = () => resolve(true);
      db.onsuccess = () => {
        indexedDB.deleteDatabase('test-idb');
        resolve(false);
      };
    });
    if (idbFailed) {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
}

async function polyfillIDB() {
  // @ts-ignore the fact that we don't have types;
  const fakeIndexedDB = await import('fake-indexeddb');
  // @ts-ignore the fact that we don't have types;
  const fakeIDBKeyRange = await import('fake-indexeddb/lib/FDBKeyRange.js');

  // Can't override the indexedDB global, but we can monkey-patch it
  const IDBFactoryFnToOverride: Array<keyof IDBFactory> = [
    'open',
    'deleteDatabase',
  ];
  for (const fn of IDBFactoryFnToOverride) {
    indexedDB[fn] = fakeIndexedDB[fn].bind(fakeIndexedDB);
  }
  const IDBKeyRangeFnToOverride: Array<keyof typeof IDBKeyRange> = [
    'bound',
    'lowerBound',
    'upperBound',
    'only',
  ];
  for (const func of IDBKeyRangeFnToOverride) {
    IDBKeyRange[func] = fakeIDBKeyRange[func].bind(fakeIDBKeyRange);
  }
}

void (async () => {
  if (isClient() && !(await hasIDB())) {
    await polyfillIDB();
  }
})();

/**
 * Create an EmojiButton which when clicked opens the emoji picker popper.
 * @param emojiButton The button you want to render in the UI. Clicking this will open the emoji picker popper.
 * @param onClickEmoji Callback to handle users clicking an emoji
 * @example
 * const EmojiPicker = useEmojiPicker(<Button><SmileyIcon /></Button>, (emoji) => console.log(emoji));
 * return (<MyApp>
 *          <MyOtherComponent />
 *          {EmojiPicker}
 *         </MyApp>
 */
export function useEmojiPicker(
  emojiButton: React.ReactNode,
  onClickEmoji: (emoji: string) => void,
) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const closeEmojiPicker = useCallback(() => setShowEmojiPicker(false), []);

  return {
    EmojiPicker: (
      <WithPopper
        popperElement={
          <EmojiPicker
            onClose={closeEmojiPicker}
            onClickEmoji={onClickEmoji}
            canBeReplaced
          />
        }
        popperElementVisible={showEmojiPicker}
        popperPosition="bottom-end"
        onShouldHide={closeEmojiPicker}
        onClick={(event) => {
          event.stopPropagation();
          setShowEmojiPicker(!showEmojiPicker);
        }}
        withBlockingOverlay={true}
      >
        {emojiButton}
      </WithPopper>
    ),
    emojiPickerVisible: showEmojiPicker,
  };
}

import type { ClientUserData } from '@cord-sdk/types';
import type { CSSProperties } from 'react';
import * as React from 'react';
import { useMemo, useState, useCallback } from 'react';
import type { Editor } from 'slate';
import { Range, Node, Text } from 'slate';
import { ReactEditor } from 'slate-react';
import { userReferenceSuggestionsMenu } from '../../../components/Composer.classnames.js';
import { useCordTranslation } from '../../../index.js';
import { Avatar } from '../Avatar.js';
import { Menu } from '../menu/Menu.js';
import { MenuItem } from '../menu/MenuItem.js';
import { useSearchUsers, useViewerData } from '../../../hooks/user.js';
import { EditorCommands } from '../../../canary/composer/lib/commands.js';
import {
  getUserReferenceSearchParameters,
  withUserReferences,
} from '../../../canary/composer/lib/userReferences.js';
import { Keys } from '../../../common/const/Keys.js';
import { isUserReferenceNode } from '../../../canary/composer/lib/util.js';

const ROW_HEIGHT = 40;
const MAX_ROWS_TO_SHOW = 5;

export function useMentionList({
  editor: originalEditor,
  groupID,
}: {
  editor: Editor;
  groupID: string | undefined;
}) {
  const [editor] = useState(() => withUserReferences(originalEditor));
  const viewer = useViewerData();
  const searchResults = useSearchUsers({
    searchQuery: getSearchQuery(editor),
    groupID,
    skip: !groupID,
  });
  const { usersToShow: users } = getUserReferenceSuggestions({
    allUsers: searchResults?.users ?? [],
    excludedIDs: [],
    maxCount: 40,
    visitors: [],
    currUser: viewer,
  });
  const [userReferenceRange, setUserReferenceRange] = useState<Range>();
  const [selectedUserReferenceIndex, setSelectedUserReferenceIndex] =
    useState(0);

  const selectNext = useCallback(() => {
    setSelectedUserReferenceIndex((prev) => (prev + 1) % users.length);
  }, [users.length]);

  const selectPrev = useCallback(() => {
    setSelectedUserReferenceIndex(
      (prev) => (users.length + prev - 1) % users.length,
    );
  }, [users.length]);

  const closeUserReferences = useCallback(() => {
    setUserReferenceRange(undefined);
    setSelectedUserReferenceIndex(0);
  }, []);

  const insertUserReference = useCallback(() => {
    const user = users[selectedUserReferenceIndex];
    if (userReferenceRange) {
      EditorCommands.replaceRangeWithUserReference(
        editor,
        userReferenceRange,
        user,
      );
      setUserReferenceRange(undefined);
      editor.insertText(' ');
      console.log(editor);
      ReactEditor.focus(editor);
    }
  }, [users, selectedUserReferenceIndex, userReferenceRange, editor]);

  const updateUserReferences = useCallback(() => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const userReferenceSearchParameters =
        getUserReferenceSearchParameters(editor);
      if (userReferenceSearchParameters) {
        setUserReferenceRange(userReferenceSearchParameters.range);
        setSelectedUserReferenceIndex(0);
      } else {
        closeUserReferences();
      }
    }
  }, [closeUserReferences, editor]);

  const isOpen = Boolean(
    userReferenceRange &&
      searchResults?.users &&
      searchResults.users?.length > 0,
  );

  /**
   * Returns `true` if the event was handled. Useful to e.g.
   * prevent other handlers from running.
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isOpen) {
        return false;
      }

      switch (event.key) {
        case Keys.ARROW_DOWN: {
          event.preventDefault();
          selectNext();

          return true;
        }

        case Keys.ARROW_UP: {
          event.preventDefault();
          selectPrev();

          return true;
        }

        case Keys.TAB:
        case Keys.ENTER: {
          event.preventDefault();
          insertUserReference();

          return true;
        }

        case Keys.ESCAPE: {
          event.preventDefault();
          close();

          return true;
        }

        case Keys.SPACEBAR: {
          if (searchResults?.users.length === 1) {
            event.preventDefault();
            insertUserReference();

            return true;
          }
          return false;
        }

        default:
          return false;
      }
    },
    [
      searchResults?.users.length,
      insertUserReference,
      isOpen,
      selectNext,
      selectPrev,
    ],
  );

  return {
    Component: (
      <MentionList
        key={users.length}
        users={users}
        selectedIndex={selectedUserReferenceIndex}
        setUserReferenceIndex={setSelectedUserReferenceIndex}
        onSuggestionClicked={insertUserReference}
        closeMenu={closeUserReferences}
      />
    ),
    isOpen,
    updateUserReferences,
    selectNext,
    selectPrev,
    insertUserReference,
    close: closeUserReferences,
    handleKeyDown,
    editor,
  };
}

type MentionListProps = {
  users: ClientUserData[];
  selectedIndex: number;
  setUserReferenceIndex: (index: number) => void;
  onSuggestionClicked: (index: number) => void;
  closeMenu: () => void;
  unshownUserCountLine?: React.ReactElement<typeof MenuItem> | null;
};

function MentionList({
  users,
  selectedIndex,
  unshownUserCountLine,
  closeMenu,
  setUserReferenceIndex,
  onSuggestionClicked,
}: MentionListProps) {
  const userMentionRowProps: UserMentionRowProps = useMemo(
    () => ({
      users,
      selectedIndex,
      setUserReferenceIndex,
      onSuggestionClicked,
    }),
    [onSuggestionClicked, selectedIndex, setUserReferenceIndex, users],
  );

  return (
    <Menu
      canBeReplaced
      className={userReferenceSuggestionsMenu}
      items={[
        {
          name: 'mention-list',
          element: (
            <div
            // [ONI-TODO] Virtualize this list, and show all users.
            // See #8484
            >
              {users.slice(0, MAX_ROWS_TO_SHOW).map((user, i) => {
                return (
                  <UserMentionRow
                    key={user.id}
                    data={userMentionRowProps}
                    index={i}
                    style={{ height: ROW_HEIGHT }}
                  />
                );
              })}
            </div>
          ),
        },
      ]}
      closeMenu={closeMenu}
    >
      {unshownUserCountLine ?? null}
    </Menu>
  );
}

type UserMentionRowProps = Pick<
  MentionListProps,
  'setUserReferenceIndex' | 'users' | 'onSuggestionClicked' | 'selectedIndex'
>;

const UserMentionRow = React.memo(function UserMentionRow({
  data: props,
  index,
  style,
}: {
  data: UserMentionRowProps;
  index: number;
  style: CSSProperties;
}) {
  const { t } = useCordTranslation('user');
  const viewer = useViewerData();
  const { users, selectedIndex, onSuggestionClicked, setUserReferenceIndex } =
    props;

  const user = users[index];

  const fullName =
    viewer?.id === user.id
      ? t('viewer_user_subtitle', { user })
      : t('other_user_subtitle', { user });

  const viewerDisplayName = t('viewer_user', { user });
  const otherDisplayName = t('other_user', { user });
  const subtitle =
    fullName && fullName !== otherDisplayName ? fullName : undefined;

  return (
    <MenuItem
      canBeReplaced
      menuItemAction={`user-mention-${user.id}`}
      style={style}
      leftItem={<Avatar canBeReplaced userId={user.id} />}
      label={viewer?.id === user.id ? viewerDisplayName : otherDisplayName}
      subtitle={subtitle}
      onClick={(event: React.MouseEvent) => {
        event.stopPropagation();
        onSuggestionClicked(index);
      }}
      selected={selectedIndex === index}
      onMouseOver={() => setUserReferenceIndex(index)}
    />
  );
});

/**
 * returns a list of users matching the given query. We prefer
 * prefix matches over non-prefix matches, then page visitors
 * over non-visitors and finally other users over current user.
 */
const getUserReferenceSuggestions = ({
  allUsers,
  currUser,
  excludedIDs,
  maxCount,
  visitors,
}: {
  currUser: ClientUserData | null | undefined;
  allUsers: ClientUserData[];
  visitors: ClientUserData[];
  maxCount: number;
  excludedIDs: string[];
}) => {
  const visitorIDs = new Set(visitors.map((p) => p.id));

  // build a key for ordering users, e.g. BA
  const sortKey = (user: ClientUserData) =>
    (visitorIDs.has(user.id) ? 'A' : 'B') + // prefer visitors over non-visitors
    (user.id !== currUser?.id ? 'A' : 'B'); // and prefer other users over current user

  const allIncludedUsers = allUsers.filter((u) => !excludedIDs.includes(u.id));

  const usersToShow = allIncludedUsers
    .map((user) => ({ key: sortKey(user), user: user }))
    .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0))
    .map(({ user }) => user)
    .slice(0, maxCount);

  const unshownUserCount = allIncludedUsers.length - usersToShow.length;

  return { usersToShow, unshownUserCount };
};

const ALLOWED_CHARACTERS_BEFORE_REFERENCE = [' ', '\n', '('];
function getSearchQuery(editor: Editor): string | undefined {
  // 1. I should be able to type @ and see a list of *all* suggestions
  // 2. I should be able to start a message with a reference
  // 3. I should be able to type an email address without being prompted for the references
  // 4. I should be able to type a person's full name including spaces in the reference autocomplete
  // 5. I should be able to send a message with a reference that didn't match anyone
  // 6. I should be able to escape reference mode even though what I'm typing looks like a reference

  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection)) {
    // we're either not focused or in text selection mode
    return undefined;
  }
  // Don't show menu if already a user reference node
  if (isUserReferenceNode(Node.parent(editor, selection.anchor.path))) {
    return undefined;
  }

  const [currentPosition] = Range.edges(selection);
  const selectedOffset = currentPosition.offset;
  const currentNode = Node.get(editor, currentPosition.path);
  const currentText = Text.isText(currentNode) && currentNode.text;
  if (!currentText) {
    return undefined;
  }

  let userReferenceStartOffset = -1;
  const selectedCharIndex = selectedOffset - 1;

  let wordCount = 0;

  // This code is looping back from the current/cursor position in the composer, until
  // it finds the beginning of a mention (@), which it marks as the start of a
  // potential search.  The search itself is the text between that position in the
  // composer and the current/cursor position
  for (let i = selectedCharIndex; i >= 0; i--) {
    const char = currentText[i];
    const prevChar: string | undefined = currentText[i - 1];

    if (char === ' ') {
      wordCount++;
    }
    // We do allow one space, to enable searching for e.g. "James Bond", but not two.
    // Other tools allow 4-5 spaces (e.g. Slack). We could tweak this behavior.
    const twoConsecutiveSpaces = char === ' ' && prevChar === ' ';
    if (twoConsecutiveSpaces || (prevChar === '@' && char === ' ')) {
      break;
    }
    if (!prevChar || ALLOWED_CHARACTERS_BEFORE_REFERENCE.includes(prevChar)) {
      if (char === '@') {
        userReferenceStartOffset = i;
        break;
      }
    }
    // Don't keep querying on an ever-growing sentence
    if (wordCount >= 4) {
      break;
    }
  }

  if (userReferenceStartOffset < 0) {
    return undefined;
  }

  return currentText.slice(userReferenceStartOffset + 1, selectedOffset);
}

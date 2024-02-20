import type { ClientUserData } from '@cord-sdk/types/user.js';
import type { CSSProperties } from 'react';
import * as React from 'react';
import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import type { Editor } from 'slate';
import { Range } from 'slate';
import type { FixedSizeList } from 'react-window';
import { FixedSizeList as List } from 'react-window';
import { ReactEditor } from 'slate-react';
import { userReferenceSuggestionsMenu } from '../../../components/Composer.classnames.js';
import { useCordTranslation } from '../../../index.js';
import { Avatar } from '../Avatar.js';
import { Menu } from '../menu/Menu.js';
import { MenuItem } from '../menu/MenuItem.js';
import { useGroupMembers, useViewerData } from '../../../hooks/user.js';
import { EditorCommands } from '../../../canary/composer/lib/commands.js';
import { getUserReferenceSearchParameters } from '../../../canary/composer/lib/userReferences.js';
import { Keys } from '../../../common/const/Keys.js';

const ROW_HEIGHT = 40;
const MAX_ROWS_TO_SHOW = 5;

export function useMentionList({ editor }: { editor: Editor }) {
  // [ONI]-TODO Once available, use public API to filter users, rather
  // than showing all `groupMembers` in the list.
  const { groupMembers } = useGroupMembers();
  const viewer = useViewerData();
  const { usersToShow: users } = getUserReferenceSuggestions({
    allUsers: groupMembers,
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

  const isOpen = !!userReferenceRange;

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

        // [ONI]-TODO If only one available user in the mention list,
        // insert the mention.
        // case Keys.SPACEBAR: {
        // return true;
        // }

        default:
          return false;
      }
    },
    [insertUserReference, isOpen, selectNext, selectPrev],
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
  const listRef = useRef<FixedSizeList>(null);

  useEffect(() => {
    listRef.current?.scrollToItem(selectedIndex);
  }, [selectedIndex]);

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
      className={userReferenceSuggestionsMenu}
      items={[
        {
          name: 'mention-list',
          element: (
            <List
              ref={listRef}
              height={Math.min(users.length, MAX_ROWS_TO_SHOW) * ROW_HEIGHT}
              itemSize={ROW_HEIGHT}
              width="100%"
              itemCount={users.length}
              itemData={userMentionRowProps}
            >
              {UserMentionRow}
            </List>
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
      menuItemAction={`user-mention-${user.id}`}
      style={style}
      leftItem={<Avatar userId={user.id} />}
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

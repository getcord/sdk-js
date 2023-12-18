import * as React from 'react';
import cx from 'classnames';
import { useCordTranslation } from '@cord-sdk/react';
import { fontSmallLight } from '@cord-sdk/react/common/ui/atomicClasses/fonts.css';
import { editedMessageTag } from '@cord-sdk/react/components/message/EditedMessage.css';

type Props = {
  as: 'p' | 'span';
  isMessageBeingEdited: boolean;
};

export function EditedMessage({ as, isMessageBeingEdited }: Props) {
  const { t } = useCordTranslation('message');
  const displayText = isMessageBeingEdited
    ? t('editing_status')
    : t('edited_status');

  const props = {
    id: 'editing-tag',
    className: cx(fontSmallLight, editedMessageTag),
  };

  return (
    <>
      {as === 'p' ? (
        <p {...props}>{displayText}</p>
      ) : (
        <span {...props}>{' ' + displayText}</span>
      )}
    </>
  );
}

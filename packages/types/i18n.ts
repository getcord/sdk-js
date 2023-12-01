import type {} from './i18next';

// We follow a few patterns in naming to clarify the context in which a string
// will be displayed, particularly in adding suffixes to keys.  The common
// suffixes are:
// * _action - A label on a button, menu item, or the like that causes an action
//   to happen
// * _action_success - A message indicating an action succeeded
// * _action_[failure type] - A message indicating an action failed or cannot be
//   attempted
// * _status - A message indicating the status of an item
// * _placeholder - A label that shows as a placeholder in an input
// * _tooltip - A tooltip that shows on a button, menu item, or the like

// NOTE: These strings are here for documentation, but they will not be used at
// runtime.  The Cord SDK comes with a compiled-in copy of these strings which
// will be used instead.  If you want to change the value for any of these
// strings, use the `translations` configuration option as described in
// https://docs.cord.com/js-apis-and-hooks/initialization#translations.
export const resources = {
  en: {
    default: {},
    composer: {
      send_message_placeholder: 'Add a comment...',
      reply_placeholder: 'Reply...',
      mention_someone_tooltip: 'Mention someone',
      annotate_action: 'Annotate',
      replace_annotation_tooltip: 'Replace annotation',
      add_emoji_tooltip: 'Add emoji',
      remove_task_tooltip: 'Remove task',
      create_task_tooltip: 'Create task',
      attach_file_tooltip: 'Attach file',
      remove_file_action: 'Remove',
      connect_to_slack_action: 'Connect your Slack team',
      slack_follow_instructions: 'Follow the instructions',
      editing_status: 'Editing',
      cancel_editing_action: 'Cancel',
      resolved_status: 'Resolved',
      unresolve_action: 'Reopen to reply',
      annotation: 'Your annotation',
      remove_annotation_action: 'Remove',
      send_message_action_failure: 'Failed to send message. Please try again.',
      drag_and_drop_files_tooltip: 'Drop Files',
    },
    thread: {
      placeholder_title: 'Chat with your team, right here',
      placeholder_body:
        "Ask a question, give feedback, or just say 'Hi'. Comments can be seen by anyone who can access this page.",
      new_status: 'New',
      reply_action: 'Reply...',
      new_replies_status_other: '{{count}} unread',
      replies_status_one: '1 reply',
      replies_status_other: '{{count}} replies',
      mark_as_read_action: 'Mark as read',
      share_via_slack_action: 'Share with Slack',
      share_via_slack_channel_action: 'Share to #{{slackChannel}}',
      share_via_slack_action_not_connected: 'Connect to share',
      share_via_slack_action_success: 'Shared to #{{slackChannel}}',
      share_via_slack_channel_placeholder: 'Type or select',
      share_via_slack_no_channels: 'No public channels found',
      share_via_email_action: 'Share via email',
      share_via_email_screenshot_warning:
        'A screenshot of this page will be included in the email.',
      share_via_email_placeholder: 'email@email.com',
      subscribe_action: 'Subscribe',
      subscribe_action_success: "You've subscribed to this thread",
      unsubscribe_action: 'Unsubscribe',
      unsubscribe_action_success: "You've unsubscribed from this thread",
      resolve_action: 'Resolve',
      resolve_action_success: 'You resolved this thread',
      resolved_status: 'Resolved',
      unresolve_action: 'Reopen',
      unresolve_action_success: 'You have reopened this thread',
      collapse_action: 'Collapse thread',
      typing_users_status: 'Typing',
    },
    thread_list: {
      placeholder_title: 'Be the first to add a comment',
      placeholder_body:
        "Ask a question, give feedback, or just say 'Hi'. Comments can be seen by anyone who can access this page.",
      show_resolved_threads_action: 'Show resolved threads',
      hide_resolved_threads_action: 'Hide resolved threads',
    },
    threaded_comments: {
      placeholder_title: 'Be the first to add a comment',
      placeholder_body:
        "Ask a question, give feedback, or just say 'Hi'. Comments can be seen by anyone who can access this page.",
      resolved_placeholder_title: 'This is where resolved comments will appear',
      resolved_placeholder_body:
        'Resolved comments can be seen by anyone who can access this page.',
      show_unresolved: 'Open',
      show_resolved: 'Resolved',
      show_resolved_threads_action:
        '$t(thread_list:show_resolved_threads_action)',
      hide_resolved_threads_action:
        '$t(thread_list:hide_resolved_threads_action)',
      load_more_action: 'Load more',
      show_replies_action_read_one: '1 reply',
      show_replies_action_read_other: '{{count}} replies',
      show_replies_action_unread_one: '1 new reply',
      show_replies_action_unread_other: '{{count}} new replies',
      hide_replies_action: 'Hide replies',
      show_more_replies_action: 'Show more',
      reply_action: 'Reply',
      resolved_status: '$t(thread:resolved_status)',
      unresolve_action: '$t(thread:unresolve_action)',
    },
    message: {
      download_action: 'Download',
      unable_to_display_document: 'Unable to display document',
      unable_to_display_image: 'Unable to display image',
      editing_status: '(Editing)',
      edited_status: '(Edited)',
      edit_action: 'Edit',
      edit_resolved_action: 'Reopen to edit',
      delete_action: 'Delete',
      deleted_message: '{{user.displayName}} deleted a message',
      deleted_messages_one: '{{user.displayName}} deleted a message',
      deleted_messages_other: '{{user.displayName}} deleted {{count}} messages',
      sent_via_slack_tooltip: 'Sent via Slack',
      sent_via_email_tooltip: 'Sent via Email',
      undo_delete_action: 'Undo',
      add_reaction_action: 'Add reaction',
      show_more_other: 'Show {{count}} more',
      message_options_tooltip: 'Options',
      screenshot_loading_status: 'Loading',
      screenshot_missing_status: 'No screenshot found',
      screenshot_expand_action: 'Image',
      screenshot_expand_tooltip: 'Click to expand',
      seen_by_status: 'Seen by {{users, list(style: short)}}',
      seen_by_status_overflow_one:
        'Seen by {{users, list(style: narrow)}}, and 1 other',
      seen_by_status_overflow_other:
        'Seen by {{users, list(style: narrow)}}, and {{count}} others',
      image_modal_copy_link_action: 'Link',
      image_modal_copy_link_toolitp: 'Click to copy',
      image_modal_copy_link_success: 'Copied to clipboard',
      image_modal_blurred_status:
        'Potentially confidential content has been blurred',
      image_modal_annotation_header:
        '{{user.displayName}} annotated this <datespan>on {{date}}</datespan>',
      image_modal_attachment_header:
        '{{user.displayName}} attached this <datespan>on {{date}}</datespan>',
      image_modal_header_date_format: 'D MMM [at] h:mm A',
      timestamp: {
        in_less_than_a_minute: 'in less than a minute',
        just_now: 'just now',
        in_minutes_one: 'in 1 min',
        in_minutes_other: 'in {{count}} mins',
        minutes_ago_one: '1 min ago',
        minutes_ago_other: '{{count}} mins ago',
        in_hours_one: 'in 1 hour',
        in_hours_other: 'in {{count}} hours',
        hours_ago_one: '1 hour ago',
        hours_ago_other: '{{count}} hours ago',
        yesterday_format: '[yesterday]',
        last_week_format: 'dddd',
        tomorrow_format: '[tomorrow]',
        next_week_format: 'dddd',
        this_year_format: 'MMM D',
        other_format: 'MMM D, YYYY',
      },
      absolute_timestamp: {
        today_format: 'h:mm A',
        yesterday_format: 'MMM D',
        last_week_format: 'MMM D',
        tomorrow_format: 'MMM D',
        next_week_format: 'MMM D',
        this_year_format: 'MMM D',
        other_format: 'MMM D, YYYY',
      },
    },
    // The message_templates namespace is used for translating the body of Cord
    // messages by marking the messages with a translationKey.  See
    // https://docs.cord.com/how-to/translations for more details on message
    // translation.
    message_templates: {
      cord: {
        thread_resolved: [
          {
            type: 'p',
            children: [
              {
                type: 'mention',
                user: { id: '{{mention1.userID}}' },
                children: [{ text: '{{mention1.text}}' }],
              },
              { text: ' resolved this thread' },
            ],
          },
        ],
        thread_unresolved: [
          {
            type: 'p',
            children: [
              {
                type: 'mention',
                user: { id: '{{mention1.userID}}' },
                children: [{ text: '{{mention1.text}}' }],
              },
              { text: ' reopened this thread' },
            ],
          },
        ],
      },
    },
    sidebar: {
      add_comment_action: 'Add comment',
      add_comment_instruction: 'Add your comment',
      close_sidebar_tooltip: 'Close',
      close_settings_tooltip: 'Close',
      inbox_tooltip: 'All updates',
      thread_options_menu: 'Options',
      thread_list_title: 'Comments',
      return_to_list_action: 'All',
      annotation_nudge: 'Why not try <l>annotating part of the page</l>?',
    },
    notifications: {
      notifications_title: 'Notifications',
      mark_all_as_read_action: 'Mark all as read',
      mark_as_read_action: 'Mark as read',
      delete_action: 'Delete notification',
      empty_state_title: 'You’re all caught up',
      empty_state_body:
        'When someone @mentions you or replies to your comments, we’ll let you know here.',
      notification_options_tooltip: 'Options',
      timestamp: {
        in_less_than_a_minute: 'In less than a minute',
        just_now: 'Just now',
        in_minutes_one: 'In 1 min',
        in_minutes_other: 'In {{count}} mins',
        minutes_ago_one: '1 min ago',
        minutes_ago_other: '{{count}} mins ago',
        in_hours_one: 'In 1 hour',
        in_hours_other: 'In {{count}} hours',
        hours_ago_one: '1 hour ago',
        hours_ago_other: '{{count}} hours ago',
        yesterday_format: '[Yesterday at] h:mma',
        last_week_format: 'dddd',
        tomorrow_format: '[Tomorrow at] h:mma',
        next_week_format: 'dddd',
        this_year_format: 'MMM D, YYYY',
        other_format: 'MMM D, YYYY',
      },
    },
    presence: {
      timestamp: {
        in_less_than_a_minute: 'Viewing in less than a minute',
        just_now: 'Viewed just now',
        in_minutes_one: 'Viewing in 1 min',
        in_minutes_other: 'Viewing in {{count}} mins',
        minutes_ago_one: 'Viewed 1 min ago',
        minutes_ago_other: 'Viewed {{count}} mins ago',
        in_hours_one: 'Viewing in 1 hour',
        in_hours_other: 'Viewing in {{count}} hours',
        hours_ago_one: 'Viewed 1 hour ago',
        hours_ago_other: 'Viewed {{count}} hours ago',
        yesterday_format: '[Viewed yesterday at] h:mma',
        last_week_format: '[Viewed] dddd',
        tomorrow_format: '[Viewing tomorrow at] h:mma',
        next_week_format: '[Viewing] dddd',
        this_year_format: '[Viewed] MMM D, YYYY',
        other_format: '[Viewed] MMM D, YYYY',
      },
    },
    inbox: {
      go_to_page_action: 'Go to page',
      close_tooltip: 'Close',
      inbox_title: 'Your Inbox',
      all_pages_title: 'All Pages',
      settings_tooltip: 'Collaboration settings',
      mark_all_as_read_action: 'Mark all as read',
      empty_state_title: 'You’re all caught up',
      empty_state_body:
        'When someone @mentions you or replies to your comments, we’ll let you know here.',
    },
    annotation: {
      click_prompt: 'Click to comment',
      click_tooltip: 'Click to comment',
      click_or_select_tooltip: 'Click or select text to comment',
      cancel_annotating: 'Cancel',
      annotation: 'Annotation',
      keep_pin_on_page_action: 'Keep pin on page',
      changed: 'The annotated area has changed',
      hide_action: 'Hide for you',
      show_message_action: 'Click to view message',
    },
    user: {
      viewer_user: '{{user.displayName}} (you)',
      viewer_user_subtitle: '{{user.secondaryDisplayName}}',
      other_user: '{{user.displayName}}',
      other_user_subtitle: '{{user.secondaryDisplayName}}',
    },
    // Cord's emoji picker is an external library, which doesn't use i18next,
    // nor conforms to Cord's patterns. You can still translate these strings
    // like you would translate any other string in this file.
    // For more context, see https://www.npmjs.com/package/emoji-picker-element#internationalization
    emoji_picker: {
      categories: {
        custom: 'Custom',
        'smileys-emotion': 'Smileys and emoticons',
        'people-body': 'People and body',
        'animals-nature': 'Animals and nature',
        'food-drink': 'Food and drink',
        'travel-places': 'Travel and places',
        activities: 'Activities',
        objects: 'Objects',
        symbols: 'Symbols',
        flags: 'Flags',
      },
      categoriesLabel: 'Categories',
      emojiUnsupportedMessage: 'Your browser does not support color emoji.',
      favoritesLabel: 'Favorites',
      loadingMessage: 'Loading…',
      networkErrorMessage: 'Could not load emoji.',
      regionLabel: 'Emoji picker',
      searchDescription:
        'When search results are available, press up or down to select and enter to choose.',
      searchLabel: 'Search',
      searchResultsLabel: 'Search results',
      skinToneDescription:
        'When expanded, press up or down to select and enter to choose.',
      skinToneLabel: 'Choose a skin tone (currently {skinTone})',
      skinTones: [
        'Default',
        'Light',
        'Medium-Light',
        'Medium',
        'Medium-Dark',
        'Dark',
      ],
      skinTonesLabel: 'Skin tones',
    },
  },
  // Cord's emoji picker is an external library, which doesn't use i18next, thus it
  // doesn't support "ci mode" out of the box. So we add our own:
  cimode: {
    emoji_picker: {
      categories: {
        custom: 'custom',
        'smileys-emotion': 'smileys-emotion',
        'people-body': 'people-body',
        'animals-nature': 'animals-nature',
        'food-drink': 'food-drink',
        'travel-places': 'travel-places',
        activities: 'activities',
        objects: 'objects',
        symbols: 'symbols',
        flags: 'flags',
      },
      categoriesLabel: 'categoriesLabel',
      emojiUnsupportedMessage: 'emojiUnsupportedMessage',
      favoritesLabel: 'favoritesLabel',
      loadingMessage: 'loadingMessage',
      networkErrorMessage: 'networkErrorMessage',
      regionLabel: 'regionLabel',
      searchDescription: 'searchDescription',
      searchLabel: 'searchLabel',
      searchResultsLabel: 'searchResultsLabel',
      skinToneDescription: 'skinToneDescription',
      skinToneLabel: 'skinToneLabel',
      skinTones: [
        'Default',
        'Light',
        'Medium-Light',
        'Medium',
        'Medium-Dark',
        'Dark',
      ],
      skinTonesLabel: 'skinTonesLabel',
    },
  },
};

export type TranslationResources = (typeof resources)['en'];

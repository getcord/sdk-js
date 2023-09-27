// `import type` so that i18next is not actually imported in the built code,
// which doesn't need it, we just need the name so the `declare module '18next'`
// block below works.
import type {} from 'i18next';

// NOTE: These strings are here for documentation, but they will not be used at
// runtime.  The Cord SDK comes with a compiled-in copy of these strings which
// will be used instead.  If you want to change the value for any of these
// strings, use the `translations` configuration option as described in
// https://docs.cord.com/js-apis-and-hooks/initialization.
export const resources = {
  en: {
    default: {},
    composer: {
      reply: 'Reply...',
      add_a_comment: 'Add a comment...',
      mention_someone: 'Mention someone',
      replace_annotation: 'Replace annotation',
      add_emoji: 'Add emoji',
      remove_task: 'Remove task',
      create_task: 'Create task',
      attach_file: 'Attach file',
      start_video_msg: 'Record a video',
      remove_file: 'Remove',
      connect_to_slack: 'Connect your Slack team',
      slack_follow_instructions: 'Follow the instructions',
      editing: 'Editing',
      cancel_editing_action: 'Cancel',
      resolved: 'Resolved',
      unresolve_action: 'Reopen to reply',
      annotation: 'Your annotation',
      remove_annotation_action: 'Remove',
    },
    thread: {
      placeholder_title: 'Chat with your team, right here',
      placeholder_body:
        "Ask a question, give feedback, or just say 'Hi'. Comments can be seen by anyone who can access this page.",
      new: 'New',
      reply: 'Reply...',
      new_replies_other: '{{count}} unread',
      replies_one: '1 reply',
      replies_other: '{{count}} replies',
      mark_as_read_action: 'Mark as read',
      share_via_slack_action: 'Share with Slack',
      share_via_slack_action_not_connected: 'Connect to share',
      share_via_slack_action_success: 'Shared to #{{slackChannel}}',
      share_via_email_action: 'Share via email',
      subscribe_action: 'Subscribe',
      subscribe_action_success: "You've subscribed to this thread",
      unsubscribe_action: 'Unsubscribe',
      unsubscribe_action_success: "You've unsubscribed from this thread",
      resolve_action: 'Resolve',
      resolve_action_success: 'You resolved this thread',
      resolved: 'Resolved',
      unresolve_action: 'Reopen',
      unresolve_action_success: 'You have reopened this thread',
      collapse_action: 'Collapse thread',
    },
    thread_list: {
      placeholder_title: 'Be the first to add a comment',
      placeholder_body:
        "Ask a question, give feedback, or just say 'Hi'. Comments can be seen by anyone who can access this page.",
      show_resolved_threads: 'Show resolved threads',
      hide_resolved_threads: 'Hide resolved threads',
    },
    threaded_comments: {
      show_unresolved: 'Open',
      show_resolved: 'Resolved',
    },
    message: {
      download: 'Download',
      unable_to_display_document: 'Unable to display document',
      unable_to_display_image: 'Unable to display image',
      editing: '(Editing)',
      edited: '(Edited)',
      edit_action: 'Edit',
      edit_action_resolved: 'Reopen to edit',
      delete_action: 'Delete',
      deleted_message: '{{user.displayName}} deleted a message',
      undo_delete_action: 'Undo',
      add_reaction_action: 'Add reaction',
      show_more_other: 'Show {{count}} more',
      message_options_tooltip: 'Options',
      screenshot_loading: 'Loading',
      screenshot_missing: 'No screenshot found',
      screenshot_expand_action: 'Image',
      screenshot_expand_tooltip: 'Click to expand',
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
    notifications: {
      notifications_title: 'Notifications',
      mark_all_as_read: 'Mark all as read',
      mark_as_read: 'Mark as read',
      delete: 'Delete notification',
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
    },
  },
};

export type TranslationResources = (typeof resources)['en'];

// This tells i18next what shape the resources file is, which then feeds into
// the TypeScript types in a very clever way so that when you ask for a
// translation key, it can check that you're using a key that exists.
declare module 'i18next' {
  export interface CustomTypeOptions {
    defaultNS: 'default';
    resources: TranslationResources;
  }
}
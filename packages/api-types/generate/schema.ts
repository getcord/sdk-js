// @generated
export default {
  CreateApplicationVariables: {
    description: 'https://docs.cord.com/rest-apis/applications/',
    type: 'object',
    properties: {
      emailSettings: { $ref: '#/definitions/Partial<EmailSettings>' },
      name: {
        description: 'Name of the application',
        minLength: 1,
        type: 'string',
      },
      iconURL: {
        description:
          'URL for the application icon. It should be a square image of 256x256. This\nwill be used as the avatar for messages and emails coming from your\napplication.  If not specified, the Cord logo will be used.',
        format: 'uri',
        type: ['null', 'string'],
      },
      eventWebhookURL: {
        description: 'The URL that the events webhook is sent to',
        format: 'uri',
        type: ['null', 'string'],
      },
      redirectURI: {
        description:
          'Custom url link contained in email and slack notifications. These notifications are sent when a user is\nmentioned or thread is shared and by default, the link points to the page where the conversation happened.\nFor more information, please refer to the [API docs](/how-to/custom-redirect-link)',
        type: ['null', 'string'],
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'emailSettings',
      'name',
      'iconURL',
      'eventWebhookURL',
      'redirectURI',
    ],
    required: ['name'],
    definitions: {
      'Partial<EmailSettings>': {
        type: 'object',
        properties: {
          name: {
            description:
              "Name to show in both the subject and the body of the email.\nDefaults to your application's name.",
            type: ['null', 'string'],
          },
          imageURL: {
            description:
              'URL for your logo image. The default for this is the Cord logo.',
            type: ['null', 'string'],
          },
          sender: {
            description:
              'Email from which notifications for your service will be sent from.\nThis will use the provided name for your application to default to `<applicationname>-notifications@cord.fyi`.',
            format: 'email',
            type: ['null', 'string'],
          },
          logoConfig: {
            description:
              'Customization for your logo size. Providing either a height (maximum 120) or\nwidth (maximum 240) will result in the image being proportionally resized to\nfit in a container of that size. The default value is `{"width": 140}`.',
            anyOf: [
              {
                type: 'object',
                properties: {
                  width: { minimum: 0, maximum: 240, type: 'number' },
                },
                additionalProperties: false,
                propertyOrder: ['width'],
                required: ['width'],
              },
              {
                type: 'object',
                properties: {
                  height: { minimum: 0, maximum: 120, type: 'number' },
                },
                additionalProperties: false,
                propertyOrder: ['height'],
                required: ['height'],
              },
              { type: 'null' },
            ],
          },
        },
        additionalProperties: false,
        propertyOrder: ['name', 'imageURL', 'sender', 'logoConfig'],
      },
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  UpdateApplicationVariables: {
    description: 'https://docs.cord.com/rest-apis/applications/',
    type: 'object',
    properties: {
      emailSettings: { $ref: '#/definitions/Partial<EmailSettings>' },
      name: {
        description: 'Name of the application',
        minLength: 1,
        type: 'string',
      },
      iconURL: {
        description:
          'URL for the application icon. It should be a square image of 256x256. This\nwill be used as the avatar for messages and emails coming from your\napplication.  If not specified, the Cord logo will be used.',
        format: 'uri',
        type: ['null', 'string'],
      },
      eventWebhookURL: {
        description: 'The URL that the events webhook is sent to',
        format: 'uri',
        type: ['null', 'string'],
      },
      redirectURI: {
        description:
          'Custom url link contained in email and slack notifications. These notifications are sent when a user is\nmentioned or thread is shared and by default, the link points to the page where the conversation happened.\nFor more information, please refer to the [API docs](/how-to/custom-redirect-link)',
        type: ['null', 'string'],
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'emailSettings',
      'name',
      'iconURL',
      'eventWebhookURL',
      'redirectURI',
    ],
    definitions: {
      'Partial<EmailSettings>': {
        type: 'object',
        properties: {
          name: {
            description:
              "Name to show in both the subject and the body of the email.\nDefaults to your application's name.",
            type: ['null', 'string'],
          },
          imageURL: {
            description:
              'URL for your logo image. The default for this is the Cord logo.',
            type: ['null', 'string'],
          },
          sender: {
            description:
              'Email from which notifications for your service will be sent from.\nThis will use the provided name for your application to default to `<applicationname>-notifications@cord.fyi`.',
            format: 'email',
            type: ['null', 'string'],
          },
          logoConfig: {
            description:
              'Customization for your logo size. Providing either a height (maximum 120) or\nwidth (maximum 240) will result in the image being proportionally resized to\nfit in a container of that size. The default value is `{"width": 140}`.',
            anyOf: [
              {
                type: 'object',
                properties: {
                  width: { minimum: 0, maximum: 240, type: 'number' },
                },
                additionalProperties: false,
                propertyOrder: ['width'],
                required: ['width'],
              },
              {
                type: 'object',
                properties: {
                  height: { minimum: 0, maximum: 120, type: 'number' },
                },
                additionalProperties: false,
                propertyOrder: ['height'],
                required: ['height'],
              },
              { type: 'null' },
            ],
          },
        },
        additionalProperties: false,
        propertyOrder: ['name', 'imageURL', 'sender', 'logoConfig'],
      },
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  DeleteApplicationVariables: {
    description: 'https://docs.cord.com/rest-apis/applications/',
    type: 'object',
    properties: {
      secret: {
        description:
          'Secret key of the application that you want to delete. This can be found\nwithin the Cord Console.',
        minLength: 1,
        type: 'string',
      },
    },
    additionalProperties: false,
    propertyOrder: ['secret'],
    required: ['secret'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  BatchAPIVariables: {
    description: 'https://docs.cord.com/rest-apis/batch/',
    type: 'object',
    properties: {
      users: {
        description:
          'List of user objects. Every object must include the id field. If the user\nalready exists, all other fields are optional and only updated when\npresent. If the user does not already exist, fields are required as\ndescribed in the [Create or update a\nuser](/rest-apis/organizations/#create-or-update-an-organization)\nAPI.',
        maxItems: 10000,
        type: 'array',
        items: {
          additionalProperties: false,
          type: 'object',
          properties: {
            name: { description: 'Full user name', type: ['null', 'string'] },
            metadata: {
              description:
                'Arbitrary key-value pairs that can be used to store additional information.',
              type: 'object',
              additionalProperties: { type: ['string', 'number', 'boolean'] },
              propertyOrder: [],
            },
            status: { enum: ['active', 'deleted'], type: 'string' },
            email: {
              description: 'Email address',
              format: 'email',
              type: 'string',
            },
            shortName: {
              description:
                'Short user name. In most cases, this will be preferred over name when set.',
              type: ['null', 'string'],
            },
            short_name: { type: ['null', 'string'] },
            profilePictureURL: {
              description:
                "This must be a valid URL, which means it needs to follow the usual URL\nformatting and encoding rules. For example, any space character will need\nto be encoded as `%20`. We recommend using your programming language's\nstandard URL encoding function, such as `encodeURI` in Javascript.",
              format: 'uri',
              type: ['null', 'string'],
            },
            profile_picture_url: {
              description:
                'Alias for profilePictureURL. This field is deprecated.',
              format: 'uri',
              type: ['null', 'string'],
            },
            first_name: {
              description:
                "User's first name. This field is deprecated and has no effect.",
              type: ['null', 'string'],
            },
            last_name: {
              description:
                "User's last name. This field is deprecated and has no effect.",
              type: ['null', 'string'],
            },
            id: { $ref: '#/definitions/ID' },
          },
          required: ['id'],
        },
      },
      organizations: {
        description:
          'List of organization objects. Every object must include the id field. If\nthe organization already exists, all other fields are optional and only\nupdated when present. If the organization does not already exist, fields\nare required as described in the [Create or update an\norganization](/rest-apis/organizations/#create-or-update-an-organization)\nAPI.',
        maxItems: 1000,
        type: 'array',
        items: {
          additionalProperties: false,
          type: 'object',
          properties: {
            name: { description: 'Organization name', type: 'string' },
            status: { enum: ['active', 'deleted'], type: 'string' },
            members: {
              description:
                'List of partner-specific IDs of the users who are members of this organization',
              type: 'array',
              items: { type: ['string', 'number'] },
            },
            id: { $ref: '#/definitions/ID' },
          },
          required: ['id'],
        },
      },
    },
    additionalProperties: false,
    propertyOrder: ['users', 'organizations'],
    definitions: {
      ID: { minLength: 1, maxLength: 128, type: ['string', 'number'] },
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  CreateMessageVariables: {
    description: 'https://docs.cord.com/rest-apis/messages/',
    type: 'object',
    properties: {
      addReactions: {
        description:
          'The reactions you want to add to this message.\nThe default timestamp is the current time.\nTrying to create a reaction that already exists for a user does nothing.\nDoing the same as before with a timestamp will update the reaction with the new timestamp.\nThe reaction users need to be an [active member of the org](/rest-apis/organizations#Update-organization-members) that the message and thread belong to.',
        type: 'array',
        items: { $ref: '#/definitions/AddReactionsVariables' },
      },
      createThread: {
        description:
          "The parameters for creating a thread if the supplied thread doesn't exist\nyet.  If the thread doesn't exist but `createThread` isn't provided, the\ncall will generate an error.  This value is ignored if the thread already\nexists.",
        $ref: '#/definitions/Omit<ServerCreateThread,"id">',
      },
      id: { description: 'The ID for the message.', type: 'string' },
      content: {
        description: 'The content of the message.',
        type: 'array',
        items: { type: 'object', properties: {}, additionalProperties: true },
      },
      authorID: {
        description: 'The ID for the user that sent the message.',
        type: 'string',
      },
      type: {
        description:
          'The type of message this is.  A `user_message` is a message that the author\nsent.  An `action_message` is a message about something that happened, such\nas the thread being resolved.  The default value is `user_message`.',
        enum: ['action_message', 'user_message'],
        type: 'string',
      },
      url: {
        description:
          "A URL where the message can be seen.  This determines where a user is sent\nwhen they click on a reference to this message, such as in a notification.\nIf unset, it defaults to the thread's URL.",
        type: ['null', 'string'],
      },
      metadata: {
        description:
          'Arbitrary key-value pairs that can be used to store additional information.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
      createdTimestamp: {
        description:
          'The timestamp when this message was created.  The default value is the\ncurrent time.',
        type: 'string',
        format: 'date-time',
      },
      extraClassnames: {
        description:
          'A optional space separated list of classnames to add to the message.',
        type: ['null', 'string'],
      },
      updatedTimestamp: {
        description:
          'The timestamp when this message was last edited, if it ever was.  If unset,\nthe message does not show as edited.',
        anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }],
      },
      deletedTimestamp: {
        description:
          'The timestamp when this message was deleted, if it was.  If unset, the\nmessage is not deleted.',
        anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }],
      },
      iconURL: {
        description:
          'The URL of the icon to show next to the message.  This is only used for\n`action_message` messages; other messages show the avatar of the author.\nIf an `action_message` does not have an icon set, no icon is shown.',
        format: 'uri',
        type: ['null', 'string'],
      },
      attachments: {
        description: 'The items attached to this message.',
        type: 'array',
        items: { $ref: '#/definitions/MessageFileAttachment' },
      },
      reactions: {
        description: 'The reactions to this message.',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            reaction: { description: 'The emoji reaction.', type: 'string' },
            userID: {
              description: 'The ID of the user who reacted to the message.',
              type: 'string',
            },
            timestamp: {
              description: 'The timestamp of when the reaction was created.',
              type: 'string',
              format: 'date-time',
            },
          },
          additionalProperties: false,
          propertyOrder: ['reaction', 'userID', 'timestamp'],
          required: ['reaction', 'timestamp', 'userID'],
        },
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'addReactions',
      'createThread',
      'id',
      'content',
      'authorID',
      'type',
      'url',
      'metadata',
      'createdTimestamp',
      'extraClassnames',
      'updatedTimestamp',
      'deletedTimestamp',
      'iconURL',
      'attachments',
      'reactions',
    ],
    required: ['authorID', 'content', 'id'],
    definitions: {
      AddReactionsVariables: {
        additionalProperties: false,
        type: 'object',
        properties: {
          reaction: { description: 'The emoji reaction.', type: 'string' },
          userID: {
            description: 'The ID of the user who reacted to the message.',
            type: 'string',
          },
          timestamp: {
            description: 'The timestamp of when the reaction was created.',
            type: 'string',
            format: 'date-time',
          },
        },
        required: ['reaction', 'userID'],
      },
      'Omit<ServerCreateThread,"id">': {
        type: 'object',
        properties: {
          location: {
            description: 'The [location](/reference/location) of this thread.',
            type: 'object',
            additionalProperties: { type: ['string', 'number', 'boolean'] },
            propertyOrder: [],
          },
          url: {
            description:
              "A URL where the thread can be seen.  This determines where a user is sent\nwhen they click on a reference to this thread, such as in a notification,\nor if they click on a reference to a message in the thread and the message\ndoesn't have its own URL.",
            type: 'string',
          },
          name: {
            description:
              'The name of the thread.  This is shown to users when the thread is\nreferenced, such as in notifications.  This should generally be something\nlike the page title.',
            type: 'string',
          },
          metadata: {
            description:
              'Arbitrary key-value pairs that can be used to store additional information.',
            type: 'object',
            additionalProperties: { type: ['string', 'number', 'boolean'] },
            propertyOrder: [],
          },
          organizationID: {
            description: 'The organization ID this thread is in.',
            type: 'string',
          },
          resolved: {
            description:
              'Whether the thread is resolved.  Setting this to `true` is equivalent to\nsetting `resolvedTimestamp` to the current time, and setting this to\n`false` is equivalent to setting `resolvedTimestamp` to `null`.',
            type: 'boolean',
          },
          extraClassnames: {
            description:
              'An optional space separated list of classnames to add to the thread.',
            type: ['null', 'string'],
          },
        },
        additionalProperties: false,
        propertyOrder: [
          'location',
          'url',
          'name',
          'metadata',
          'organizationID',
          'resolved',
          'extraClassnames',
        ],
        required: ['location', 'name', 'organizationID', 'url'],
      },
      MessageFileAttachment: {
        description: 'A file attached to this message.',
        type: 'object',
        properties: {
          id: { description: 'The ID of this attachment.', type: 'string' },
          type: {
            description:
              'The type of this attachment, which is always `file` for file attachments.',
            type: 'string',
            enum: ['file'],
          },
          name: {
            description: 'The name of the file that was attached.',
            type: 'string',
          },
          url: {
            description:
              'The URL that a user can use to download the file.  This is a signed URL\nthat will expire after 24 hours.',
            type: 'string',
          },
          mimeType: {
            description: 'The MIME type of the file.',
            type: 'string',
          },
          size: {
            description: 'The size of the file, in bytes.',
            type: 'number',
          },
          uploadStatus: {
            description:
              'The status of the file upload.  `uploading` means that the user has not yet\ncompleted uploading the file, `uploaded` means the file is successfully\nuploaded, `failed` means the upload encountered an error, and `cancelled`\nmeans the user cancelled the upload before it was finished.',
            enum: ['cancelled', 'failed', 'uploaded', 'uploading'],
            type: 'string',
          },
        },
        additionalProperties: false,
        propertyOrder: [
          'id',
          'type',
          'name',
          'url',
          'mimeType',
          'size',
          'uploadStatus',
        ],
        required: [
          'id',
          'mimeType',
          'name',
          'size',
          'type',
          'uploadStatus',
          'url',
        ],
      },
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  UpdateMessageVariables: {
    description: 'https://docs.cord.com/rest-apis/messages/',
    type: 'object',
    properties: {
      deleted: {
        description:
          'Whether we want to mark this message as deleted. Setting this to `true` without\nproviding a value for `deletedTimestamp` is equivalent to setting `deletedTimestamp` to current\ntime and setting this to `false` is equivalent to setting `deletedTimestamp` to `null`.',
        type: 'boolean',
      },
      deletedTimestamp: {
        description:
          "The timestamp when this message was deleted, if it was. If set to null, the message is not deleted.\nDeleting a message this way will only soft delete it, replacing the content of the message with a\nrecord of the deletion on the frontend. If you'd like to permanently delete it instead, use the\n[delete message endpoint](/rest-apis/messages#Delete-a-message).",
        anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }],
      },
      removeReactions: {
        description:
          'The reactions you want to remove from this message.\nRemoving a reaction that does not exist will have no effect and will not return an error.\nAn error is returned if a reaction is both added and deleted in the same request.',
        type: 'array',
        items: { $ref: '#/definitions/RemoveReactionsVariables' },
      },
      type: {
        description:
          'The type of message this is.  A `user_message` is a message that the author\nsent.  An `action_message` is a message about something that happened, such\nas the thread being resolved.  The default value is `user_message`.',
        enum: ['action_message', 'user_message'],
        type: 'string',
      },
      id: { description: 'The ID for the message.', type: 'string' },
      url: {
        description:
          "A URL where the message can be seen.  This determines where a user is sent\nwhen they click on a reference to this message, such as in a notification.\nIf unset, it defaults to the thread's URL.",
        type: ['null', 'string'],
      },
      content: {
        description: 'The content of the message.',
        type: 'array',
        items: { type: 'object', properties: {}, additionalProperties: true },
      },
      metadata: {
        description:
          'Arbitrary key-value pairs that can be used to store additional information.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
      createdTimestamp: {
        description:
          'The timestamp when this message was created.  The default value is the\ncurrent time.',
        type: 'string',
        format: 'date-time',
      },
      extraClassnames: {
        description:
          'A optional space separated list of classnames to add to the message.',
        type: ['null', 'string'],
      },
      authorID: {
        description: 'The ID for the user that sent the message.',
        type: 'string',
      },
      updatedTimestamp: {
        description:
          'The timestamp when this message was last edited, if it ever was.  If unset,\nthe message does not show as edited.',
        anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }],
      },
      iconURL: {
        description:
          'The URL of the icon to show next to the message.  This is only used for\n`action_message` messages; other messages show the avatar of the author.\nIf an `action_message` does not have an icon set, no icon is shown.',
        format: 'uri',
        type: ['null', 'string'],
      },
      attachments: {
        description: 'The items attached to this message.',
        type: 'array',
        items: { $ref: '#/definitions/MessageFileAttachment' },
      },
      reactions: {
        description: 'The reactions to this message.',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            reaction: { description: 'The emoji reaction.', type: 'string' },
            userID: {
              description: 'The ID of the user who reacted to the message.',
              type: 'string',
            },
            timestamp: {
              description: 'The timestamp of when the reaction was created.',
              type: 'string',
              format: 'date-time',
            },
          },
          additionalProperties: false,
          propertyOrder: ['reaction', 'userID', 'timestamp'],
          required: ['reaction', 'timestamp', 'userID'],
        },
      },
      addReactions: {
        description:
          'The reactions you want to add to this message.\nThe default timestamp is the current time.\nTrying to create a reaction that already exists for a user does nothing.\nDoing the same as before with a timestamp will update the reaction with the new timestamp.\nThe reaction users need to be an [active member of the org](/rest-apis/organizations#Update-organization-members) that the message and thread belong to.',
        type: 'array',
        items: { $ref: '#/definitions/AddReactionsVariables' },
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'deleted',
      'deletedTimestamp',
      'removeReactions',
      'type',
      'id',
      'url',
      'content',
      'metadata',
      'createdTimestamp',
      'extraClassnames',
      'authorID',
      'updatedTimestamp',
      'iconURL',
      'attachments',
      'reactions',
      'addReactions',
    ],
    definitions: {
      RemoveReactionsVariables: {
        type: 'object',
        properties: {
          reaction: { description: 'The emoji reaction.', type: 'string' },
          userID: {
            description: 'The ID of the user who reacted to the message.',
            type: 'string',
          },
        },
        additionalProperties: false,
        propertyOrder: ['reaction', 'userID'],
        required: ['reaction', 'userID'],
      },
      MessageFileAttachment: {
        description: 'A file attached to this message.',
        type: 'object',
        properties: {
          id: { description: 'The ID of this attachment.', type: 'string' },
          type: {
            description:
              'The type of this attachment, which is always `file` for file attachments.',
            type: 'string',
            enum: ['file'],
          },
          name: {
            description: 'The name of the file that was attached.',
            type: 'string',
          },
          url: {
            description:
              'The URL that a user can use to download the file.  This is a signed URL\nthat will expire after 24 hours.',
            type: 'string',
          },
          mimeType: {
            description: 'The MIME type of the file.',
            type: 'string',
          },
          size: {
            description: 'The size of the file, in bytes.',
            type: 'number',
          },
          uploadStatus: {
            description:
              'The status of the file upload.  `uploading` means that the user has not yet\ncompleted uploading the file, `uploaded` means the file is successfully\nuploaded, `failed` means the upload encountered an error, and `cancelled`\nmeans the user cancelled the upload before it was finished.',
            enum: ['cancelled', 'failed', 'uploaded', 'uploading'],
            type: 'string',
          },
        },
        additionalProperties: false,
        propertyOrder: [
          'id',
          'type',
          'name',
          'url',
          'mimeType',
          'size',
          'uploadStatus',
        ],
        required: [
          'id',
          'mimeType',
          'name',
          'size',
          'type',
          'uploadStatus',
          'url',
        ],
      },
      AddReactionsVariables: {
        additionalProperties: false,
        type: 'object',
        properties: {
          reaction: { description: 'The emoji reaction.', type: 'string' },
          userID: {
            description: 'The ID of the user who reacted to the message.',
            type: 'string',
          },
          timestamp: {
            description: 'The timestamp of when the reaction was created.',
            type: 'string',
            format: 'date-time',
          },
        },
        required: ['reaction', 'userID'],
      },
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  ListMessageParameters: {
    description: 'https://docs.cord.com/rest-apis/messages/',
    type: 'object',
    properties: {
      sortDirection: {
        description:
          "Return messages in ascending or descending order of creation timestamp.  'descending' is the default.",
        enum: ['ascending', 'descending'],
        type: 'string',
      },
    },
    additionalProperties: false,
    propertyOrder: ['sortDirection'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  CreateNotificationVariables: {
    description: 'https://docs.cord.com/rest-apis/notifications/',
    type: 'object',
    properties: {
      actorID: {
        description:
          'ID of user who is the "actor" sending the notification, i.e., the user\ntaking the action the notification is about.\n\nRequired if `template` includes `{{actor}}`.',
        type: 'string',
      },
      actor_id: { type: 'string' },
      recipientID: {
        description: 'ID of user receiving the notification.',
        type: 'string',
      },
      recipient_id: { type: 'string' },
      template: {
        description:
          "Template for the header of the notification. The expressions `{{actor}}`\nand `{{recipient}}` will be replaced respectively with the notification's\nactor and recipient. (See below for an example.)",
        type: 'string',
      },
      url: {
        description: 'URL of page to go to when the notification is clicked.',
        type: 'string',
      },
      iconUrl: {
        description:
          "URL of an icon image if a specific one is desired. For notifications with\nan `actor_id` this will default to the sender's profile picture, otherwise\nit will default to a bell icon.",
        type: 'string',
      },
      type: {
        description:
          'Currently must be set to `url`. In the future this may specify different\ntypes of notifications, but for now only `url` is defined.',
        type: 'string',
        enum: ['url'],
      },
      metadata: {
        description:
          'An arbitrary JSON object that can be used to set additional metadata on the\nnotification. When displaying a [list of\nnotifications](/components/cord-notification-list),\nyou can filter the list by metadata value.\n\nKeys are strings, and values can be strings, numbers or booleans.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'actorID',
      'actor_id',
      'recipientID',
      'recipient_id',
      'template',
      'url',
      'iconUrl',
      'type',
      'metadata',
    ],
    required: ['template', 'type', 'url'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  UpdatePlatformOrganizationVariables: {
    description: 'https://docs.cord.com/rest-apis/organizations/',
    type: 'object',
    properties: {
      name: { description: 'Organization name', type: 'string' },
      status: { enum: ['active', 'deleted'], type: 'string' },
      members: {
        description:
          'List of partner-specific IDs of the users who are members of this organization',
        type: 'array',
        items: { type: ['string', 'number'] },
      },
    },
    additionalProperties: false,
    propertyOrder: ['name', 'status', 'members'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  UpdatePlatformOrganizationMembersVariables: {
    description: 'https://docs.cord.com/rest-apis/organizations/',
    type: 'object',
    properties: {
      add: { type: 'array', items: { type: ['string', 'number'] } },
      remove: { type: 'array', items: { type: ['string', 'number'] } },
    },
    additionalProperties: false,
    propertyOrder: ['add', 'remove'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  CreatePlatformOrganizationVariables: {
    description: 'https://docs.cord.com/rest-apis/organizations/',
    type: 'object',
    properties: {
      name: { description: 'Organization name', type: 'string' },
      status: { enum: ['active', 'deleted'], type: 'string' },
      members: {
        description:
          'List of partner-specific IDs of the users who are members of this organization',
        type: 'array',
        items: { type: ['string', 'number'] },
      },
      id: { $ref: '#/definitions/ID' },
    },
    additionalProperties: false,
    propertyOrder: ['name', 'status', 'members', 'id'],
    required: ['id', 'name'],
    definitions: {
      ID: { minLength: 1, maxLength: 128, type: ['string', 'number'] },
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  UpdateUserPresenceVariables: {
    description: 'https://docs.cord.com/rest-apis/presence/',
    type: 'object',
    properties: {
      organizationID: {
        description: 'The organization that the user belongs to.',
        type: 'string',
      },
      exclusiveWithin: {
        description:
          'Sets an "exclusivity region" for the ephemeral presence set by this update.\nA user can only be present at one location for a given value of exclusiveWithin.\nIf the user becomes present at a different location with the same value of\nexclusiveWithin, they automatically become no longer present at all other\nlocations with that value of exclusive_within.\nThis is useful to more easily track presence as a user moves among sub-locations.\nFor example, suppose we\'d like to track which specific paragraph on a page\na user is present. We could make those updates like this:\n\n```json\n{\n   "organizationID": "<ORG_ID>",\n   "location": { "page": "<PAGE_ID>", "paragraph": "<PARAGRAPH_ID>" },\n   "exclusiveWithin": { "page": "<PAGE_ID>" }\n}\n```\n\nAs a user moves around a page, their paragraphID will change, while their\npageID will remain the same. The above call to setPresent will mark them\npresent at their specific paragraph. However, since every update uses the\nsame exclusiveWithin, each time they are marked present at one paragraph\nthey will become no longer present at their previous paragraph.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
      location: {
        description:
          'The [location](/reference/location) you want the user to be in.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
      durable: {
        description:
          'When `true`, this is a [durable presence](/js-apis-and-hooks/presence-api)\nupdate, when `false`, or is not used, it is an [ephemeral presence](/js-apis-and-hooks/presence-api) update.\n\nThis value defaults to `false.`',
        type: 'boolean',
      },
      absent: {
        description:
          'When `true`, this is an *absence* update, meaning that the user has just left\nthis [location](/reference/location).\nIf the user is currently present at that location, it is cleared.\nThis cannot be used with a [durable presence](/js-apis-and-hooks/presence-api) update.\n\nThis value defaults to `false.` The user will be set as present at the location.',
        type: 'boolean',
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'organizationID',
      'exclusiveWithin',
      'location',
      'durable',
      'absent',
    ],
    required: ['location', 'organizationID'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  CreateThreadVariables: {
    description: 'https://docs.cord.com/rest-apis/threads/',
    type: 'object',
    properties: {
      resolved: {
        description:
          'Whether the thread is resolved.  Setting this to `true` is equivalent to\nsetting `resolvedTimestamp` to the current time, and setting this to\n`false` is equivalent to setting `resolvedTimestamp` to `null`.',
        type: 'boolean',
      },
      location: {
        description: 'The [location](/reference/location) of this thread.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
      id: { description: 'The ID for this thread.', type: 'string' },
      url: {
        description:
          "A URL where the thread can be seen.  This determines where a user is sent\nwhen they click on a reference to this thread, such as in a notification,\nor if they click on a reference to a message in the thread and the message\ndoesn't have its own URL.",
        type: 'string',
      },
      name: {
        description:
          'The name of the thread.  This is shown to users when the thread is\nreferenced, such as in notifications.  This should generally be something\nlike the page title.',
        type: 'string',
      },
      organizationID: {
        description: 'The organization ID this thread is in.',
        type: 'string',
      },
      metadata: {
        description:
          'Arbitrary key-value pairs that can be used to store additional information.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
      extraClassnames: {
        description:
          'An optional space separated list of classnames to add to the thread.',
        type: ['null', 'string'],
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'resolved',
      'location',
      'id',
      'url',
      'name',
      'organizationID',
      'metadata',
      'extraClassnames',
    ],
    required: ['id', 'location', 'name', 'organizationID', 'url'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  UpdateThreadVariables: {
    description: 'https://docs.cord.com/rest-apis/threads/',
    type: 'object',
    properties: {
      location: {
        description: 'The [location](/reference/location) of this thread.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
      id: { description: 'The ID for this thread.', type: 'string' },
      url: {
        description:
          "A URL where the thread can be seen.  This determines where a user is sent\nwhen they click on a reference to this thread, such as in a notification,\nor if they click on a reference to a message in the thread and the message\ndoesn't have its own URL.",
        type: 'string',
      },
      name: {
        description:
          'The name of the thread.  This is shown to users when the thread is\nreferenced, such as in notifications.  This should generally be something\nlike the page title.',
        type: 'string',
      },
      metadata: {
        description:
          'Arbitrary key-value pairs that can be used to store additional information.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
      resolvedTimestamp: {
        description:
          'The timestamp when this thread was resolved. Set to `null` if this thread\nis not resolved.',
        anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }],
      },
      organizationID: {
        description: 'The organization ID this thread is in.',
        type: 'string',
      },
      repliers: {
        description: 'All of the users who have replied to this thread.',
        type: 'array',
        items: { type: 'string' },
      },
      extraClassnames: {
        description:
          'An optional space separated list of classnames to add to the thread.',
        type: ['null', 'string'],
      },
      userID: {
        description:
          'Certain changes to the thread may post a message into the thread -- in\nparticular, resolving or unresolving a thread posts a message into the\nthread saying "User un/resolved this thread". This parameter is the ID of\nthe User who will be listed as the author of that message. It\'s optional\n-- if no user is specified, then those messages won\'t get posted.',
        type: 'string',
      },
      typing: {
        description:
          "Marks the specified users as typing in this thread.  The typing indicator\nexpires after 3 seconds, so to continually show the indicator it needs to\nbe called on an interval.  Pass an empty array to clear all users' typing indicators.",
        type: 'array',
        items: { type: 'string' },
      },
      resolved: {
        description:
          'Whether the thread is resolved.  Setting this to `true` is equivalent to\nsetting `resolvedTimestamp` to the current time, and setting this to\n`false` is equivalent to setting `resolvedTimestamp` to `null`.',
        type: 'boolean',
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'location',
      'id',
      'url',
      'name',
      'metadata',
      'resolvedTimestamp',
      'organizationID',
      'repliers',
      'extraClassnames',
      'userID',
      'typing',
      'resolved',
    ],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  ListThreadQueryParameters: {
    description: 'https://docs.cord.com/rest-apis/threads/',
    type: 'object',
    properties: {
      filter: {
        description:
          'Threads will be matched against the filters specified.\nThis is a partial match, which means any keys other than the ones you specify are ignored\nwhen checking for a match. Please note that because this is a query parameter in a REST API,\nthis JSON object must be URI encoded before being sent.',
        type: 'object',
        properties: {
          location: {
            description: 'The location for the thread.',
            type: 'object',
            additionalProperties: { type: ['string', 'number', 'boolean'] },
            propertyOrder: [],
          },
          metadata: {
            description:
              'Arbitrary key-value pairs of data associated with the object.',
            type: 'object',
            additionalProperties: { type: ['string', 'number', 'boolean'] },
            propertyOrder: [],
          },
          firstMessageTimestamp: {
            description:
              'Timestamp when the first message in a thread was created.',
            type: 'object',
            properties: {
              from: {
                description:
                  'Timestamp from where to start the interval. If not present, the interval will have no start date and any data will include everything up to the provided `to` timestamp.',
                type: 'string',
                format: 'date-time',
              },
              to: {
                description:
                  'Timestamp where to end the interval. If not present, the interval will have no end date and any data will include everything from the provided `from` timestamp.',
                type: 'string',
                format: 'date-time',
              },
            },
            additionalProperties: false,
            propertyOrder: ['from', 'to'],
          },
          mostRecentMessageTimestamp: {
            description:
              'Timestamp when a message in a thread was last created or updated.',
            type: 'object',
            properties: {
              from: {
                description:
                  'Timestamp from where to start the interval. If not present, the interval will have no start date and any data will include everything up to the provided `to` timestamp.',
                type: 'string',
                format: 'date-time',
              },
              to: {
                description:
                  'Timestamp where to end the interval. If not present, the interval will have no end date and any data will include everything from the provided `from` timestamp.',
                type: 'string',
                format: 'date-time',
              },
            },
            additionalProperties: false,
            propertyOrder: ['from', 'to'],
          },
        },
        additionalProperties: false,
        propertyOrder: [
          'location',
          'metadata',
          'firstMessageTimestamp',
          'mostRecentMessageTimestamp',
        ],
      },
    },
    additionalProperties: false,
    propertyOrder: ['filter'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  UpdatePlatformUserVariables: {
    description: 'https://docs.cord.com/rest-apis/users/',
    type: 'object',
    properties: {
      name: { description: 'Full user name', type: ['null', 'string'] },
      metadata: {
        description:
          'Arbitrary key-value pairs that can be used to store additional information.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
      status: { enum: ['active', 'deleted'], type: 'string' },
      email: { description: 'Email address', format: 'email', type: 'string' },
      shortName: {
        description:
          'Short user name. In most cases, this will be preferred over name when set.',
        type: ['null', 'string'],
      },
      short_name: { type: ['null', 'string'] },
      profilePictureURL: {
        description:
          "This must be a valid URL, which means it needs to follow the usual URL\nformatting and encoding rules. For example, any space character will need\nto be encoded as `%20`. We recommend using your programming language's\nstandard URL encoding function, such as `encodeURI` in Javascript.",
        format: 'uri',
        type: ['null', 'string'],
      },
      profile_picture_url: {
        description: 'Alias for profilePictureURL. This field is deprecated.',
        format: 'uri',
        type: ['null', 'string'],
      },
      first_name: {
        description:
          "User's first name. This field is deprecated and has no effect.",
        type: ['null', 'string'],
      },
      last_name: {
        description:
          "User's last name. This field is deprecated and has no effect.",
        type: ['null', 'string'],
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'name',
      'metadata',
      'status',
      'email',
      'shortName',
      'short_name',
      'profilePictureURL',
      'profile_picture_url',
      'first_name',
      'last_name',
    ],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  CreatePlatformUserVariables: {
    description: 'https://docs.cord.com/rest-apis/users/',
    type: 'object',
    properties: {
      name: { description: 'Full user name', type: ['null', 'string'] },
      metadata: {
        description:
          'Arbitrary key-value pairs that can be used to store additional information.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
      status: { enum: ['active', 'deleted'], type: 'string' },
      email: { description: 'Email address', format: 'email', type: 'string' },
      shortName: {
        description:
          'Short user name. In most cases, this will be preferred over name when set.',
        type: ['null', 'string'],
      },
      short_name: { type: ['null', 'string'] },
      profilePictureURL: {
        description:
          "This must be a valid URL, which means it needs to follow the usual URL\nformatting and encoding rules. For example, any space character will need\nto be encoded as `%20`. We recommend using your programming language's\nstandard URL encoding function, such as `encodeURI` in Javascript.",
        format: 'uri',
        type: ['null', 'string'],
      },
      profile_picture_url: {
        description: 'Alias for profilePictureURL. This field is deprecated.',
        format: 'uri',
        type: ['null', 'string'],
      },
      first_name: {
        description:
          "User's first name. This field is deprecated and has no effect.",
        type: ['null', 'string'],
      },
      last_name: {
        description:
          "User's last name. This field is deprecated and has no effect.",
        type: ['null', 'string'],
      },
      id: { $ref: '#/definitions/ID', description: 'Provided ID for the user' },
    },
    additionalProperties: false,
    propertyOrder: [
      'name',
      'metadata',
      'status',
      'email',
      'shortName',
      'short_name',
      'profilePictureURL',
      'profile_picture_url',
      'first_name',
      'last_name',
      'id',
    ],
    required: ['email', 'id'],
    definitions: {
      ID: { minLength: 1, maxLength: 128, type: ['string', 'number'] },
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  ListPlatformUserVariables: {
    description: 'https://docs.cord.com/rest-apis/users/',
    type: 'object',
    properties: {
      id: { $ref: '#/definitions/ID', description: 'Provided ID for the user' },
      name: { description: 'Full user name', type: ['null', 'string'] },
      metadata: {
        description:
          'Arbitrary key-value pairs that can be used to store additional information.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
      status: { enum: ['active', 'deleted'], type: 'string' },
      createdTimestamp: {
        description: 'Creation timestamp',
        anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }],
      },
      shortName: {
        description:
          'Short user name. In most cases, this will be preferred over name when set.',
        type: ['null', 'string'],
      },
      short_name: { type: ['null', 'string'] },
      profilePictureURL: {
        description:
          "This must be a valid URL, which means it needs to follow the usual URL\nformatting and encoding rules. For example, any space character will need\nto be encoded as `%20`. We recommend using your programming language's\nstandard URL encoding function, such as `encodeURI` in Javascript.",
        format: 'uri',
        type: ['null', 'string'],
      },
      profile_picture_url: {
        description: 'Alias for profilePictureURL. This field is deprecated.',
        format: 'uri',
        type: ['null', 'string'],
      },
      first_name: {
        description:
          "User's first name. This field is deprecated and has no effect.",
        type: ['null', 'string'],
      },
      last_name: {
        description:
          "User's last name. This field is deprecated and has no effect.",
        type: ['null', 'string'],
      },
      email: { type: ['null', 'string'] },
    },
    additionalProperties: false,
    propertyOrder: [
      'id',
      'name',
      'metadata',
      'status',
      'createdTimestamp',
      'shortName',
      'short_name',
      'profilePictureURL',
      'profile_picture_url',
      'first_name',
      'last_name',
      'email',
    ],
    required: [
      'createdTimestamp',
      'email',
      'first_name',
      'id',
      'last_name',
      'metadata',
      'name',
      'profilePictureURL',
      'profile_picture_url',
      'shortName',
      'short_name',
      'status',
    ],
    definitions: {
      ID: { minLength: 1, maxLength: 128, type: ['string', 'number'] },
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  ListUserQueryParameters: {
    description: 'https://docs.cord.com/rest-apis/users/',
    type: 'object',
    properties: {
      filter: {
        description:
          'This is a JSON object with one optional entry.  Users will be matched\nagainst the filter specified. This is a partial match, which means any keys\nother than the ones you specify are ignored when checking for a match.\nPlease note that because this is a query parameter in a REST API, this JSON\nobject must be URI encoded before being sent.',
        $ref: '#/definitions/Pick<FilterParameters,"metadata">',
      },
    },
    additionalProperties: false,
    propertyOrder: ['filter'],
    definitions: {
      'Pick<FilterParameters,"metadata">': {
        type: 'object',
        properties: {
          metadata: {
            description:
              'Arbitrary key-value pairs of data associated with the object.',
            type: 'object',
            additionalProperties: { type: ['string', 'number', 'boolean'] },
            propertyOrder: [],
          },
        },
        additionalProperties: false,
        propertyOrder: ['metadata'],
      },
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  ClientAuthTokenData: {
    description: 'https://docs.cord.com/reference/authentication/',
    additionalProperties: true,
    type: 'object',
    properties: {
      app_id: { description: 'Your app ID', format: 'uuid', type: 'string' },
      user_id: { $ref: '#/definitions/ID', description: 'The ID for the user' },
      organization_id: {
        $ref: '#/definitions/ID',
        description: 'The ID for the user’s organization',
      },
      user_details: {
        description:
          'If present, update’s the user’s details, or creates a user with those\ndetails if the user_id is new to Cord. This is an object that contains the\nsame fields as the [user management REST\nendpoint](/rest-apis/users/)',
        $ref: '#/definitions/Partial<Omit<ServerUserData,"id"|"createdTimestamp">>',
      },
      organization_details: {
        description:
          'If present, update’s the organization’s details, or creates an organization\nwith those details if the organization_id is new to Cord. This is an object\nthat contains the same fields as the [organization management REST\nendpoint](/rest-apis/organizations/)',
        $ref: '#/definitions/Partial<ServerOrganizationData>',
      },
    },
    propertyOrder: [
      'app_id',
      'user_id',
      'organization_id',
      'user_details',
      'organization_details',
    ],
    required: ['app_id', 'organization_id', 'user_id'],
    definitions: {
      ID: { minLength: 1, maxLength: 128, type: ['string', 'number'] },
      'Partial<Omit<ServerUserData,"id"|"createdTimestamp">>': {
        type: 'object',
        properties: {
          name: { description: 'Full user name', type: ['null', 'string'] },
          metadata: {
            description:
              'Arbitrary key-value pairs that can be used to store additional information.',
            type: 'object',
            additionalProperties: { type: ['string', 'number', 'boolean'] },
            propertyOrder: [],
          },
          status: { enum: ['active', 'deleted'], type: 'string' },
          email: {
            description: 'Email address',
            format: 'email',
            type: 'string',
          },
          shortName: {
            description:
              'Short user name. In most cases, this will be preferred over name when set.',
            type: ['null', 'string'],
          },
          short_name: { type: ['null', 'string'] },
          profilePictureURL: {
            description:
              "This must be a valid URL, which means it needs to follow the usual URL\nformatting and encoding rules. For example, any space character will need\nto be encoded as `%20`. We recommend using your programming language's\nstandard URL encoding function, such as `encodeURI` in Javascript.",
            format: 'uri',
            type: ['null', 'string'],
          },
          profile_picture_url: {
            description:
              'Alias for profilePictureURL. This field is deprecated.',
            format: 'uri',
            type: ['null', 'string'],
          },
          first_name: {
            description:
              "User's first name. This field is deprecated and has no effect.",
            type: ['null', 'string'],
          },
          last_name: {
            description:
              "User's last name. This field is deprecated and has no effect.",
            type: ['null', 'string'],
          },
        },
        additionalProperties: false,
        propertyOrder: [
          'name',
          'metadata',
          'status',
          'email',
          'shortName',
          'short_name',
          'profilePictureURL',
          'profile_picture_url',
          'first_name',
          'last_name',
        ],
      },
      'Partial<ServerOrganizationData>': {
        type: 'object',
        properties: {
          name: { description: 'Organization name', type: 'string' },
          status: { enum: ['active', 'deleted'], type: 'string' },
          members: {
            description:
              'List of partner-specific IDs of the users who are members of this organization',
            type: 'array',
            items: { type: ['string', 'number'] },
          },
        },
        additionalProperties: false,
        propertyOrder: ['name', 'status', 'members'],
      },
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
} as const;

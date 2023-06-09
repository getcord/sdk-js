// @generated
export default {
  CreateNotificationVariables: {
    description: 'https://docs.cord.com/reference/rest-api/notifications',
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
  NotificationURLAttachment: {
    description: 'An attachment representing a URL.',
    type: 'object',
    properties: {
      url: {
        description:
          'The URL this attachment points to. This would typically be the URL to send\nthe browser to if this notification is clicked.',
        type: 'string',
      },
    },
    additionalProperties: false,
    propertyOrder: ['url'],
    required: ['url'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  NotificationMessageAttachment: {
    description: 'An attachment representing a message.',
    type: 'object',
    properties: {
      messageID: {
        description:
          'The ID of the message attached to this notification. For example, if this\nis a notification about being @-mentioned, this is the ID of the message\ncontaining that @-mention.',
        type: 'string',
      },
    },
    additionalProperties: false,
    propertyOrder: ['messageID'],
    required: ['messageID'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  NotificationTextHeader: {
    description: 'A header node representing a basic string.',
    type: 'object',
    properties: {
      text: {
        description:
          'The text to display. This text may start and/or end with whitespace, which\nshould typically *not* be trimmed. For example, in order to display the\nnotification `"Alice replied to your thread."`, this would typically be\ncomposed of two nodes -- a user node for Alice, and then a text node\ncontaining `" replied to your thread."`, with a meaningful space at the\nfront, to separate this node from Alice\'s name.',
        type: 'string',
      },
      bold: {
        description: 'Whether the text should be formatted in bold.',
        type: 'boolean',
      },
    },
    additionalProperties: false,
    propertyOrder: ['text', 'bold'],
    required: ['bold', 'text'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  NotificationUserHeader: {
    description: 'A header node representing a reference to a specific user.',
    type: 'object',
    properties: {
      userID: {
        description:
          "The user referenced. This node would typically be rendered by displaying\nthis user's name.",
        type: 'string',
      },
    },
    additionalProperties: false,
    propertyOrder: ['userID'],
    required: ['userID'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  NotificationVariables: {
    type: 'object',
    properties: {
      id: {
        description: 'The [ID](/reference/identifiers) for this notification.',
        type: 'string',
      },
      senderUserIDs: {
        description:
          'The [IDs](/reference/identifiers) of the user(s) who\nsent this notification. The Cord backend will sometimes aggregate multiple\nnotifications together, causing them to have multiple senders. For example,\nif multiple people react to the same message, that will generate only one\nnotification (but with multiple senders, one for each person who reacted).',
        type: 'array',
        items: { type: 'string' },
      },
      iconUrl: {
        description:
          "The URL of an icon image for this notification, if one was specified when\nit was created. This will always be `null` for Cord's internally-generated\nnotifications (i.e., it can only be non-null for notifications you create\nvia the REST API).",
        type: ['null', 'string'],
      },
      header: {
        description:
          'The "header" or "text" of the notification. This will represent text like\n"Alice replied to your thread." or similar. For notifications you create\nvia the REST API, this will be based upon the `template` parameter, see\nbelow.',
        type: 'array',
        items: {
          anyOf: [
            {
              description: 'A header node representing a basic string.',
              type: 'object',
              properties: {
                text: {
                  description:
                    'The text to display. This text may start and/or end with whitespace, which\nshould typically *not* be trimmed. For example, in order to display the\nnotification `"Alice replied to your thread."`, this would typically be\ncomposed of two nodes -- a user node for Alice, and then a text node\ncontaining `" replied to your thread."`, with a meaningful space at the\nfront, to separate this node from Alice\'s name.',
                  type: 'string',
                },
                bold: {
                  description: 'Whether the text should be formatted in bold.',
                  type: 'boolean',
                },
              },
              additionalProperties: false,
              propertyOrder: ['text', 'bold'],
              required: ['bold', 'text'],
            },
            {
              description:
                'A header node representing a reference to a specific user.',
              type: 'object',
              properties: {
                userID: {
                  description:
                    "The user referenced. This node would typically be rendered by displaying\nthis user's name.",
                  type: 'string',
                },
              },
              additionalProperties: false,
              propertyOrder: ['userID'],
              required: ['userID'],
            },
          ],
        },
      },
      attachment: {
        description:
          'Additional context attached to the notification. For example, if this\nnotification is about a new reaction on a message, the attachment will\nspecify what message received that new reaction.',
        anyOf: [
          {
            description: 'An attachment representing a URL.',
            type: 'object',
            properties: {
              url: {
                description:
                  'The URL this attachment points to. This would typically be the URL to send\nthe browser to if this notification is clicked.',
                type: 'string',
              },
            },
            additionalProperties: false,
            propertyOrder: ['url'],
            required: ['url'],
          },
          {
            description: 'An attachment representing a message.',
            type: 'object',
            properties: {
              messageID: {
                description:
                  'The ID of the message attached to this notification. For example, if this\nis a notification about being @-mentioned, this is the ID of the message\ncontaining that @-mention.',
                type: 'string',
              },
            },
            additionalProperties: false,
            propertyOrder: ['messageID'],
            required: ['messageID'],
          },
          { type: 'null' },
        ],
      },
      readStatus: {
        description:
          'Whether this notification has been read by the recipient yet.',
        enum: ['read', 'unread'],
        type: 'string',
      },
      timestamp: {
        description: 'The time this notification was sent.',
        type: 'string',
        format: 'date-time',
      },
      metadata: {
        description:
          "An arbitrary JSON object specified when the notification was created. This\nwill always be an empty object for Cord's internally-generated\nnotifications (i.e., it can only be non-null for notifications you create\nvia the REST API).",
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'id',
      'senderUserIDs',
      'iconUrl',
      'header',
      'attachment',
      'readStatus',
      'timestamp',
      'metadata',
    ],
    required: [
      'attachment',
      'header',
      'iconUrl',
      'id',
      'metadata',
      'readStatus',
      'senderUserIDs',
      'timestamp',
    ],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  PlatformUserVariables: {
    type: 'object',
    properties: {
      email: { description: 'Email address', format: 'email', type: 'string' },
      name: { description: 'Full user name', type: 'string' },
      shortName: {
        description:
          'Short user name. In most cases, this will be preferred over name when set.',
        type: 'string',
      },
      short_name: { type: 'string' },
      status: { enum: ['active', 'deleted'], type: 'string' },
      profilePictureURL: {
        anyOf: [
          {
            description:
              "This must be a valid URL, which means it needs to follow the usual URL\nformatting and encoding rules. For example, any space character will need\nto be encoded as `%20`. We recommend using your programming language's\nstandard URL encoding function, such as `encodeURI` in Javascript.",
            format: 'uri',
            type: ['null', 'string'],
          },
          { type: 'null' },
        ],
      },
      profile_picture_url: {
        anyOf: [{ format: 'uri', type: ['null', 'string'] }, { type: 'null' }],
      },
      first_name: {
        description:
          "User's first name. This field is deprecated and has no effect.",
        type: 'string',
      },
      last_name: {
        description:
          "User's last name. This field is deprecated and has no effect.",
        type: 'string',
      },
      metadata: {
        description:
          'Arbitrary key-value pairs that can be used to store additional information.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'email',
      'name',
      'shortName',
      'short_name',
      'status',
      'profilePictureURL',
      'profile_picture_url',
      'first_name',
      'last_name',
      'metadata',
    ],
    required: ['email'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  PlatformOrganizationVariables: {
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
    required: ['name'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  UpdatePlatformUserVariables: {
    description: 'https://docs.cord.com/reference/rest-api/users/',
    type: 'object',
    properties: {
      email: { description: 'Email address', format: 'email', type: 'string' },
      name: { description: 'Full user name', type: 'string' },
      shortName: {
        description:
          'Short user name. In most cases, this will be preferred over name when set.',
        type: 'string',
      },
      short_name: { type: 'string' },
      status: { enum: ['active', 'deleted'], type: 'string' },
      profilePictureURL: {
        anyOf: [
          {
            description:
              "This must be a valid URL, which means it needs to follow the usual URL\nformatting and encoding rules. For example, any space character will need\nto be encoded as `%20`. We recommend using your programming language's\nstandard URL encoding function, such as `encodeURI` in Javascript.",
            format: 'uri',
            type: ['null', 'string'],
          },
          { type: 'null' },
        ],
      },
      profile_picture_url: {
        anyOf: [{ format: 'uri', type: ['null', 'string'] }, { type: 'null' }],
      },
      first_name: {
        description:
          "User's first name. This field is deprecated and has no effect.",
        type: 'string',
      },
      last_name: {
        description:
          "User's last name. This field is deprecated and has no effect.",
        type: 'string',
      },
      metadata: {
        description:
          'Arbitrary key-value pairs that can be used to store additional information.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'email',
      'name',
      'shortName',
      'short_name',
      'status',
      'profilePictureURL',
      'profile_picture_url',
      'first_name',
      'last_name',
      'metadata',
    ],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  UpdatePlatformOrganizationVariables: {
    description: 'https://docs.cord.com/reference/rest-api/organizations/',
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
    description: 'https://docs.cord.com/reference/rest-api/organizations/',
    type: 'object',
    properties: {
      add: { type: 'array', items: { type: ['string', 'number'] } },
      remove: { type: 'array', items: { type: ['string', 'number'] } },
    },
    additionalProperties: false,
    propertyOrder: ['add', 'remove'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  ThreadVariables: {
    type: 'object',
    properties: {
      id: { description: 'The ID for this thread.', type: 'string' },
      organizationID: {
        description: 'The organization ID this thread is in.',
        type: 'string',
      },
      total: {
        description: 'The total number of messages in this thread.',
        type: 'number',
      },
      resolved: {
        description:
          'Whether this thread is resolved. In a GET request, this is equivalent to\n`!!resolvedTimestamp`. In a PUT request, setting this to `true` is\nequivalent to setting `resolvedTimestamp` to the current time, and setting\nthis to `false` is equivalent to setting `resolvedTimestamp` to `null`.',
        type: 'boolean',
      },
      resolvedTimestamp: {
        description:
          'The timestamp when this thread was resolved. Set to `null` if this thread\nis not resolved.',
        anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }],
      },
      participants: {
        description: 'All of the users who are subscribed to this thread.',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            lastSeenTimestamp: {
              description:
                'The timestamp of the most recent message or reaction that this user has\nseen in this thread. Is `null` if this participant has never viewed this\nthread.',
              anyOf: [
                { type: 'string', format: 'date-time' },
                { type: 'null' },
              ],
            },
            userID: {
              description:
                "The user ID of the participant. Can be null if the current viewer no longer\nshares an [organization](/reference/rest-api/organizations) with this\nparticipant (and therefore can no longer access that participant's\ninformation).",
              type: ['null', 'string'],
            },
          },
          additionalProperties: false,
          propertyOrder: ['lastSeenTimestamp', 'userID'],
          required: ['lastSeenTimestamp', 'userID'],
        },
      },
      name: { description: 'The name of this thread.', type: 'string' },
      location: {
        description: 'The [location](/reference/location) of this thread.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
      metadata: {
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'id',
      'organizationID',
      'total',
      'resolved',
      'resolvedTimestamp',
      'participants',
      'name',
      'location',
      'metadata',
    ],
    required: [
      'id',
      'location',
      'metadata',
      'name',
      'organizationID',
      'participants',
      'resolved',
      'resolvedTimestamp',
      'total',
    ],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  ThreadParticipant: {
    type: 'object',
    properties: {
      lastSeenTimestamp: {
        description:
          'The timestamp of the most recent message or reaction that this user has\nseen in this thread. Is `null` if this participant has never viewed this\nthread.',
        anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }],
      },
      userID: {
        description:
          "The user ID of the participant. Can be null if the current viewer no longer\nshares an [organization](/reference/rest-api/organizations) with this\nparticipant (and therefore can no longer access that participant's\ninformation).",
        type: ['null', 'string'],
      },
    },
    additionalProperties: false,
    propertyOrder: ['lastSeenTimestamp', 'userID'],
    required: ['lastSeenTimestamp', 'userID'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  UpdateThreadVariables: {
    description: 'https://docs.cord.com/reference/rest-api/threads/',
    type: 'object',
    properties: {
      location: {
        description: 'The [location](/reference/location) of this thread.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
      id: { description: 'The ID for this thread.', type: 'string' },
      name: { description: 'The name of this thread.', type: 'string' },
      metadata: {
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
      resolved: {
        description:
          'Whether this thread is resolved. In a GET request, this is equivalent to\n`!!resolvedTimestamp`. In a PUT request, setting this to `true` is\nequivalent to setting `resolvedTimestamp` to the current time, and setting\nthis to `false` is equivalent to setting `resolvedTimestamp` to `null`.',
        type: 'boolean',
      },
      userID: {
        description:
          'Certain changes to the thread may post a message into the thread -- in\nparticular, resolving or unresolving a thread posts a message into the\nthread saying "User un/resolved this thread". This parameter is the ID of\nthe User who will be listed as the author of that message. It\'s optional\n-- if no user is specified, then those messages won\'t get posted.',
        type: 'string',
      },
      typing: {
        description:
          'Triggers the typing indicator, or adds an additional user to the existing\ntyping indicator in the thread and lasts for 3 seconds.\nPass an empty array to clear all users typing. Automatically triggers\nwhen a user is writing something in a Cord component.',
        type: 'array',
        items: { type: ['string', 'number'] },
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'location',
      'id',
      'name',
      'metadata',
      'resolvedTimestamp',
      'organizationID',
      'resolved',
      'userID',
      'typing',
    ],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  BatchAPIVariables: {
    description: 'https://docs.cord.com/reference/rest-api/batch/',
    type: 'object',
    properties: {
      users: {
        description:
          'List of user objects. Every object must include the id field. If the user\nalready exists, all other fields are optional and only updated when\npresent. If the user does not already exist, fields are required as\ndescribed in the [Create or update a\nuser](/reference/rest-api/organizations/#create-or-update-an-organization)\nAPI.',
        maxItems: 10000,
        type: 'array',
        items: {
          additionalProperties: false,
          type: 'object',
          properties: {
            email: {
              description: 'Email address',
              format: 'email',
              type: 'string',
            },
            name: { description: 'Full user name', type: 'string' },
            shortName: {
              description:
                'Short user name. In most cases, this will be preferred over name when set.',
              type: 'string',
            },
            short_name: { type: 'string' },
            status: { enum: ['active', 'deleted'], type: 'string' },
            profilePictureURL: {
              anyOf: [
                {
                  description:
                    "This must be a valid URL, which means it needs to follow the usual URL\nformatting and encoding rules. For example, any space character will need\nto be encoded as `%20`. We recommend using your programming language's\nstandard URL encoding function, such as `encodeURI` in Javascript.",
                  format: 'uri',
                  type: ['null', 'string'],
                },
                { type: 'null' },
              ],
            },
            profile_picture_url: {
              anyOf: [
                { format: 'uri', type: ['null', 'string'] },
                { type: 'null' },
              ],
            },
            first_name: {
              description:
                "User's first name. This field is deprecated and has no effect.",
              type: 'string',
            },
            last_name: {
              description:
                "User's last name. This field is deprecated and has no effect.",
              type: 'string',
            },
            metadata: {
              description:
                'Arbitrary key-value pairs that can be used to store additional information.',
              type: 'object',
              additionalProperties: { type: ['string', 'number', 'boolean'] },
              propertyOrder: [],
            },
            id: { $ref: '#/definitions/ID' },
          },
          required: ['id'],
        },
      },
      organizations: {
        description:
          'List of organization objects. Every object must include the id field. If\nthe organization already exists, all other fields are optional and only\nupdated when present. If the organization does not already exist, fields\nare required as described in the [Create or update an\norganization](/reference/rest-api/organizations/#create-or-update-an-organization)\nAPI.',
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
          'If present, update’s the user’s details, or creates a user with those\ndetails if the user_id is new to Cord. This is an object that contains the\nsame fields as the [user management REST\nendpoint](/reference/rest-api/users/)',
        $ref: '#/definitions/PlatformUserVariables',
      },
      organization_details: {
        description:
          'If present, update’s the organization’s details, or creates an organization\nwith those details if the organization_id is new to Cord. This is an object\nthat contains the same fields as the [organization management REST\nendpoint](/reference/rest-api/organizations/)',
        $ref: '#/definitions/PlatformOrganizationVariables',
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
      PlatformUserVariables: {
        type: 'object',
        properties: {
          email: {
            description: 'Email address',
            format: 'email',
            type: 'string',
          },
          name: { description: 'Full user name', type: 'string' },
          shortName: {
            description:
              'Short user name. In most cases, this will be preferred over name when set.',
            type: 'string',
          },
          short_name: { type: 'string' },
          status: { enum: ['active', 'deleted'], type: 'string' },
          profilePictureURL: {
            anyOf: [
              {
                description:
                  "This must be a valid URL, which means it needs to follow the usual URL\nformatting and encoding rules. For example, any space character will need\nto be encoded as `%20`. We recommend using your programming language's\nstandard URL encoding function, such as `encodeURI` in Javascript.",
                format: 'uri',
                type: ['null', 'string'],
              },
              { type: 'null' },
            ],
          },
          profile_picture_url: {
            anyOf: [
              { format: 'uri', type: ['null', 'string'] },
              { type: 'null' },
            ],
          },
          first_name: {
            description:
              "User's first name. This field is deprecated and has no effect.",
            type: 'string',
          },
          last_name: {
            description:
              "User's last name. This field is deprecated and has no effect.",
            type: 'string',
          },
          metadata: {
            description:
              'Arbitrary key-value pairs that can be used to store additional information.',
            type: 'object',
            additionalProperties: { type: ['string', 'number', 'boolean'] },
            propertyOrder: [],
          },
        },
        additionalProperties: false,
        propertyOrder: [
          'email',
          'name',
          'shortName',
          'short_name',
          'status',
          'profilePictureURL',
          'profile_picture_url',
          'first_name',
          'last_name',
          'metadata',
        ],
        required: ['email'],
      },
      PlatformOrganizationVariables: {
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
        required: ['name'],
      },
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  CreateApplicationVariables: {
    type: 'object',
    properties: {
      name: {
        description: 'Name of the application',
        minLength: 1,
        type: 'string',
      },
      iconURL: {
        description:
          'URL for the application icon. It should be a square image of 256x256.\nThis will be used as the avatar for messages and emails coming from your application.',
        format: 'uri',
        type: 'string',
      },
    },
    additionalProperties: false,
    propertyOrder: ['name', 'iconURL'],
    required: ['name'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  UpdateApplicationVariables: {
    description: 'https://docs.cord.com/reference/rest-api/applications/',
    type: 'object',
    properties: {
      name: {
        description: 'Name of the application',
        minLength: 1,
        type: 'string',
      },
      iconURL: {
        description:
          'URL for the application icon. It should be a square image of 256x256.\nThis will be used as the avatar for messages and emails coming from your application.',
        format: 'uri',
        type: 'string',
      },
    },
    additionalProperties: false,
    propertyOrder: ['name', 'iconURL'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  DeleteApplicationVariables: {
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
  CreatePlatformUserVariables: {
    additionalProperties: false,
    type: 'object',
    properties: {
      email: { description: 'Email address', format: 'email', type: 'string' },
      name: { description: 'Full user name', type: 'string' },
      shortName: {
        description:
          'Short user name. In most cases, this will be preferred over name when set.',
        type: 'string',
      },
      short_name: { type: 'string' },
      status: { enum: ['active', 'deleted'], type: 'string' },
      profilePictureURL: {
        anyOf: [
          {
            description:
              "This must be a valid URL, which means it needs to follow the usual URL\nformatting and encoding rules. For example, any space character will need\nto be encoded as `%20`. We recommend using your programming language's\nstandard URL encoding function, such as `encodeURI` in Javascript.",
            format: 'uri',
            type: ['null', 'string'],
          },
          { type: 'null' },
        ],
      },
      profile_picture_url: {
        anyOf: [{ format: 'uri', type: ['null', 'string'] }, { type: 'null' }],
      },
      first_name: {
        description:
          "User's first name. This field is deprecated and has no effect.",
        type: 'string',
      },
      last_name: {
        description:
          "User's last name. This field is deprecated and has no effect.",
        type: 'string',
      },
      metadata: {
        description:
          'Arbitrary key-value pairs that can be used to store additional information.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
      id: { $ref: '#/definitions/ID' },
    },
    required: ['email', 'id'],
    definitions: {
      ID: { minLength: 1, maxLength: 128, type: ['string', 'number'] },
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  CreatePlatformOrganizationVariables: {
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
    required: ['id', 'name'],
    definitions: {
      ID: { minLength: 1, maxLength: 128, type: ['string', 'number'] },
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  MessageVariables: {
    type: 'object',
    properties: {
      id: { description: 'The ID for the message.', type: 'string' },
      authorID: {
        description: 'The ID for the user that sent the message.',
        type: 'string',
      },
      organizationID: {
        description: 'The ID for the organization this message belongs to.',
        type: 'string',
      },
      threadID: {
        description: 'The ID for the thread this message is part of.',
        type: 'string',
      },
      content: {
        description: 'The content of the message.',
        type: 'array',
        items: { type: 'object', properties: {}, additionalProperties: true },
      },
      url: {
        description:
          "A URL where the message can be seen.  This determines where a user is sent\nwhen they click on a reference to this message, such as in a notification.\nIf unset, it defaults to the thread's URL.",
        type: ['null', 'string'],
      },
      createdTimestamp: {
        description:
          'The timestamp when this message was created.  The default value is the\ncurrent time.',
        anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }],
      },
      deletedTimestamp: {
        description:
          'The timestamp when this message was deleted, if it was.  If unset, the\nmessage is not deleted.',
        anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }],
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
      type: {
        description:
          'The type of message this is.  A `user_message` is a message that the author\nsent.  An `action_message` is a message about something that happened, such\nas the thread being resolved.  The default value is `user_message`.',
        enum: ['action_message', 'user_message'],
        type: 'string',
      },
      metadata: {
        description:
          'Arbitrary key-value pairs that can be used to store additional information.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'id',
      'authorID',
      'organizationID',
      'threadID',
      'content',
      'url',
      'createdTimestamp',
      'deletedTimestamp',
      'updatedTimestamp',
      'iconURL',
      'type',
      'metadata',
    ],
    required: [
      'authorID',
      'content',
      'createdTimestamp',
      'deletedTimestamp',
      'iconURL',
      'id',
      'metadata',
      'organizationID',
      'threadID',
      'type',
      'updatedTimestamp',
      'url',
    ],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  CreateMessageVariables: {
    type: 'object',
    properties: {
      createThread: {
        description:
          "The parameters for creating a thread if the supplied thread doesn't exist\nyet.  If the thread doesn't exist but `createThread` isn't provided, the\ncall will generate an error.  This value is ignored if the thread already\nexists.",
        $ref: '#/definitions/CreateThreadVariables',
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
        anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }],
      },
      deletedTimestamp: {
        description:
          'The timestamp when this message was deleted, if it was.  If unset, the\nmessage is not deleted.',
        anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }],
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
    },
    additionalProperties: false,
    propertyOrder: [
      'createThread',
      'id',
      'content',
      'authorID',
      'type',
      'url',
      'metadata',
      'createdTimestamp',
      'deletedTimestamp',
      'updatedTimestamp',
      'iconURL',
    ],
    required: ['authorID', 'content', 'id'],
    definitions: {
      CreateThreadVariables: {
        type: 'object',
        properties: {
          location: {
            description: 'The [location](/reference/location) of the thread.',
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
              'The name of the thread.  This is shown to users when the thread is\nreferenced, such as in notifications.  You should use something like the\npage title here.',
            type: 'string',
          },
          organizationID: {
            description: 'The organization that the thread belongs to.',
            type: 'string',
          },
          metadata: {
            description:
              'Arbitrary key-value pairs that can be used to store additional information.',
            type: 'object',
            additionalProperties: { type: ['string', 'number', 'boolean'] },
            propertyOrder: [],
          },
        },
        additionalProperties: false,
        propertyOrder: [
          'location',
          'url',
          'name',
          'organizationID',
          'metadata',
        ],
        required: ['location', 'name', 'organizationID', 'url'],
      },
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  UpdateMessageVariables: {
    type: 'object',
    properties: {
      deleted: {
        description:
          'Whether we want to mark this message as deleted. Setting this to `true` without\nproviding a value for `deletedTimestamp` is equivalent to setting `deletedTimestamp` to current\ntime and setting this to `false` is equivalent to setting `deletedTimestamp` to `null`.',
        type: 'boolean',
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
      deletedTimestamp: {
        description:
          'The timestamp when this message was deleted, if it was.  If unset, the\nmessage is not deleted.',
        anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }],
      },
      updatedTimestamp: {
        description:
          'The timestamp when this message was last edited, if it ever was.  If unset,\nthe message does not show as edited.',
        anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }],
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'deleted',
      'id',
      'url',
      'content',
      'metadata',
      'deletedTimestamp',
      'updatedTimestamp',
    ],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  CreateThreadVariables: {
    type: 'object',
    properties: {
      location: {
        description: 'The [location](/reference/location) of the thread.',
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
          'The name of the thread.  This is shown to users when the thread is\nreferenced, such as in notifications.  You should use something like the\npage title here.',
        type: 'string',
      },
      organizationID: {
        description: 'The organization that the thread belongs to.',
        type: 'string',
      },
      metadata: {
        description:
          'Arbitrary key-value pairs that can be used to store additional information.',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
    },
    additionalProperties: false,
    propertyOrder: ['location', 'url', 'name', 'organizationID', 'metadata'],
    required: ['location', 'name', 'organizationID', 'url'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
} as const;

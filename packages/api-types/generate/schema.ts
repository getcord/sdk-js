// @generated
export default {
  PlatformUserVariables: {
    type: 'object',
    properties: {
      email: { description: 'Email address', format: 'email', type: 'string' },
      name: { description: 'Full user name', type: 'string' },
      short_name: {
        description:
          'Short user name. In most cases, this will be preferred over name when set.',
        type: 'string',
      },
      status: { enum: ['active', 'deleted'], type: 'string' },
      profile_picture_url: {
        anyOf: [
          {
            description:
              "This must be a valid URL, which means it needs to follow the usual URL\nformatting and encoding rules. For example, any space character will need\nto be encoded as `%20`. We recommend using your programming language's\nstandard URL encoding function, such as `encodeURI` in Javascript.",
            format: 'uri',
            type: 'string',
          },
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
      'short_name',
      'status',
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
      short_name: {
        description:
          'Short user name. In most cases, this will be preferred over name when set.',
        type: 'string',
      },
      status: { enum: ['active', 'deleted'], type: 'string' },
      profile_picture_url: {
        anyOf: [
          {
            description:
              "This must be a valid URL, which means it needs to follow the usual URL\nformatting and encoding rules. For example, any space character will need\nto be encoded as `%20`. We recommend using your programming language's\nstandard URL encoding function, such as `encodeURI` in Javascript.",
            format: 'uri',
            type: 'string',
          },
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
      'short_name',
      'status',
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
  UpdateThreadVariables: {
    description: 'https://docs.cord.com/reference/rest-api/threads/',
    type: 'object',
    properties: {
      location: {
        description:
          '`FlatJsonObject` is an object where all values are simple, scalar types\n(string, number or boolean).',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
      id: { type: 'string' },
      name: { type: 'string' },
      resolvedTimestamp: { type: 'string', format: 'date-time' },
      organizationID: { type: 'string' },
      resolved: { type: 'boolean' },
      userID: { type: 'string' },
    },
    additionalProperties: false,
    propertyOrder: [
      'location',
      'id',
      'name',
      'resolvedTimestamp',
      'organizationID',
      'resolved',
      'userID',
    ],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
  BatchAPIVariables: {
    description: 'https://docs.cord.com/reference/rest-api/batch/',
    type: 'object',
    properties: {
      users: {
        description:
          'List of user objects. Every object must include the id field. If the user\nalready exists, all other fields are optional and only updated when\npresent. If the user does not already exist, fields are required as\ndescribed in the [Create or update a\nuser](https://docs.cord.com/reference/rest-api/organizations/#create-or-update-an-organization)\nAPI.',
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
            short_name: {
              description:
                'Short user name. In most cases, this will be preferred over name when set.',
              type: 'string',
            },
            status: { enum: ['active', 'deleted'], type: 'string' },
            profile_picture_url: {
              anyOf: [
                {
                  description:
                    "This must be a valid URL, which means it needs to follow the usual URL\nformatting and encoding rules. For example, any space character will need\nto be encoded as `%20`. We recommend using your programming language's\nstandard URL encoding function, such as `encodeURI` in Javascript.",
                  format: 'uri',
                  type: 'string',
                },
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
          'List of organization objects. Every object must include the id field. If\nthe organization already exists, all other fields are optional and only\nupdated when present. If the organization does not already exist, fields\nare required as described in the [Create or update an\norganization](https://docs.cord.com/reference/rest-api/organizations/#create-or-update-an-organization)\nAPI.',
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
        $ref: '#/definitions/PlatformUserVariables',
        description:
          'If present, update’s the user’s details, or creates a user with those\ndetails if the user_id is new to Cord. This is an object that contains the\nsame fields as the [user management REST\nendpoint](https://docs.cord.com/reference/rest-api/users/)',
      },
      organization_details: {
        $ref: '#/definitions/PlatformOrganizationVariables',
        description:
          'If present, update’s the organization’s details, or creates an organization\nwith those details if the organization_id is new to Cord. This is an object\nthat contains the same fields as the [organization management REST\nendpoint](https://docs.cord.com/reference/rest-api/organizations/)',
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
          short_name: {
            description:
              'Short user name. In most cases, this will be preferred over name when set.',
            type: 'string',
          },
          status: { enum: ['active', 'deleted'], type: 'string' },
          profile_picture_url: {
            anyOf: [
              {
                description:
                  "This must be a valid URL, which means it needs to follow the usual URL\nformatting and encoding rules. For example, any space character will need\nto be encoded as `%20`. We recommend using your programming language's\nstandard URL encoding function, such as `encodeURI` in Javascript.",
                format: 'uri',
                type: 'string',
              },
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
          'short_name',
          'status',
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
  CreateNotificationVariables: {
    type: 'object',
    properties: {
      actor_id: { type: 'string' },
      recipient_id: { type: 'string' },
      template: { type: 'string' },
      url: { type: 'string' },
      type: { type: 'string', enum: ['url'] },
      metadata: {
        description:
          '`FlatJsonObject` is an object where all values are simple, scalar types\n(string, number or boolean).',
        type: 'object',
        additionalProperties: { type: ['string', 'number', 'boolean'] },
        propertyOrder: [],
      },
    },
    additionalProperties: false,
    propertyOrder: [
      'actor_id',
      'recipient_id',
      'template',
      'url',
      'type',
      'metadata',
    ],
    required: ['actor_id', 'recipient_id', 'template', 'type', 'url'],
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
      short_name: {
        description:
          'Short user name. In most cases, this will be preferred over name when set.',
        type: 'string',
      },
      status: { enum: ['active', 'deleted'], type: 'string' },
      profile_picture_url: {
        anyOf: [
          {
            description:
              "This must be a valid URL, which means it needs to follow the usual URL\nformatting and encoding rules. For example, any space character will need\nto be encoded as `%20`. We recommend using your programming language's\nstandard URL encoding function, such as `encodeURI` in Javascript.",
            format: 'uri',
            type: 'string',
          },
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
  CreateMessageVariables: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      authorID: { type: 'string' },
      content: {
        type: 'array',
        items: { type: 'object', properties: {}, additionalProperties: true },
      },
      url: { type: 'string' },
      createdTimestamp: { type: 'string', format: 'date-time' },
      deletedTimestamp: { type: 'string', format: 'date-time' },
      updatedTimestamp: { type: 'string', format: 'date-time' },
      location: { type: 'string' },
    },
    additionalProperties: false,
    propertyOrder: [
      'id',
      'authorID',
      'content',
      'url',
      'createdTimestamp',
      'deletedTimestamp',
      'updatedTimestamp',
      'location',
    ],
    required: ['authorID', 'content', 'id'],
    $schema: 'http://json-schema.org/draft-07/schema#',
  },
} as const;

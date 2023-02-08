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
      profile_picture_url: { format: 'uri', type: 'string' },
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
      profile_picture_url: { format: 'uri', type: 'string' },
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
            profile_picture_url: { format: 'uri', type: 'string' },
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
    description: 'https://docs.cord.com/in-depth/authentication/',
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
          profile_picture_url: { format: 'uri', type: 'string' },
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
    },
    additionalProperties: false,
    propertyOrder: ['actor_id', 'recipient_id', 'template', 'url', 'type'],
    required: ['actor_id', 'recipient_id', 'template', 'type', 'url'],
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
      profile_picture_url: { format: 'uri', type: 'string' },
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
} as const;

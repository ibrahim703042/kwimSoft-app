const API_HOST = process.env.VITE_API_HOST || 'http://localhost';

module.exports = {
  // User Management Service (port 9080)
  userService: {
    input: {
      target: `${API_HOST}:9080/v3/api-docs`,
    },
    output: {
      target: './packages/api-client/src/generated/user-management/index.ts',
      schemas: './packages/api-client/src/generated/user-management/schemas',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'tags-split',
      prettier: true,
      override: {
        mutator: {
          path: './packages/api-client/src/generated/axios-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },

  // HR Service (port 9081)
  hrService: {
    input: {
      target: `${API_HOST}:9081/v3/api-docs`,
    },
    output: {
      target: './packages/api-client/src/generated/hr/index.ts',
      schemas: './packages/api-client/src/generated/hr/schemas',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'tags-split',
      prettier: true,
      override: {
        mutator: {
          path: './packages/api-client/src/generated/axios-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },

  // Product Service (port 9082)
  productService: {
    input: {
      target: `${API_HOST}:9082/v3/api-docs`,
    },
    output: {
      target: './packages/api-client/src/generated/product/index.ts',
      schemas: './packages/api-client/src/generated/product/schemas',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'tags-split',
      prettier: true,
      override: {
        mutator: {
          path: './packages/api-client/src/generated/axios-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },

  // Inventory/Stock Service (port 9083)
  inventoryService: {
    input: {
      target: `${API_HOST}:9083/v3/api-docs`,
    },
    output: {
      target: './packages/api-client/src/generated/inventory/index.ts',
      schemas: './packages/api-client/src/generated/inventory/schemas',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'tags-split',
      prettier: true,
      override: {
        mutator: {
          path: './packages/api-client/src/generated/axios-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },

  // Transport Service (port 9084)
  transportService: {
    input: {
      target: `${API_HOST}:9084/v3/api-docs`,
    },
    output: {
      target: './packages/api-client/src/generated/transport/index.ts',
      schemas: './packages/api-client/src/generated/transport/schemas',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'tags-split',
      prettier: true,
      override: {
        mutator: {
          path: './packages/api-client/src/generated/axios-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },

  // API Gateway (port 9089)
  gatewayService: {
    input: {
      target: `${API_HOST}:9089/v3/api-docs`,
    },
    output: {
      target: './packages/api-client/src/generated/gateway/index.ts',
      schemas: './packages/api-client/src/generated/gateway/schemas',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'tags-split',
      prettier: true,
      override: {
        mutator: {
          path: './packages/api-client/src/generated/axios-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
};

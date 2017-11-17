define({ "api": [
  {
    "type": "get",
    "url": "/auth/login",
    "title": "Get informations on how to login",
    "name": "Google_Login_Instructions",
    "group": "Authentication",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>An instruction message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>The URL to visit to authenticate</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/auth_routes.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "get",
    "url": "/auth/google",
    "title": "Authenticate via Google service",
    "name": "Google_authentication",
    "group": "Authentication",
    "version": "0.0.0",
    "filename": "api/auth_routes.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "get",
    "url": "/auth/token",
    "title": "Get the token to use APIs",
    "name": "Token_generator",
    "group": "Authentication",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>The token generated</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "GoogleAuthenticatedProfessor",
        "title": "Any authenticated Professor, loggedIn with Google",
        "description": "<p>Restrict access to token generation.</p>"
      }
    ],
    "version": "0.0.0",
    "filename": "api/auth_routes.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "get",
    "url": "/auth",
    "title": "Welcome message",
    "name": "_auth",
    "group": "Authentication",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>message informing the service is working.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/auth_routes.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "get",
    "url": "/api/",
    "title": "Welcome message",
    "name": "_api_",
    "group": "General",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>message informing the service is working.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes.js",
    "groupTitle": "General"
  },
  {
    "type": "delete",
    "url": "/api/professors/:id",
    "title": "Delete professor with specified ID",
    "name": "Delete_professor",
    "group": "Professors",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "status",
            "optional": false,
            "field": "Boolean",
            "description": "<p>value, true if the deletion was successful.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProfessorNotDeleted",
            "description": "<p>An information message (encapsulated in a JSON Object named error).</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "AuthenticatedProfessor",
        "title": "Any authenticated Professor",
        "description": "<p>Restrict access to write, update and delete options. Read the Wiki to know how to include a token in your request</p>"
      }
    ],
    "version": "0.0.0",
    "filename": "api/routes.js",
    "groupTitle": "Professors"
  },
  {
    "type": "get",
    "url": "/api/professors/:id",
    "title": "Get  professor with specified ID",
    "name": "Get_professor_by_id",
    "group": "Professors",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "JSON",
            "description": "<p>object reppresenting the professor.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProfessorNotFound",
            "description": "<p>An information message (encapsulated in a JSON Object named error).</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes.js",
    "groupTitle": "Professors"
  },
  {
    "type": "get",
    "url": "/api/professors/",
    "title": "Get all professors in DB",
    "name": "Get_professors_list",
    "group": "Professors",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "JSON",
            "description": "<p>array with all professors in DB.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes.js",
    "groupTitle": "Professors"
  },
  {
    "type": "put",
    "url": "/api/professors/:id",
    "title": "Update professor with specified ID",
    "name": "Update_professor_by_id",
    "group": "Professors",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "status",
            "optional": false,
            "field": "Boolean",
            "description": "<p>value, true if the update was successful.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "JSON",
            "description": "<p>object with all the fields of the professor (modified).</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProfessorNotUpdated",
            "description": "<p>An information message (encapsulated in a JSON Object named error).</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "AuthenticatedProfessor",
        "title": "Any authenticated Professor",
        "description": "<p>Restrict access to write, update and delete options. Read the Wiki to know how to include a token in your request</p>"
      }
    ],
    "version": "0.0.0",
    "filename": "api/routes.js",
    "groupTitle": "Professors"
  },
  {
    "type": "delete",
    "url": "/api/topics/:id",
    "title": "Delete topic with specified ID",
    "name": "Delete_topic",
    "group": "Topics",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "status",
            "optional": false,
            "field": "Boolean",
            "description": "<p>value, true if the deletion was successful.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TopicNotDeleted",
            "description": "<p>An information message (encapsulated in a JSON Object named error).</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "AuthenticatedProfessor",
        "title": "Any authenticated Professor",
        "description": "<p>Restrict access to write, update and delete options. Read the Wiki to know how to include a token in your request</p>"
      }
    ],
    "version": "0.0.0",
    "filename": "api/routes.js",
    "groupTitle": "Topics"
  },
  {
    "type": "get",
    "url": "/api/topics",
    "title": "Get topics by filters",
    "name": "Get_topics_by_filters",
    "group": "Topics",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "professor_id",
            "description": "<p>The professor_id whose topics we are looking for.</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "category",
            "description": "<p>The category whose topics we are looking for.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "JSON",
            "description": "<p>object contain a list of objects (topics).</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TopicNotFound",
            "description": "<p>An information message (encapsulated in a JSON Object named error).</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes.js",
    "groupTitle": "Topics"
  },
  {
    "type": "get",
    "url": "/api/categories",
    "title": "Get topics categories",
    "name": "Get_topics_categories",
    "group": "Topics",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "max",
            "description": "<p>The maximum number of categories returned (default 20).</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "get_defaults",
            "description": "<p>Get defaults categories</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "JSON",
            "description": "<p>object contain a list of topics categories.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoCategory",
            "description": "<p>An information message (encapsulated in a JSON Object named error).</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/routes.js",
    "groupTitle": "Topics"
  },
  {
    "type": "put",
    "url": "/api/topics/:id",
    "title": "Update topic with specified id",
    "name": "Update_topic_by_id",
    "group": "Topics",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "status",
            "optional": false,
            "field": "Boolean",
            "description": "<p>value, true if the update was successful.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "JSON",
            "description": "<p>object with all the fields of the topic (modified).</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "TopicNotUpdated",
            "description": "<p>An information message (encapsulated in a JSON Object named error).</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "AuthenticatedProfessor",
        "title": "Any authenticated Professor",
        "description": "<p>Restrict access to write, update and delete options. Read the Wiki to know how to include a token in your request</p>"
      }
    ],
    "version": "0.0.0",
    "filename": "api/routes.js",
    "groupTitle": "Topics"
  }
] });

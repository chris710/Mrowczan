RESOURCE_METHODS = ['GET', 'POST', 'DELETE']    # /user
ITEM_METHODS = ['GET', 'PATCH', 'DELETE']   # /item/id
X_DOMAINS = '*'
X_HEADERS = ['Authorization', 'If-Match', 'Access-Control-Expose-Headers', 'Content-Type', 'Pragma', 'Cache-Control']
X_EXPOSE_HEADERS = ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
# EXTENDED_MEDIA_INFO: TRUE
DOMAIN = {
    'user': {
        'schema': {
            'firstname': {
                'type': 'string'
            },
            'lastname': {
                'type': 'string'
            },
            'username': {
                'type': 'string',
                'unique': True
            },
            'password': {
                'type': 'string'
            },
            'phone': {
                'type': 'string'
            }
        },
        'additional_lookup': {
            'url': 'regex("[\w]+")',
            'field': 'username',
        }
    },
    'item': {
        'MONGO_QUERY_BLACKLIST' : ['$where'],
        'schema': {
            'name': {
                'type': 'string'
            },
            'image': {
                'type': 'string'       # żarcik
            },
            'username': {
                'type': 'string'
            },
            'thread': {
                'type': 'objectid',
                'data_relation': {
                    'resource': 'threads'
                },
                # 'required': True,
            }
        },
        'resource_methods': ['GET', 'POST', 'DELETE'],
    },
    'threads': {
        'schema': {
            'name': {
                'type': 'string'
            }
        },
        'board': {
            'type': 'objectid',
            'data_relation': {
                'resource': 'boards'
            },
            # 'required': True,
        }
    },
    'boards': {
        'schema': {
            'name': {
                'type': 'string'
            }
        }
    }
}
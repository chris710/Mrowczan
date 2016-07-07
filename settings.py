RESOURCE_METHODS = ['GET', 'POST']
ITEM_METHODS = ['GET', 'PATCH', 'DELETE']
X_DOMAINS = '*'
X_HEADERS = ['Authorization', 'If-Match', 'Access-Control-Expose-Headers', 'Content-Type', 'Pragma', 'Cache-Control']
X_EXPOSE_HEADERS = ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
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
            'username': {
                'type': 'string'
            }
        },
        'resource_methods': ['GET', 'POST', 'DELETE'],
    }
}
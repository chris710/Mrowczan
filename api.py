from eve import Eve
from eve.auth import BasicAuth
from flask.ext.bootstrap import Bootstrap
from eve_docs import eve_docs


class Authenticate(BasicAuth):
    def check_auth(self, username, password, allowed_roles, resource, method):
        if resource == 'user' and method == 'GET':
            user = app.data.driver.db['user']
            user = user.find_one({'username': username, 'password': password})
            if user:
                return True
            else:
                return False
        elif resource == 'user' and method == 'POST':
            return username == 'admin' and password == 'admin'
        else:
            return True


if __name__ == '__main__':
    app = Eve(auth=Authenticate)
    Bootstrap(app)
    app.register_blueprint(eve_docs, url_prefix='/docs')
    app.run()


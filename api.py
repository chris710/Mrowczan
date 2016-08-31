from eve import Eve
from eve.auth import BasicAuth
from flask import abort
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

# TOdO delete all posts in thread
def remove_thread_items(thread):
    users = app.data.driver.db['user']
    user = users.find_one({"_id": thread[0]['op']})
    if user != None:
        app.data.driver.db['item'].delete({"thread": thread['_id']})
    else:
        abort(401)

# TODO when deleting user/thread delete all posts there
def remove_user_items(user):
    app.data.driver.db['item'].delete({"user": user['_id']})

# TOdO find name for post and add user field from request
def add_user_to_item(payload):
    users = app.data.driver.db['user']
    user = users.find_one({"_id": payload[0]['user']})
    payload[0]['username'] = user['username']
    # accounts.insert(asdf)

if __name__ == '__main__':
    app = Eve(auth=Authenticate)
    Bootstrap(app)
    app.register_blueprint(eve_docs, url_prefix='/docs')
    app.on_delete_user += remove_user_items
    app.on_delete_thread += remove_thread_items
    app.on_insert_item += add_user_to_item
    #app.on_fetched_thread += add_posts_to_thread
    app.run()


import sys
import os
import json
from backend import Backend

from flask import Flask, Request, jsonify, request, make_response
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS, cross_origin

app = Flask(__name__, static_folder='public')
app.config['JSON_AS_ASCII'] = False
api = Api(app)
cors = CORS(app, allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"])

backend = Backend()

class UserResource(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int, required=False)
        parser.add_argument('login', type=str, required=False)
        args = parser.parse_args()

        if args.user_id is None and args.login is None:
            return backend.users()
        else:
            return backend.get_user(args.user_id, args.login)

class AuthResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('a', type=str, required=True)
        parser.add_argument('user_id', type=int, required=False)
        parser.add_argument('login', type=str, required=False)
        parser.add_argument('password', type=str, required=False)
        parser.add_argument('token', type=str, required=False)
        args = parser.parse_args()
        if args.a.lower() == 'login':
            return backend.login_user(args.login, args.password)
        elif args.a.lower() == 'check':
            return backend.validate_session(args.user_id, args.token)
        elif args.a.lower() == 'restore':
            return backend.restore_session(args.token)
        elif args.a.lower() == 'logout':
            return backend.logout_user(args.user_id, args.token)
        else:
            return None

class UserAvatarResource(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int, required=True)
        args = parser.parse_args()
        im, ctype = backend.get_avatar(args.user_id)
        response = make_response(im)
        response.headers['content-type'] = ctype
        return response

#api.add_resource(UserResource, '/users')
api.add_resource(AuthResource, '/auth')
api.add_resource(UserAvatarResource, '/ua')

if __name__ == '__main__':
    app.run(debug=True)

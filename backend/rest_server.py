import sys
import os
import json
from flask import Flask, Request, Response, jsonify, request, make_response, copy_current_request_context
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS, cross_origin
from time import sleep
from datetime import datetime

from backend import Backend

app = Flask(__name__, static_folder='public')
app.config['JSON_AS_ASCII'] = False
api = Api(app)
cors = CORS(app, allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"])

backend = Backend()

class UserListResource(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int, required=False)
        parser.add_argument('login', type=str, required=False)
        args = parser.parse_args()

        if args.user_id is None and args.login is None:
            return backend.list_users()
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
        if im is None:
            return None
        else:
            response = make_response(im)
            response.headers['content-type'] = ctype
            return response

class GameResource(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('game_id', type=int, required=False)
        parser.add_argument('user_id', type=int, required=False)
        args = parser.parse_args()
        if args.game_id is not None:
            return backend.get_game(args.game_id)
        elif args.user_id is not None:
            return backend.list_games(args.user_id)
        else:
            return None

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('a', type=str, required=True)
        parser.add_argument('game_id', type=int, required=False)
        parser.add_argument('user_id', type=int, required=False)
        parser.add_argument('state', type=str, required=False)
        parser.add_argument('role', type=str, required=False)
        args = parser.parse_args()

        if args.a.lower() == 'new':
            return backend.add_game(args.user_id, '<New game>')
        elif args.a.lower() == 'update':
            return backend.update_game(args.game_id, json.loads(args.state))
        elif args.a.lower() == 'next_state':
            return backend.next_state(args.game_id)
        elif args.a.lower() == 'stop':
            return backend.stop_game(args.game_id)
        elif args.a.lower() == 'join':
            return backend.join_game(args.game_id, args.user_id, args.role)
        else:
            return None

class MessageResource(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=str, required=True)
        args = parser.parse_args()

        @copy_current_request_context
        def eventStream():
            ts = datetime.now()
            while(True):
                sleep(5)
                msg = backend.checkUpdates(ts, args.user_id)
                ts = datetime.now()
                if msg is not None and len(msg) > 0:
                    yield json.dumps(msg, ensure_ascii=False, indent=4, sort_keys=False)

        return Response(
            eventStream(), 
            headers={
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        )

#api.add_resource(UserListResource, '/users')
api.add_resource(AuthResource, '/auth')
api.add_resource(UserAvatarResource, '/a')
api.add_resource(GameResource, '/g')
api.add_resource(MessageResource, '/m')

if __name__ == '__main__':
    app.run(debug=True)

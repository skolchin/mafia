#-------------------------------------------------------------------------------
import sys
import os
import json
import sqlite3 as engine
from datetime import datetime
import uuid
import base64

class Backend:
    MAFIA_DB = "C:\\Users\\kol\\Documents\\kol\\mafia\\mafia.db"

    def __init__(self):
        pass

    def get_conn(self):
        conn = engine.connect(self.MAFIA_DB)
        conn.row_factory = self.dict_factory
        return conn

    def dict_factory(self, cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

    def generic_update(self, table, props, key=None):
        conn = self.get_conn()
        id = props.get(key)
        tmp_props = props.copy()
        if key in tmp_props:
            tmp_props.pop(key)

        if id is None or id == 0:
            columns = ', '.join(tmp_props.keys())
            placeholders = ':'+', :'.join(tmp_props.keys())
            sql = 'INSERT INTO ' + table + '(%s) VALUES (%s)' % (columns, placeholders)
            conn.execute(sql, tmp_props)
            conn.commit()

            if key is not None:
                sql = 'select seq from sqlite_sequence WHERE name = ?'
                cursor = conn.execute(sql, [table])
                id_list = [d['seq'] for d in cursor.fetchall()]
                id =  id_list[0] if id_list is not None and len(id_list) > 0 else None
        else:
            columns = ', '.join(props.keys())
            placeholders = ':'+', :'.join(props.keys())
            sql = 'REPLACE INTO ' + table + '(%s) VALUES (%s)' % (columns, placeholders)
            conn.execute(sql, props)
            conn.commit()

        return id

    def users(self):
        conn = self.get_conn()
        cursor = conn.execute('select * from users')
        return [d for d in cursor.fetchall()]

    def get_user(self, user_id=None, login=None):
        conn = self.get_conn()
        if user_id is not None:
            cursor = conn.execute('select u.*, a.is_default as has_avatar from users u ' + \
                                  'left join avatars a on a.user_id = u.user_id and a.is_default = 1 ' \
                                  'where u.user_id = ?', [user_id])
        elif login is not None:
            cursor = conn.execute('select u.*, a.is_default as has_avatar from users u ' + \
                                  'left join avatars a on a.user_id = u.user_id and a.is_default = 1 ' \
                                  'where login = ?', [login])
        else:
            raise Exception('Invalid method call')
        return cursor.fetchone()

    def login_user(self, password, user_id=None, login=None):
        user = self.get_user(user_id, login)
        if user is None:
            print("User not found")
            return { 'user_id': 0 }
        elif user['token'] != password:
            print("Invalid password")
            user['token'] = None
            return user
        else:
            print("Logged on successfully")
            user['token'] = str(uuid.uuid1())             
            return user

    def get_avatar(self, user_id):
        conn = self.get_conn()
        cursor = conn.execute('select image, content_type from avatars where user_id = ? and is_default = 1', [user_id])
        d = cursor.fetchone()
        if d is None:
            return None, None
        else:
            return d.get('image'), d.get('content_type')

    def games(self, user_id):
        conn = self.get_conn()
        cursor = conn.execute( \
            'select g.*, u.* from games g ' \
                'inner join members m on m.game_id = g.game_id ' \
                'left join members l on l.game_id = g.game_id and l.role = "leader" ' \
                'left join users u on u.user_id = l.user_id '
                'where m.user_id = ?', [user_id]
        )
        user_games = [d for d in cursor.fetchall()]
        cursor.close()
        cursor = conn.execute( \
            'select g.*, u.* from games g ' \
                'left join members l on l.game_id = g.game_id and l.role = "leader" ' \
                'left join users u on u.user_id = l.user_id '
                'where g.status = "start"' \
        )
        new_games = [d for d in cursor.fetchall()]
        user_games.extend(new_games)

        for g in user_games:
            g['leader'] = {}
            for key in ['user_id', 'login', 'token', 'name', 'avatar']:
                g['leader'][key] = g[key]
                g.pop(key)

            cursor = conn.execute( \
                'select u.* from users u ' \
                    'inner join members m on u.user_id = m.user_id '
                    'where m.game_id = ?', \
                [g['game_id']]
            )
            g['members'] = [d for d in cursor.fetchall()]

        return user_games

    def update_user(self, props):
        return self.generic_update('users', props, 'user_id')

    def update_game(self, game):
        game_props = game.copy()
        for key in ['members', 'leader']:
            if key in game_props:
                game_props.pop(key)
        game_id = self.generic_update('games', game_props, 'game_id')

        if game.get('game_id') is None or game.get('game_id') == 0:
            if not 'leader' in game:
                raise Exception('Leader must be specified for new game to be created')
            leader = self.get_user(game['leader']['user_id'])
            if leader is None:
                raise Exception('Unknown leader id', game['leader']['user_id'])
            self.generic_update('members', {'game_id': game_id, 'user_id': leader['user_id'], 'role': 'leader'})

        return game_id

    def update_game_members(self, game):
        game_id = game['game_id']
        if 'members' in game:
            for m in game['members']:
                member_props = {'game_id': game_id}
                member_props.update(m)
                self.generic_update('members', member_props)
        return game_id


def main():
    backend = Backend()
    user = backend.get_user(1)
    print(user)

    games = backend.games(user['user_id'])
    print(games)

    #print(backend.update_game({'name': 'A', 'started': datetime.now(), 'leader': user}))


if __name__ == '__main__':
    main()

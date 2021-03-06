#-------------------------------------------------------------------------------
import sys
import os
import json
import sqlite3 as engine
from datetime import datetime, timedelta
import uuid
import base64
import random

def dt_to_str(dt=datetime.now()):
    if dt is None or type(dt) is not datetime:
        return dt
    else:
        return dt.strftime('%Y-%m-%d %H:%M:%S')

def dt_from_str(s):
    if s is None or type(s) is not datetime:
        return s
    else:
        return datetime.strptime(s, '%Y-%m-%d %H:%M:%S')

class BackendError(Exception):
    pass

class Backend:
    MAFIA_DB = "C:\\Users\\kol\\Documents\\kol\\mafia\\mafia.db"
    SESSION_PERIOD = 7      # days

    def __init__(self):
        pass

    def get_conn(self, conn=None):
        if conn is None:
            conn = engine.connect(self.MAFIA_DB)    #pylint: disable=no-member
            conn.row_factory = self.dict_factory
        return conn

    def dict_factory(self, cursor, row):

        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

    def clear_props(self, props):
        return {k: v for k, v in props.items() if type(v) is not datetime}

    def generic_update(self, table, props, key=None, conn=None, no_commit=False):
        conn = self.get_conn(conn)
        id = props.get(key)
        tmp_props = props.copy()
        if key in tmp_props:
            tmp_props.pop(key)
        print('Updating {}.{} = {}'.format(table, key, id))

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
                id = id_list[0] if id_list is not None and len(id_list) > 0 else None
        else:
            set_sql = ', '.join([p + ' = :' + p for p in props.keys() if p != key])
            where_sql = key + ' = :' + key
            sql = 'UPDATE ' + table + ' SET %s WHERE %s' % (set_sql, where_sql)
            conn.execute(sql, props)
            if not no_commit: conn.commit()

        return id

    def list_users(self, conn=None):
        conn = self.get_conn(conn)
        cursor = conn.execute('select * from users')
        return [d for d in cursor.fetchall()]

    def get_user(self, user_id=None, login=None, conn=None):
        conn = self.get_conn(conn)
        if user_id is not None:
            cursor = conn.execute(
                'select u.* from users u ' + \
                'where u.user_id = ?', [user_id]
            )

        elif login is not None:
            cursor = conn.execute(
                'select u.* from users u ' + \
                'where login = ?', [login]
            )
        else:
            raise BackendError('Invalid method call')
        return cursor.fetchone()

    def login_user(self, login, password, conn=None):
        conn = self.get_conn(conn)
        user = self.get_user(login=login, conn=conn)
        if user is None:
            return { 'user_id': 0 }
        elif user['token'] != password:
            user['token'] = None
            return user
        else:
            user['token'] = str(uuid.uuid1())

            conn.execute(
                'insert into sessions(token, user_id, started, expires_on) ' + \
                'values(?, ?, ?, ?)', \
                [user['token'], user['user_id'], datetime.now(), 
                datetime.now() + timedelta(days=self.SESSION_PERIOD)]
            )
            conn.commit()
            return {'user': user, 'games': self.list_games(user['user_id'])}

    def get_avatar(self, user_id, conn=None):
        conn = self.get_conn(conn)
        cursor = conn.execute(
            'select image, content_type from avatars where user_id=? and is_default=1', 
            [user_id]
        )
        d = cursor.fetchone()
        if d is None:
            return None, None
        else:
            return d.get('image'), d.get('content_type')

    def validate_session(self, user_id, token, conn=None):
        conn = self.get_conn(conn)
        cursor = conn.execute(
            'select * from sessions where token=? and user_id=? and inactive=0', 
            [token, user_id]
        )
        d = cursor.fetchone()
        if d is None:
            return {
                'user_id': user_id,
                'token': token,
                'valid': False
            }
        else:
            d['valid'] = d['expires_on'] >= datetime.now()
            return d

    def restore_session(self, token, conn=None):
        conn = self.get_conn(conn)
        cursor = conn.execute(
            'select u.*, s.token, s.started, s.expires_on from sessions s ' + \
            'inner join users u on s.user_id = u.user_id ' + \
            'where s.token=? and s.inactive=0', 
            [token]
        )
        d = cursor.fetchone()
        if d is None or datetime.strptime(d['expires_on'], '%Y-%m-%d %H:%M:%S.%f') < datetime.now():
            return {
                'user_id': None,
                'login': None,
                'token': token,
                'valid': False
            }
        else:
            d['valid'] = True
            return {'user': d, 'games': self.list_games(d['user_id'], conn)}

    def logout_user(self, user_id, token, conn=None):
        conn = self.get_conn(conn)
        conn.execute('update sessions set inactive=1 where token = ? and user_id = ?', [token, user_id])
        conn.commit()
        return {}

    def list_games(self, user_id, conn=None):
        conn = self.get_conn(conn)
        cursor = conn.execute(
            'select g.game_id from games g ' + \
            'inner join members m on m.game_id = g.game_id ' + \
            'where m.user_id = ? ' + \
            'union '
            'select g.game_id from games g ' + \
            'where g.status == "start"',
            [user_id]
        )
        return [self.get_game(d['game_id'], conn=conn) for d in cursor.fetchall()]

    def update_user(self, props, conn=None):
        return self.generic_update('users', props, 'user_id', conn)

    def add_game(self, leader_id, name='', conn=None):
        conn = self.get_conn(conn)
        game_id = self.generic_update(
            'games', 
            {
                'game_id': 0, 
                'name': name, 
                'started': datetime.now(),
                'status': 'new'
            }, 
            'game_id',
            conn=conn, 
            no_commit=True
        )
        self.generic_update(
            'members', 
            {
                'game_id': game_id, 
                'user_id': leader_id, 
                'role': 'leader'
            }, 
            conn=conn, 
            no_commit=True
        )
        self.generic_update(
            'game_history',
            {
                'game_id': game_id,
                'creator_id': leader_id,
                'hist_type': 'new_game',
                'hist_data': '{}', 
                'created': datetime.now()
            },
            conn=conn
        )
        return self.get_game(game_id, conn)

    def get_game(self, game_id, conn=None):
        conn = self.get_conn(conn)
        cursor = conn.execute('select * from games where game_id=?', [game_id])
        game = cursor.fetchone()
        if game is None:
            return game

        cursor = conn.execute(
            'select u.*, m.role, m.alive from users u ' + \
            'inner join members m on m.user_id = u.user_id ' + \
            'where m.game_id=?', 
            [game_id]
        )

        game['members'] = [d for d in cursor.fetchall()]
        leaders_list = [m for m in game['members'] if m['role'] == 'leader']
        game['leader'] = leaders_list[0] if len(leaders_list) > 0 else {}
        game['total'] = [
            len([m for m in game['members'] if m['role'] != 'leader' and m['alive'] == 1]),
            len([m for m in game['members'] if m['role'] != 'leader'])
        ]
        game['mafiaState'] = [
            len([m for m in game['members'] if m['role'] == 'mafia' and m['alive'] == 1]),
            len([m for m in game['members'] if m['role'] == 'mafia'])
        ]
        game['citizenState'] = [
            len([m for m in game['members'] if m['role'] == 'citizen' and m['alive'] == 1]),
            len([m for m in game['members'] if m['role'] == 'citizen'])
        ]
        return game

    def update_game(self, game_id, user_id, props, conn=None):
        conn = self.get_conn(conn)
        props['game_id'] = game_id
        props['modified'] = datetime.now()
        game_id = self.generic_update(
            'games', 
            props, 
            'game_id', 
            conn=conn, 
            no_commit=True
        )
        self.generic_update(
            'game_history',
            {
                'game_id': game_id,
                'creator_id': user_id,
                'hist_type': 'game_update',
                'hist_data': '{}', 
                'created': datetime.now()
            },
            conn=conn
        )
        return self.clear_props(props)

    def next_state(self, game_id, user_id, conn=None):
        conn = self.get_conn(conn)
        cursor = conn.execute('select * from games where game_id=?', [game_id])
        d = cursor.fetchone()
        if d is None:
            return None

        state = {
            'game_id': game_id, 
            'status': d['status'], 
            'period': d['period'], 
            'round': d['round'],
            'modified': datetime.now()
        }

        if state['status'] == 'new':
            state['status'] = 'start'
        elif state['status'] == 'start':
            state['status'] = 'active'
            state['period'] = 'day'
            state['round'] = 1

            game = self.get_game(game_id)
            if 'members' not in game or len(game['members']) < 4:       #one is leader
                raise Exception("Minimum 3 members required to start a game")

            mafiaTotal = (len(game['members']) - 1) // 3
            mafiaCount = 0

            for item in game['members']:
                if item['role'] != 'leader':
                    r = round(random.random())
                    item['role'] = "mafia" if r == 0 and mafiaCount < mafiaTotal else "citizen"
                    if item['role'] == "mafia":
                        mafiaCount += 1
                    conn.execute('UPDATE members SET role=? WHERE game_id=? and user_id=?',
                                [item['role'], game_id, item['user_id']])

            self.generic_update('games', state, 'game_id', conn)
            return self.get_game(game_id, conn)

        elif state['status'] == 'active' and state['period'] == 'day':
            state['period'] = 'night'
        elif state['status'] == 'active' and state['period'] == 'night':
            state['period'] = 'day'
            state['round'] += 1

        self.generic_update(
            'games', 
            state, 
            'game_id', 
            conn=conn,
            no_commit=True
        )

        state['last_status'] = d['status']
        self.generic_update(
            'game_history',
            {
                'game_id': game_id,
                'creator_id': user_id,
                'hist_type': 'status_change',
                'hist_data': json.dumps(self.clear_props(state)), 
                'created': datetime.now()
            },
            conn=conn
        )
        return self.clear_props(state)

    def stop_game(self, game_id, user_id, conn=None):
        conn = self.get_conn(conn)
        cursor = conn.execute('select * from games where game_id=?', [game_id])
        d = cursor.fetchone()
        if d is None:
            return None

        state = {
            'game_id': game_id, 
            'status': 'finish',
            'modified': datetime.now()
        }
        self.generic_update(
            'games', 
            state, 
            'game_id', 
            conn=conn,
            no_commit=True,
        )
        self.generic_update(
            'game_history',
            {
                'game_id': game_id,
                'creator_id': user_id,
                'hist_type': 'status_change',
                'hist_data': json.dumps(self.clear_props(state)), 
                'created': datetime.now()
            },
            conn=conn
        )
        return self.clear_props(state)

    def join_game(self, game_id, user_id, role, conn=None):
        conn = self.get_conn(conn)
        self.generic_update(
            'members', 
            {
                'game_id': game_id, 
                'user_id': user_id, 
                'role': role,
                'created': datetime.now(),
                'modified': datetime.now()
            },
            conn=conn,
            no_commit=True
        )
        self.generic_update(
            'game_history',
            {
                'game_id': game_id,
                'creator_id': user_id,
                'hist_type': 'new_member',
                'hist_data': '{"user_id": %s}'  % (user_id), 
                'created': datetime.now()
            },
            conn=conn
        )
        return self.get_game(game_id)

    def checkUpdates(self, since, user_id, conn=None):
        conn = self.get_conn(conn)
        cursor = conn.execute(
            'select h.history_id, h.game_id, h.creator_id, h.hist_type, h.hist_data, h.created ' + \
            'from game_history h ' + \
            'where h.game_id in ( ' + \
            '    select g.game_id ' + \
            '    from games g inner join members m on m.game_id = g.game_id and m.user_id = :user_id ' + \
            ') and h.created >= :since',
            {'user_id': user_id, 'since': since}
        )
        changes = [
            {
                'id': d['history_id'],
                'type': d['hist_type'],
                "creator_id": d['creator_id'],
                'change': json.loads(d['hist_data']),
                'ts': dt_to_str(d['created']),
                'game': self.get_game(d['game_id']) 
            }
            for d in cursor.fetchall()
        ]
        #print("Updates since {}: {}".format(since, len(changes)))
        return changes


def main():
    pass

if __name__ == '__main__':
    main()

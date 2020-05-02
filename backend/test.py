import requests

result = requests.get('http://localhost:5000/users')
print(result.json())

result = requests.post('http://localhost:5000/auth', json = {"login": "1", "password": "1"})
print(result.json())

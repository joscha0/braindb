import json
from appwrite.client import Client

# You can remove imports of services you don't use
# from appwrite.services.account import Account
# from appwrite.services.avatars import Avatars
from appwrite.services.databases import Databases
from appwrite import Permission, Role
# from appwrite.services.functions import Functions
# from appwrite.services.health import Health
# from appwrite.services.locale import Locale
# from appwrite.services.storage import Storage
# from appwrite.services.teams import Teams
# from appwrite.services.users import Users

"""
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
"""

def main(req, res):
  client = Client()

  # You can remove services you don't use
  # account = Account(client)
  # avatars = Avatars(client)
  database = Databases(client)
  # functions = Functions(client)
  # health = Health(client)
  # locale = Locale(client)
  # storage = Storage(client)
  # teams = Teams(client)
  # users = Users(client)

  if not req.variables.get('APPWRITE_FUNCTION_ENDPOINT') or not req.variables.get('APPWRITE_FUNCTION_API_KEY'):
    print('Environment variables are not set. Function cannot use Appwrite SDK.')
  else:
    (
    client
      .set_endpoint(req.variables.get('APPWRITE_FUNCTION_ENDPOINT', None))
      .set_project(req.variables.get('APPWRITE_FUNCTION_PROJECT_ID', None))
      .set_key(req.variables.get('APPWRITE_FUNCTION_API_KEY', None))
      .set_self_signed(True)
    )
    
  payload = json.loads(req.variables["APPWRITE_FUNCTION_EVENT_DATA"])
  userId = payload["$id"]
  database.create_collection(req.variables["DATABASE_ID"], userId, userId, [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
          Permission.write(Role.user(userId)),
        ])

  database.create_string_attribute(req.variables["DATABASE_ID"], userId, 'name', 128, True)
  database.create_string_attribute(req.variables["DATABASE_ID"], userId, 'content', 16777216, True)
  

  
  return res.json({
    "areDevelopersAwesome": True,
  })
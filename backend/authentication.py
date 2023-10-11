import jwt
from functools import wraps
from flask import request, jsonify, make_response
from sqlalchemy import text

from backend import db, app
from passlib.hash import sha256_crypt

from datetime import datetime, timedelta

from itsdangerous import URLSafeTimedSerializer

# wrapper for checking JWT Token, all future get/post should contain the header "Authorization", if available
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'Authorization' in request.headers:
            token_type, token = request.headers['Authorization'].split(' ')

        # return 401 if token is not passed
        if not token:
            return jsonify({'message': 'Token is missing !!'}), 401

        try:
            # decoding the payload to fetch the stored details
            try:
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms="HS256")

            except jwt.exceptions.ExpiredSignatureError:
                return jsonify({
                    'message': 'Token has expired !!'
                }), 401

            except jwt.exceptions.InvalidSignatureError:

                return jsonify({
                    'message': 'Token is invalid !!'
                }), 401

            current_user = db.session.execute(text("SELECT * FROM Users WHERE id=:userId"),
                                              {'userId': data['public_id']}).first()

        except:
            return jsonify({
                'message': 'Token is invalid !!'
            }), 401

        # returns the current logged-in users context to the routes
        return f(current_user, *args, **kwargs)

    return decorated


# authenticates user
@app.route("/auth_user", methods=['POST'])
def auth_user():
    data = request.json

    email = data['email']
    password = data['password']
    username = data['username']

    user_query = db.session.execute(text("SELECT * FROM Users WHERE email=:email OR username=:username"),
                                    {'email': email, 'username': username}).first()

    # if a user exists
    if user_query is not None:

        password_hash = user_query[2]
        salt_num = user_query[4]
        is_verified = sha256_crypt.verify(password + str(salt_num), password_hash)

        # if password hashes match

        if is_verified:

            # encodes jwt token to send as a response, token : bytes
            token = jwt.encode({
                'public_id': user_query.id,
                'exp': datetime.utcnow() + timedelta(minutes=30)
            }, app.config['SECRET_KEY'], algorithm="HS256")

            # authentication token has "Bearer " attached

            return make_response(jsonify({'authentication': 'Bearer ' + token}), 201)

        else:
            return make_response( 
                {'error': 'Could not verify'},
                403,
                {'WWW-Authenticate': 'Basic realm ="Wrong Password !!"'}
            )
    else:
        return make_response(
            {'error': 'Could not verify'},
            418,
            {'WWW-Authenticate': 'Basic realm="User does not exist !!'}
        )

def generate_confirmation_token(email):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    return serializer.dumps(email, salt=app.config['SECRET_PASSWORD_SALT'])

def confirm_token(token, expiration=300):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        email = serializer.loads(
            token,
            salt=app.config['SECRET_PASSWORD_SALT'],
            max_age=expiration
        )
    except:
        return False
    return email


@app.route('/decode_token')
@token_required
def decode_token(token):
    headers = request.headers
    token = headers['Authorization'].split(' ')[1]

    return jwt.decode(token, app.config['SECRET_KEY'], algorithms="HS256")


def confirm_email(token):
    try:
        email = confirm_token(token)
    except:
        return {
            'error': 'Confirmation link is invalid or has expired',
            'status': 403
        }
    
    user = db.session.execute(text("SELECT * FROM Users WHERE email=:email"), {'email': email}).first()

    if user.confirmed:
        return {
            'error': 'Account has already been confirmed',
            'status': 403,
        }

    else:
        user.confirmed = True
        user.confirmed_on = datetime.now()
        db.session.commit()
        return{
            'success': 'You have confirmed your account. Welcome to Munch meter!',
            'status': 200
        }

def get_token(request):
    if "Authorization" in request.headers:
        return request.headers.Authorization
    return None

def check_user(request, user_id):
    token = get_token(request)
    print("\n\n\n\n", token, "\n\n\n\n")
    token_data = jwt.decode(token, app.config["SECRET_KEY"], algorithms="HS256")
    print("\n\n\n\n", token_data, "\n\n\n\n")
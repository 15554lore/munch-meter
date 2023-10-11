from backend import app, db
from backend.models import Image, Users
from backend.authentication import token_required, generate_confirmation_token, confirm_token, check_user
from backend.moderation import *

import uuid
import os
import shutil

from flask import jsonify, send_from_directory, request, send_file
from passlib.hash import sha256_crypt

from sqlalchemy.sql import func, text
import random

from PIL import Image as Img
from io import BytesIO

MODERATION = True
prev_file_path = ""


@app.route("/api/image-upload", methods=["POST"])
def upload():
    files = request.files.getlist('files[]')
    title_dict = dict(request.form)
    print(title_dict)
    image_file = files[0]
    image_file_name = str(uuid.uuid4()) + '.jpg'
    new_title = title_dict['title']
    if len(new_title) > 32:
        new_title = new_title[:32]
    authorid = int(title_dict['userId'])
    if not image_file_name:
        return jsonify({'success': False, 'file': 'file n/a'}), 400

    try:
        Img.open(BytesIO(image_file.read())).verify()
        image_file.seek(0)
    except Exception as e:
        return jsonify({"error": "Invalid image file"}), 400

    if MODERATION:
        image_quarantine_path = os.path.join(
            app.config["QUARANTINE_FOLDER"], image_file_name)
        if not os.path.exists(image_quarantine_path):
            image_file.save(image_quarantine_path)
            if not moderate_image(image_quarantine_path):
                #os.remove(image_quarantine_path)
                return jsonify({'success': False, 'file': 'not appropriate'}), 404
            #os.remove(image_quarantine_path)
            shutil.move(image_quarantine_path, os.path.join(app.config['IMAGE_FOLDER'], image_file_name))

    image_save_path = os.path.join(app.config['IMAGE_FOLDER'], image_file_name)
    if not os.path.exists(image_save_path):
        image_file.save(image_save_path)

    if db.session.query(Image.id).filter_by(image_url=image_file_name).first() is None:
        images = Image.query.all()
        new_image = Image(image_url=image_file_name, score=50, total_comparisons=0, image_title=new_title, author_id=authorid)
        db.session.add(new_image)
        db.session.commit()
        return jsonify({'success': True, 'file': 'received'})

    else:
        return jsonify({'success': False, 'file': 'already in db'}), 400


# picks random image path from saved images and returns it

@app.route("/random_img", methods=['GET'])
def random_image():
    """Serves the logo image."""
    # file_path = f"{random.choice(['chicken.jpg','lamb.jpg','egg.jpg'])}"
    file_path = Image.query.order_by(func.random()).limit(2).all()
    # print(file_path[0], file_path[1])
    # global prev_file_path
    # while file_path == prev_file_path:
    #     file_path = Image.query.order_by(func.random()).first().image_url
    # prev_file_path = file_path
    return jsonify({
                    "file1": {
                                "path": file_path[0].image_url, 
                                "title": file_path[0].image_title
                            },
                    "file2": {
                                "path": file_path[1].image_url,
                                "title": file_path[1].image_title
                            }
                    })


# send image based on file path
@app.route("/fetchimage/<file_path>", methods=['GET'])
def give_image(file_path):

    try:
        image_file = send_from_directory("../static/", file_path)
    except BaseException:
        image_file = app.send_static_file(file_path)

    return image_file


# DISABLED CURRENTLY

# returns whole database
# @app.route("/return_db_image")
# @token_required
# def return_db_image(current_user):
#     all_entries = Image.query.all()
#     return jsonify(json_list=all_entries)


# @app.route("/return_db_users")
# @token_required
# def return_db_users(current_user):
#     all_entries = Users.query.all()
#     return jsonify(json_list=all_entries)


# returns [page, page+10)th entries of images sorted by score
@app.route("/leaderboard", methods=["POST"])
def get_leaderboard_entries():
    data = request.json

    page_num = int(data["index"])

    rows = db.session.execute(text("SELECT image_url, score, total_comparisons, id, image_title, author_id FROM Image ORDER BY Score DESC")).fetchall()

    entries = [{
        "image_url": row.image_url,
        "score": row.score,
        "total_comparisons": row.total_comparisons,
        "id": row.id,
        "place": rows.index(row),
        "image_title": row.image_title,
        "author": db.session.execute(
            text("SELECT username FROM Users WHERE id=:author_id"), {'author_id': row.author_id}).first()[0],
        "totalPages": str((len(rows) - 1) // 10 + 1)
    } for row in rows]
    return jsonify(entries[10 * (page_num - 1):10 * page_num])


@app.route("/update_ranking", methods=["POST"])
def update_ranking():
    data = request.json
    winner_url = data["winnerUrl"]
    loser_url = data["loserUrl"]
    # Select score from Images where image_url == data.decode[0]
    winner = Image.query.filter_by(image_url=winner_url).first()  # player A
    loser = Image.query.filter_by(image_url=loser_url).first()  # player B

    old_winner_score = winner.score
    old_loser_score = loser.score

    expected_winner_score = (1 + 10 ** ((old_loser_score - old_winner_score) / 14.3)) ** -1
    expected_loser_score = (1 + 10 ** ((old_winner_score - old_loser_score) / 14.3)) ** -1

    # changing winner's score
    winner_k = 30 if winner.total_comparisons < 10 else 15
    new_winner_score = old_winner_score + winner_k * (1 - expected_winner_score)

    # changing loser's score
    loser_k = 30 if loser.total_comparisons < 10 else 15
    new_loser_score = old_loser_score + loser_k * (-expected_winner_score)

    winner.score = new_winner_score
    loser.score = new_loser_score

    winner.total_comparisons += 1
    loser.total_comparisons += 1
    db.session.commit()
    return jsonify({'success': True, 'file': 'received'})


@app.route("/add_user", methods=["POST"])
def add_user():
    data = request.json
    # check if username in use
    if Users.query.filter_by(username=data["username"]).count() > 0:
        return jsonify({'success': False, 'error': "username already in use"})
    # check if email in use
    if Users.query.filter_by(email=data["email"]).count() > 0:
        return jsonify({'success': False, 'error': "email already in use"})
    salt = random.randint(0, 1_000_000)
    user_password = sha256_crypt.hash(data["password"] + str(salt))
    if len(data["username"]) < 6 or len(data["username"]) > 16:
        return jsonify({'success': False, 'error': "username invalid"})
    new_user = Users(
        username=data["username"], password_hash=user_password, email=data["email"], salt_num=salt)
    db.session.add(new_user)
    db.session.commit()
    data["success"] = True

    return data


@app.route("/update_user", methods=["POST"])
@token_required
def update_user(current_user):
    data = request.json
    user_id = data["userId"]
    new_data = data["newData"]

    user_data = db.session.query(Users).filter(Users.id == user_id).first()

    key = new_data["key"]
    value = new_data["value"]
    setattr(user_data, key, value)
    db.session.commit()
    return "Success"


@app.route("/get_user", methods=['POST'])
@token_required
def get_user(current_user):
    data = request.json
    if 'userId' in data:
        user_id = data['userId']
        if user_id != current_user.id:
            return jsonify({'message': 'User mismatch'}), 400
        if 'AccountSection' in data:
            print("no")
            uploaded = False
            rows = db.session.execute(text(
                "SELECT image_url, score, total_comparisons, id, image_title, author_id FROM Image ORDER BY Score DESC")).fetchall()
            entries = [{
                "image_url": row.image_url,
                "score": row.score,
                "total_comparisons": row.total_comparisons,
                "id": row.id,
                "place": rows.index(row),
                "image_title": row.image_title,
                "author_id": row.author_id
            } for row in rows]
            users_entries = []
            for i in entries:
                if i["author_id"] == user_id:
                    users_entries.append(i)
            if len(users_entries) >= 1:
                print("yes")
                image_highest = users_entries[0]
                image_lowest = users_entries[-1]
                uploaded = True
        user_query = db.session.execute(
            text("SELECT * FROM Users WHERE id=:userId"), {'userId': user_id}).first()
        print(user_query)

    elif 'email' in data:
        email = data['email']

        user_query = db.session.execute(
            text("SELECT * FROM Users WHERE email=:email"), {'email': email}).first()

    elif 'username' in data:
        username = data['username']

        user_query = db.session.execute(text(
            "SELECT * FROM Users WHERE username=:username"), {'username': username}).first()
        
    if user_query is not None:
        if "AccountSection" in data and uploaded:
            return jsonify({
                'username': user_query[1],
                'email': user_query[3],
                'highestRanking': image_highest,
                'lowestRanking': image_lowest,
            })
        else:
            return jsonify({
                'username': user_query[1],
                'email': user_query[3],
                'highestRanking':"none",
                'lowestRanking': "none",
            })

    else:
        return jsonify({
            'error': 'Invalid User query'
        })


@ app.route('/check_auth', methods=['GET'])
@ token_required
def check_auth(current_user):
    return jsonify(
        {'message': 'Token valid'}
    ), 200


@ app.route('/logout', methods=['GET'])
def logout():
    response = jsonify({'msg': 'Logout successful'})
    return response

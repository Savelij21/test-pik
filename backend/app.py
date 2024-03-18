from flask import Flask
from flask_cors import CORS
import db

app = Flask(__name__)
cors = CORS(app)


@app.route('/')
def default():
    return db.get_all()

@app.route('/a/')
def get_a():
    return db.get_a()


@app.route('/b/')
def get_b():
    return db.get_b()


@app.route('/a_b/')
def get_a_b():
    return db.get_a_b()


@app.route('/int_a_b/')
def get_join_a_b():
    return db.get_intersection_a_b()


if __name__ == "__main__":
    app.run()

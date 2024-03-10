#app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView


app = Flask(__name__)
# CORS(app)  # This is crucial for allowing cross-origin requests from your React app
CORS(app, resources={r"/*": {"origins": "*"}})  # Allows all origins for all routes

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
app.config['SECRET_KEY'] = 'your_secret_key'  # Set a secret key for security
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    profile = db.Column(db.String(128))
    insurance = db.Column(db.String(128))
    role = db.Column(db.String(50))
    prescriptions = db.relationship('Prescription', backref='user', lazy=True)

class Prescription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    prescriptionName = db.Column(db.String(128))
    prescriptionType = db.Column(db.String(128))
    dosage = db.Column(db.Integer)
    timeTillNext = db.Column(db.Integer)
    taken = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class Partnership(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(128))

class Pharmacy(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_ID = db.Column(db.Integer, db.ForeignKey('partnership.id'))
    address = db.Column(db.String(256))
    zipcode = db.Column(db.String(128))
    phoneNumber = db.Column(db.String(20))
    partnership = db.relationship('Partnership', backref=db.backref('pharmacies', lazy=True))

admin = Admin(app, template_mode='bootstrap3')


class PrescriptionAdmin(ModelView):
    # Specify the display columns in the list view
    column_list = ('id', 'prescriptionName', 'prescriptionType', 'dosage', 'timeTillNext', 'taken', 'user_id')
    form_columns = ('prescriptionName', 'prescriptionType', 'dosage', 'timeTillNext', 'taken', 'user_id')

class PharmacyAdmin(ModelView):
    # Specify the columns that should be displayed in the list view
    column_list = ('id', 'company_ID', 'address', 'zipcode', 'phoneNumber', 'partnership')
    form_columns = ('company_ID', 'address', 'zipcode', 'phoneNumber', 'partnership')

admin.add_view(ModelView(User, db.session))
admin.add_view(PrescriptionAdmin(Prescription, db.session))
admin.add_view(ModelView(Partnership, db.session))
admin.add_view(PharmacyAdmin(Pharmacy, db.session))




@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/api/click', methods=['POST'])
def handle_click():
    # Assuming the click processing logic dictates a redirect to '/profile'
    return jsonify({"redirect": "/profile"}), 200

@app.route('/submit-form-Tracker', methods=['POST'])
def submit_form_tracker():
    data = request.get_json(force=True)  # Use force=True to debug
    if not data:
        return jsonify({'error': 'No JSON data received'}), 400
    prescription_name = data.get('prescriptionName')
    dosage = data.get('dosage')
    # Your logic here
    print(data)
    return jsonify({"message": "Data received"}), 200


@app.route('/add-prescription/<int:user_id>', methods=['POST'])
def add_prescription(user_id):
    # Find the user by ID
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json
    try:
        # Assuming multiple prescriptions can be sent at once
        for presc in data['prescriptions']:
            new_prescription = Prescription(
                prescriptionName=presc['prescriptionName'],
                prescriptionType=presc['prescriptionType'],
                dosage=presc['dosage'],
                timeTillNext=presc['timeTillNext'],
                taken=presc['taken'],
                user_id=user_id
            )
            db.session.add(new_prescription)
        db.session.commit()
        print(new_prescription)
        return jsonify({"message": "Prescriptions added successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/prescriptions/<int:user_id>', methods=['GET'])
def get_prescriptions(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    prescriptions = Prescription.query.filter_by(user_id=user_id).all()
    print(jsonify([{
        'id': pres.id,
        'prescriptionName': pres.prescriptionName,
        'prescriptionType': pres.prescriptionType,
        'dosage': pres.dosage,
        'timeTillNext': pres.timeTillNext,
        'taken': pres.taken
    } for pres in prescriptions]))
    return jsonify([{
        'id': pres.id,
        'prescriptionName': pres.prescriptionName,
        'prescriptionType': pres.prescriptionType,
        'dosage': pres.dosage,
        'timeTillNext': pres.timeTillNext,
        'taken': pres.taken
    } for pres in prescriptions]), 200


if __name__ == "__main__":
    app.run(debug=True)
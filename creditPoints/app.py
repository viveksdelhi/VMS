from flask import Flask, request, jsonify
# from pip import SQLAlchemy
from flask_sqlalchemy import SQLAlchemy
from flask_restx import Api, Resource, fields
from datetime import datetime
from flask_migrate import Migrate
from flask_cors import CORS
import pytz

local_time_zone = pytz.timezone('Asia/Kolkata')

# Initialize Flask app and SQLAlchemy
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:Ajeevi%40%23321890@ecosmartdc.com:9512/credit'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# Swagger API initialization using Flask-RESTX
api = Api(app, version='1.0', title='Credit Management API', description='Credit management', doc='/swagger/')

def local_time():
    return datetime.now(local_time_zone )

class EventType(db.Model):
    __tablename__ = 'event_type'
    id = db.Column(db.Integer, primary_key=True)
    event_type = db.Column(db.String(255), nullable=False)
    event_credit = db.Column(db.Integer, nullable=True)

    def __init__(self, event_type, event_credit):
        self.event_type = event_type
        self.event_credit = event_credit


class EventCredit(db.Model):
    __tablename__ = 'event_credit'
    id = db.Column(db.Integer, primary_key=True)
    entity_id = db.Column(db.Integer, nullable=False)
    allocated_credit = db.Column(db.Integer, nullable=False)
    available_credit = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=local_time())
    updated_at = db.Column(db.DateTime, default=local_time(), onupdate=local_time())


    def __init__(self, entity_id, allocated_credit, available_credit):
        self.entity_id = entity_id
        self.allocated_credit = allocated_credit
        self.available_credit = available_credit
        self.created_at = local_time()
        self.updated_at = local_time()

class Transaction(db.Model):
    __tablename__ = 'transaction'
    id = db.Column(db.Integer, primary_key=True)
    event_credit_id = db.Column(db.Integer, nullable=False)  
    device_id = db.Column(db.Integer, nullable=False)
    event_type_id = db.Column(db.Integer, nullable=False)  
    transaction_date = db.Column(db.DateTime, default=local_time(), onupdate=local_time())

    def __init__(self, event_credit_id, device_id, event_type_id):
        self.event_credit_id = event_credit_id
        self.device_id = device_id
        self.event_type_id = event_type_id
        self.transaction_date = local_time()


# Create the database tables inside an app context
with app.app_context():
    db.create_all()


# Define API model for request/response validation (using Flask-RESTX fields)
event_type_model = api.model('EventType', {
    'event_type': fields.String(required=True, description='Type of event'),
    'event_credit': fields.Integer(required=True, description='Allocated credit for event')
})

event_credit_model = api.model('EventCredit', {
    'entity_id': fields.Integer(required=True, description='Entity ID'),
    'allocated_credit': fields.Integer(required=True, description='Allocated credit amount'),
    'available_credit': fields.Integer(required=True, description='Available credit amount')
})

transaction_model = api.model('Transaction', {
    'event_credit_id': fields.Integer(required=True, description='Event Credit ID'),
    'device_id': fields.Integer(required=True, description='Device ID'),
    'event_type_id': fields.Integer(required=True, description='Event Type ID')
})

credit_burn_date_range_model = api.model('CreditBurnDateRange', {
    'start_date': fields.String(required=True, description='Start date in format YYYY-MM-DD'),
    'end_date': fields.String(required=True, description='End date in format YYYY-MM-DD')
})

credit_burn_time_range_model = api.model('CreditBurnTimeRange', {
    'start_time': fields.String(required=True, description='Start time in format YYYY-MM-DD HH:MM:SS'),
    'end_time': fields.String(required=True, description='End time in format YYYY-MM-DD HH:MM:SS')
})

# EventType API
@api.route('/event_type')
class EventTypeResource(Resource):
    def get(self):
        
            event_types = EventType.query.all()
            return {
                'event_types': [{'id': et.id, 'event_type': et.event_type, 'event_credit': et.event_credit} for et in event_types]
            }

    @api.expect(event_type_model)
    def post(self):
        data = request.get_json()
        new_event_type = EventType(event_type=data['event_type'], event_credit=data['event_credit'])
        db.session.add(new_event_type)
        db.session.commit()
        return {'message': 'Event type created successfully'}, 201

# EventType specific API (GET, PUT, DELETE by ID)
@api.route('/event_type/<int:id>')
class EventTypeByIDResource(Resource):
    def get(self, id):
        event_type = EventType.query.get_or_404(id)
        return {'id': event_type.id, 'event_type': event_type.event_type, 'event_credit': event_type.event_credit}

    @api.expect(event_type_model)
    def put(self, id):
        data = request.get_json()
        event_type = EventType.query.get_or_404(id)
        event_type.event_type = data.get('event_type', event_type.event_type)
        event_type.event_credit = data.get('event_credit', event_type.event_credit)
        db.session.commit()
        return {'message': 'Event type updated successfully'}

    def delete(self, id):
        event_type = EventType.query.get_or_404(id)
        db.session.delete(event_type)
        db.session.commit()
        return {'message': 'Event type deleted successfully'}

# EventCredit API
@api.route('/event_credit')
class EventCreditResource(Resource):
    def get(self):
        event_credits = EventCredit.query.all()
        return {
            'event_credits': [{'id': ec.id, 'entity_id': ec.entity_id, 'allocated_credit': ec.allocated_credit, 'available_credit': ec.available_credit} for ec in event_credits]
        }

    @api.expect(event_credit_model)
    def post(self):
        data = request.get_json()
        print(data)
        new_event_credit = EventCredit(entity_id=data['entity_id'], allocated_credit=data['allocated_credit'], available_credit=data['available_credit'])
        db.session.add(new_event_credit)
        db.session.commit()
        new_event_credit_id = new_event_credit.id
        return {'message': 'Event credit created successfully', "credit_id" : new_event_credit_id}, 201

# Transaction API
@api.route('/transaction')
class TransactionResource(Resource):
    def get(self):
        
        transactions = Transaction.query.all()

        return {
            'transactions': [{'id': t.id, 'event_credit_id': t.event_credit_id, 'device_id': t.device_id, 'event_type_id': t.event_type_id} for t in transactions]
        }

    @api.expect(transaction_model)
    def post(self):
        data = request.get_json()
        new_transaction = Transaction(event_credit_id=data['event_credit_id'], device_id=data['device_id'], event_type_id=data['event_type_id'])
        db.session.add(new_transaction)
        db.session.commit()
        return {'message': 'Transaction created successfully'}, 201

@api.route('/transaction_update')
class TransactionResource(Resource):
    def get(self):
        transactions = Transaction.query.all()
        return {
            'transactions': [{'id': t.id, 'event_credit_id': t.event_credit_id, 'device_id': t.device_id, 'event_type_id': t.event_type_id} for t in transactions]
        }

    @api.expect(transaction_model)
    def post(self):
        # Get the request data
        data = request.get_json()
        event_credit_id = data['event_credit_id']
        device_id = data['device_id']
        event_type_id = data['event_type_id']
        
        # Retrieve the corresponding EventType to get the event_credit value
        event_type = EventType.query.get_or_404(event_type_id)
        event_credit_value = event_type.event_credit
        
        # Retrieve the EventCredit record for the given event_credit_id
        event_credit = EventCredit.query.get_or_404(event_credit_id)
        
        # Debugging prints
        print(f"Before Transaction: Available credit: {event_credit.available_credit}")
        
        # Check if available_credit is sufficient
        if event_credit.available_credit < event_credit_value:
            return {'message': 'Insufficient available credit'}, 400
        
        # Create the new transaction
        new_transaction = Transaction(
            event_credit_id=event_credit_id,
            device_id=device_id,
            event_type_id=event_type_id
        )
        db.session.add(new_transaction)

        # Deduct the event_credit value from the available_credit
        event_credit.available_credit -= event_credit_value
        
        # Debugging print after deduction
        print(f"After Transaction: Available credit: {event_credit.available_credit}")

        # Commit the changes (saving both the transaction and the updated available_credit)
        db.session.commit()

        # Fetch the updated EventCredit from the database
        updated_event_credit = EventCredit.query.get(event_credit_id)
        print(f"Updated Available credit (from DB): {updated_event_credit.available_credit}")

        return {'message': 'Transaction created successfully', 'transaction_id': new_transaction.id}, 201



@api.route('/report/credit_usage/<int:entity_id>')
class CreditUsageReportResource(Resource):
    def get(self, entity_id):
        # Get pagination parameters (with defaults)
        page = request.args.get('page', 1, type=int)  # Default page is 1
        per_page = request.args.get('per_page', 10, type=int)  # Default per_page is 10
        
        # Get the optional device_id filter
        device_id = request.args.get('device_id', type=str)  # Optional device_id filter
        
        # Start building the query
        query = db.session.query(
            Transaction, EventType, EventCredit
        ).join(
            EventType, EventType.id == Transaction.event_type_id
        ).join(
            EventCredit, EventCredit.id == Transaction.event_credit_id
        ).filter(
            EventCredit.entity_id == entity_id
        )
        
        # Apply the device_id filter if provided
        if device_id:
            query = query.filter(Transaction.device_id == device_id)
        
        query = query.order_by(Transaction.transaction_date.desc())
        
        # Paginate the query
        paginated_transactions = query.paginate(page=page, per_page=per_page, error_out=False)

        
        # If there are no transactions
        if not paginated_transactions.items:
            return {'message': 'No transactions found for this entity.'}, 404
        
        # Prepare the report data
        report = []
        total_credit_used = 0

        for transaction, event_type, event_credit in paginated_transactions.items:
            used_credit = event_type.event_credit  # Credit deducted per transaction
            total_credit_used += used_credit

            # Add the transaction details to the report
            report.append({
                'transaction_id': transaction.id,
                'device_id': transaction.device_id,
                'event_type': event_type.event_type,
                'event_credit': used_credit,
                'available_credit_before': event_credit.available_credit + used_credit,  # Before the deduction
                'available_credit_after': event_credit.available_credit,  # After the deduction
                # 'transaction_date': str(transaction.transaction_date),
                'transaction_date': str(transaction.transaction_date)

            })

        # Return the report data along with pagination info
        return {
            'entity_id': entity_id,
            'total_credit_used': total_credit_used,
            'report': report,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total_pages': paginated_transactions.pages,
                'total_items': paginated_transactions.total
            }
        }


# Start the Flask app
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=6051)


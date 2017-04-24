from flask import Flask
from flask import render_template
from flask import request
from pymongo import MongoClient
import json
from bson import json_util
from bson.code import Code
from bson.json_util import dumps

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'startupviz'
COLLECTION_NAME = 'companies'
COLLECTION_NAME_STATES = 'statenums'
COLLECTION_NAME_COUNTIES = 'uscounty'

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/startupviz/companies", methods=['GET'])
def get_companies():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    companies = collection.find()
    json_companies = []
    for company in companies:
        json_companies.append(company)
    json_companies = json.dumps(json_companies, default=json_util.default)
    connection.close()
    return json_companies

@app.route("/startupviz/graphs/companies/", methods=['GET'])
def get_company():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]

    categeory = request.args.get('category', None)
    status = request.args.get('status', None)
    county = request.args.get('county', None)
    fromYear = request.args.get('fromYear', None)
    toYear = request.args.get('toYear', None)

    json_companies = []
    if categeory == "All" and county == "All":
        companies = collection.find({"status": status, "founded_at": {"$gt":int(fromYear), "$lt":int(toYear)}})
    elif categeory == "All" and county != "All":
        companies = collection.find({"status": status, "county": county, "founded_at": {"$gt":int(fromYear), "$lt":int(toYear)}})
    elif categeory != "All" and county == "All":
        companies = collection.find({"status": status, "category_list": categeory, "founded_at": {"$gt":int(fromYear), "$lt":int(toYear)}})
    else:
        companies = collection.find({"status": status, "category_list": categeory, "county":county, "founded_at": {"$gt":int(fromYear), "$lt":int(toYear)}})

    for company in companies:
        json_companies.append(company)
    json_companies = json.dumps(json_companies, default=json_util.default)
    connection.close()
    return json_companies

@app.route("/startupviz/barchart/categories/", methods=['GET'])
def get_companies_thresholdfunding():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]

    threshold = request.args.get('threshold', None)
    status = request.args.get('status', None)
    county = request.args.get('county', None)
    fromYear = request.args.get('fromYear', None)
    toYear = request.args.get('toYear', None)

    reducerAbove = Code("""
                        function(current, result){
                            if(current.funding_total_usd >parseInt("""+threshold+""")){
                                result.above +=1;
                            }else{
                                result.below+=1;
                            }
                        }""")
    reducerBelow = Code("""
                        function(current, result){
                            result.below+=1;
                        }
                        """)


    json_companies_less = []
    if county == "All":
        companieslessthan = collection.group(key={"category_list": 1}, condition={"status": status, "founded_at": {"$gte": int(fromYear), "$lte": int(toYear)}},initial={"below": 0,"above":0}, reduce=reducerAbove, finalize=None)
    else:
        companieslessthan = collection.group(key={"category_list": 1}, condition={"status": status, "county": county,"founded_at": {"$gte": int(fromYear),"$lte": int(toYear)}},initial={"below": 0, "above": 0}, reduce=reducerAbove, finalize=None)

    for company in companieslessthan:
        json_companies_less.append(company)
    json_companies = json.dumps(json_companies_less, default=json_util.default)
    connection.close()
    return json_companies

@app.route("/startupviz/categories", methods=['GET'])
def get_categories():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    companies = collection.distinct("category_list")
    connection.close()
    return json.dumps(companies, default=json_util.default)

@app.route("/startupviz/statenums", methods=['GET'])
def get_statenums():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME_STATES]
    companies = collection.find()
    json_companies = []
    for company in companies:
        json_companies.append(company)
    json_companies = json.dumps(json_companies, default=json_util.default)
    connection.close()
    return json_companies

@app.route("/startupviz/uscounties", methods=['GET'])
def get_uscounties():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME_COUNTIES]
    companies = collection.find()
    json_companies = []
    for company in companies:
        json_companies.append(company)
    json_companies = json.dumps(json_companies, default=json_util.default)
    connection.close()
    return json_companies

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)

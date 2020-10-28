# This file consists of all the lambda function that helps interact with the Aurora serverless MySql database
# and gathers and manipulates data for the candidate component.


import pymysql
import json
import boto3

def lambda_handler(event, context):
    val1 = 1
    val2 = "ahan"
    sql = f"""SELECT * FROM candidate_info"""
    print(sql)
    print(execute_statement(sql))

def execute_statement(sql):

    rds_client = boto3.client('rds-data')
    response = rds_client.execute_statement(
        secretArn="arn:aws:secretsmanager:ap-south-1:632525348667:secret:rds-db-credentials/cluster-FPODZNUEKADY5L7GV4MFN3B5PM/joyc-6HiTQ8",
        database="galaxytnt",
        resourceArn="arn:aws:rds:ap-south-1:632525348667:cluster:galaxytnt",
        sql=sql
	)
    print(response)
    return response
# This file consists of all the lambda function that helps interact with the Aurora serverless MySql database
# and gathers and manipulates data for the candidate component.

#UPDATE:  currently this file is not under use
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
        secretArn="i_aint_gonna_give_you_the_key",
        database="o_o",
        resourceArn="Damn",
        sql=sql
	)
    print(response)
    return response
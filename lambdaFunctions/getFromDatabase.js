const AWS = require('aws-sdk');
var credentials = {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    };
AWS.config.update({credentials: credentials, region: process.env.AWS_S3_REGION});

exports.handler = async (event) => {
    var funcName = event['queryStringParameters']['funcName'];
    console.log(funcName);
    if (funcName === "selectAllCandidates")
        var result = await selectAllCandidates(); 
    if (funcName === "selectAllSpec")
        var result = await selectAllSpec();
    if (funcName === 'selectIndividualCandidate')
        var result = await selectIndividualCandidate(event['queryStringParameters']['candidateId']);
    if (funcName === 'selectIndividualSpec')
        var result = await selectIndividualSpec(event['queryStringParameters']['candidateId']);
    if (funcName === 'getSignedUrl')
        var result = await getSignedUrl(event['queryStringParameters']);
    if (funcName === 'getCandidatePassportInfo')
        var result = await getCandidatePassportInfo(event['queryStringParameters']['candidateId']);
        
     var response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(result)
    };
    console.log(response);
    
    return response;
};


function selectAllCandidates() {
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    return new Promise((resolve, reject)=>{
        resolve(data.query(`SELECT * FROM candidate_info`));
    });
}

function selectAllSpec(){
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    return new Promise((resolve, reject)=>{
        resolve(data.query(`SELECT * FROM spec_list`));
    });
}

function selectIndividualCandidate(candidateId){
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    return new Promise((resolve, reject)=>{
        resolve(data.query(`SELECT * FROM candidate_info WHERE candidate_id = :id`, {id: candidateId}));
    });
}

function selectIndividualSpec(candidateId){
    console.log("inside selectIndividualSpec");
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    return new Promise((resolve, reject)=>{
        resolve(data.query(`SELECT specialization, experience FROM spec_list, candidate_spec_junc WHERE spec_list.spec_id = candidate_spec_junc.spec_id AND candidate_id = :id`, {id: candidateId}));
    });
}

async function getSignedUrl(parameters){
    
    const urlExpiryDuration = 5; //minutes
    console.log("inside get signed Url");
    const key = parameters['signedUrlFor']+"/"+parameters['fileName'];
    var response = "";
    const s3Params ={ 
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Expires: urlExpiryDuration*60,
      ACL: 'public-read',
      ContentType: "application/pdf"
    };
    const S3 = new AWS.S3();
    try {
      const signedUrl =  await S3.getSignedUrl('putObject', s3Params);
      const objectUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
      response = {signedUrl: signedUrl, objectUrl: objectUrl};
      return response;
    } catch (error) {
      response = error;
      return response;
    }
}

function getCandidatePassportInfo(candidateId) {
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    return new Promise((resolve, reject)=>{
        resolve(data.query(`SELECT * FROM passport_info WHERE candidate_id = :id`, {id: candidateId}));
    });
}
const AWS = require('aws-sdk');
var credentials = {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    };
AWS.config.update({credentials: credentials, region: process.env.AWS_S3_REGION});

exports.handler = async (event) => {
    
    var funcName = event['queryStringParameters']['funcName'];
    console.log(funcName);
    if (funcName === "updateCandidate")
        var result = await updateCandidate(event['queryStringParameters']);
    if (funcName === "deleteCandidateSpecialization")
        var result = await deleteCandidateSpecialization(event['queryStringParameters']);
    if(funcName === "deleteCandidate")
        var result = await deleteCandidate(event['queryStringParameters']);
    if(funcName === 'deleteCandidateResume')
        var result = await deleteCandidateResume(event['queryStringParameters']);
        
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

function deleteCandidateSpecialization(parameters){
     console.log("Delete Candidate Specialization");
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    return new Promise((resolve, reject)=>{
        resolve(data.query(`DELETE from candidate_spec_junc WHERE candidate_id = :id`
        , {id: parameters['candidateId']}));
        }
    );
}

function updateCandidate(parameters){
    console.log("Update Candidate Info");
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    return new Promise((resolve, reject)=>{
        resolve(data.query(`UPDATE candidate_info SET first_name = :first_name, last_name = :last_name, contact_no = :contact_no, DOB = :DOB, address = :address, email = :email, country = :country, state = :state, pincode = :pincode, gender = :gender, origin = :origin, status = :status WHERE candidate_id = :id`
        , {first_name: parameters['first_name'], last_name: parameters['last_name'], contact_no: parameters['contact_no'], DOB: parameters['DOB'], address: parameters['address'], email: parameters['email'], country: parameters['country'], state: parameters['state'], pincode: parameters['pincode'], gender: parameters['gender'], origin: parameters['origin'], status: parameters['status'], id: parameters['candidateId']}));
        }
    );
}

function deleteCandidate(parameters){
    console.log("Delete Candidate");
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    return new Promise((resolve, reject)=>{
        resolve(data.query(`DELETE FROM candidate_info WHERE candidate_id = :id`
        , {id: parameters['candidateId']}));
        }
    );
}

async function deleteCandidateResume(parameters){
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    let objectUrl = parameters['objectUrl'];
    var response = {};
    let candidateId = parameters['candidateId'];
    response.S3Response = await deleteResumeFromS3(objectUrl);
    response.RDSResponse = await new Promise((resolve, reject)=>{
        resolve(data.query(`UPDATE candidate_info SET biodata = NULL WHERE candidate_id = :candidateId`, {candidateId: candidateId}));
        }
    );
    console.log(response);
    return response;
}

async function deleteResumeFromS3(objectUrl){
    var key = objectUrl.split('.amazonaws.com/')[1];
    var resp;
    const s3Params ={ 
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key
    };
    const S3 = new AWS.S3();
    try {
        await S3.headObject(s3Params).promise();
        // when file is found
        try {
            await S3.deleteObject(s3Params).promise();
            resp = "File Deleted from S3 Successfully";
        }
        catch (err) {
            resp = "ERROR in file Deleting : " + JSON.stringify(err);
        }
    } 
    catch (err) {
        resp = "File not Found in S3 : " + err.code;
    }
    return resp;
}
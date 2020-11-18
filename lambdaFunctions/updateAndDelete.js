exports.handler = async (event) => {
    
    var funcName = event['queryStringParameters']['funcName'];
    console.log(funcName);
    if (funcName === "updateCandidate")
        var result = await updateCandidate(event['queryStringParameters']);
    if (funcName === "deleteCandidateSpecialization")
        var result = await deleteCandidateSpecialization(event['queryStringParameters'])
        
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

function updateCandidate(parameters){
    console.log("Update Candidate Info");
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

function deleteCandidateSpecialization(parameters){
     console.log("Delete Candidate Specialization");
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    return new Promise((resolve, reject)=>{
        resolve(data.query(`UPDATE candidate_info SET first_name = :first_name, last_name = :last_name, contact_no = :contact, DOB = :DOB, address = :address, email = :email, country = :country, state = :state, pincode = :pincode, gender = :gender, origin = :origin, status = :status WHERE candidate_id = :id`
        , {first_name: parameters['first_name'], last_name: parameters['last_name'], contact_no: parameters['contact_no'], DOB: parameters['DOB'], address: parameters['address'], email: parameters['email'], country: parameters['country'], state: parameters['state'], pincode: parameters['pincode'], gender: parameters['gender'], origin: parameters['origin'], status: parameters['status'], id: parameters['candidateId']}));
        }
    );
}
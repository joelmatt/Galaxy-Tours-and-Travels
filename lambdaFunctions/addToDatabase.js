exports.handler = async (event) => {
    console.log(event);
    var funcName = event['queryStringParameters']['funcName'];

    if (funcName === "addNewCandidate")
        var result = await addNewCandidate(event['queryStringParameters']); 
        
    if (funcName === "addNewSpecializations")
        var result = await addNewSpecializations(event['queryStringParameters']); 
    
    if (funcName === "addCandidateSpecialization")
        var result = await addCandidateSpecialization(event['queryStringParameters']);
    
    if (funcName === "addCandidateResume")
        var result = await addCandidateResume(event['queryStringParameters']);
        
    var response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(result)
    };
    return response;
}

function addNewCandidate(parameters) {
    console.log("Add New Candidate");
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    return new Promise((resolve, reject)=>{
        resolve( data.transaction()
            .query(`INSERT INTO candidate_info(candidate_id, first_name, last_name, contact_no, gender, address, state, country, pincode, email, origin, status, DOB, DOE) VALUES 
                (uuid(), :first_name, :last_name, :contact_no, :gender, :address, :state, :country, :pincode, :email, :origin, :status, :DOB, curdate())`, 
                {first_name: parameters['first_name'], last_name: parameters['last_name'], contact_no: parameters['contact_no'], gender: parameters['gender'], address: parameters['address'], state: parameters['state'], country: parameters['country'], pincode: parameters['pincode'], email: parameters['email'], origin: parameters['origin'], status: parameters['status'], DOB: parameters['DOB']})
            .query((r) => ['SELECT candidate_id FROM candidate_info  WHERE id = :id', {id: r.insertId } ])
            .rollback((e,status) => { /* do something with the error */ }) // optional
            .commit()); // execute the queries);
        }
    );
}

function addNewSpecializations(parameters){
    console.log("Add New Specialization");
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    let specList = parameters['specs'].split(', ');
    let listOfSpecs = []; // based on the format given in the data-api documentation
    for (let i=0; i<specList.length; i++){
        listOfSpecs.push([{specName: specList[i]}]);
    }
    return new Promise((resolve, reject)=>{
        resolve(data.query(`INSERT INTO spec_list VALUES (uuid(), :specName)`, listOfSpecs));
        }
    );
}

function addCandidateSpecialization(parameters){
    console.log("Add Candidate Specialization");
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    let specList = parameters['specIds'].split(', ');
    let expList = parameters['exp'].split(', ');
    let listOfSpecsAndExp = [];
    for (let i=0; i<specList.length; i++){
        listOfSpecsAndExp.push([{spec_id: specList[i], exp: expList[i], candidate_id: parameters['candidateId']}]);
    }
    return new Promise((resolve, reject)=>{
        resolve(data.query(`INSERT INTO candidate_spec_junc VALUES (:candidate_id, :spec_id, :exp)`, listOfSpecsAndExp));
        }
    );
}

function addCandidateResume(parameters){
    console.log("Add Candidate Resume");
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    let objectUrl = parameters['objectUrl'];
    let candidateId = parameters['candidateId'];
    return new Promise((resolve, reject)=>{
        resolve(data.query(`UPDATE candidate_info SET biodata = :objectUrl WHERE candidate_id = :candidateId`, {objectUrl: objectUrl, candidateId: candidateId}))
        }
    );
    
}


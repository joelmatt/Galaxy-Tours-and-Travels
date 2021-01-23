exports.handler = async (event) => {
    console.log(event);
    var funcName = event['queryStringParameters']['funcName'];

    if (funcName === "addNewCandidate")
        var result = await addNewCandidate(event['queryStringParameters']); 
    
    if (funcName === "addNewSponsor")
        var result = await addNewSponsor(event['queryStringParameters']); 
        
    if (funcName === "addNewSpecializations")
        var result = await addNewSpecializations(event['queryStringParameters']); 
    
    if (funcName === "addCandidateSpecialization")
        var result = await addCandidateSpecialization(event['queryStringParameters']);
    
    if (funcName === "addCandidateResume")
        var result = await addCandidateResume(event['queryStringParameters']);
        
    if (funcName === "addCandidatePassportInfo")
        var result = await addCandidatePassportInfo(event['queryStringParameters']);
        
    if (funcName === 'addCandidatePassportCopy')
        var result = await addCandidatePassportCopy(event['queryStringParameters']);
    
    if (funcName === 'addNewRecruitment')
        var result = await addNewRecruitment(event['queryStringParameters']);
    
    if (funcName === 'addRecruitmentSpecialization')
        var result = await addRecruitmentSpecialization(event['queryStringParameters']);
        
    var response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(result)
    };
    return response;
}

function addNewRecruitment(parameters){
    console.log("Add New Recruitment");
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    return new Promise((resolve, reject)=>{
        resolve( data.transaction()
            .query(`INSERT INTO recruitment_list(recruitment_id, sponsor_id, total_cat, DOC, recruitment_name, status) VALUES 
                (uuid(), :sponsor_id, :total_cat, curdate(), :name, :status)`, 
                {sponsor_id: parameters['sponsor_id'], name: parameters['name'], total_cat: parameters['total_cat'], status: parameters['status']})
                .query((r) => ['SELECT recruitment_id FROM recruitment_list WHERE id = :id', {id: r.insertId} ])
            .rollback((e,status) => { /* do something with the error */ }) // optional
            .commit())
    });
}

function addRecruitmentSpecialization(parameters){
    console.log("Add Recruitment Specialization");
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    let specList = parameters['specIds'].split(', ');
    let totalList = parameters['total'].split(', ');
    let listOfSpecsAndExp = [];
    for (let i=0; i<specList.length; i++){
        listOfSpecsAndExp.push([{spec_id: specList[i], total: totalList[i], recruitment_id: parameters['recruitmentId']}]);
    }
    return new Promise((resolve, reject)=>{
        resolve(data.query(`INSERT INTO recruit_req_junc VALUES (:recruitment_id, :spec_id, :total)`, listOfSpecsAndExp));
        }
    );
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

function addNewSponsor(parameters){
     console.log("Add New Sponsor");
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    return new Promise((resolve, reject)=>{
        resolve( data.transaction()
            .query(`INSERT INTO sponsor_info(sponsor_id, name, contact, address, state, country, email) VALUES 
                (uuid(), :name, :contact, :address, :state, :country, :email)`, 
                {name: parameters['name'], contact: parameters['contact_no'], address: parameters['address'], state: parameters['state'], country: parameters['country'], email: parameters['email']})
            .query((r) => ['SELECT sponsor_id FROM sponsor_info  WHERE id = :id', {id: r.insertId } ])
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
        resolve(data.query(`UPDATE candidate_info SET biodata = :objectUrl WHERE candidate_id = :candidateId`, {objectUrl: objectUrl, candidateId: candidateId}));
        }
    );
}

function addCandidatePassportInfo(parameters){
    console.log("Add Candidate Passport Information");
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    return new Promise((resolve, reject)=>{
        resolve(data.query(`INSERT INTO passport_info (candidate_id, passport_no, POI, DOI, DOE) VALUES (:candidate_id, :passport_no, :POI, :DOI, :DOE)`, {candidate_id: parameters['candidateId'], passport_no: parameters['passportNo'], POI: parameters['POI'], DOI: parameters['DOI'], DOE: parameters['DOE']}));
        }
    );
}

function addCandidatePassportCopy(parameters){
    console.log("Add Candidate Passport Copy");
    let objectUrl = parameters['objectUrl'];
    let candidateId = parameters['candidateId'];
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    return new Promise((resolve, reject)=>{
        resolve(data.query(`UPDATE passport_info SET passport_copy = :objectUrl WHERE candidate_id = :candidateId`, {objectUrl: objectUrl, candidateId: candidateId}));
        }
    );
}


exports.handler = async (event) => {
    
    var funcName = event['queryStringParameters']['funcName'];
    console.log(funcName)
    if (funcName === "selectAllCandidates")
        var result = await selectAllCandidates(); 
    if (funcName === "selectAllSpec")
        var result = await selectAllSpec();
    if (funcName === 'selectIndividualCandidate')
        var result = await selectIndividualCandidate(event['queryStringParameters']['candidateId']);
    if (funcName === 'selectIndividualSpec')
        var result = await selectIndividualSpec(event['queryStringParameters']['candidateId']);
        
     var response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(result)
    };
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
    const data = require('data-api-client')({
        secretArn: process.env.AWS_SECRET_ARN,
        resourceArn: process.env.AWS_RESOURCE_ARN,
        database: 'galaxytnt',
    });
    return new Promise((resolve, reject)=>{
        resolve(data.query(`SELECT specialization, experience from spec_list, candidate_spec_junc WHERE spec_list.spec_id = candidate_spec_junc.spec_id AND candidate_id = :id`, {id: candidateId}));
    });
}
exports.handler = async (event) => {
    let result = await selectAllQuery();
     var response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(result)
    };
    return response;
};


function selectAllQuery() {
     const data = require('data-api-client')({
        secretArn: 'na_na_na_na',
        resourceArn: 'nopity_nope',
        database: 'galaxytnt',
    });
    return new Promise((resolve, reject)=>{
        resolve(data.query(`SELECT * FROM candidate_info`));
    });
}
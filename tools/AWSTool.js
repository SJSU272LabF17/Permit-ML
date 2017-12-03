
var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
var machinelearning = new AWS.MachineLearning({
//endpoint:'https://realtime.machinelearning.us-east-1.amazonaws.com',//(String)—TheendpointURItosendrequeststo.Thedefaultendpointisbuiltfromtheconfiguredregion.Theendpointshouldbeastringlike'https://{service}.{region}.amazonaws.com'.
    accessKeyId:'AKIAI54JCCPZPSYEXRUA',//(String)—yourAWSaccesskeyID.
    secretAccessKey:'nuZTxkcxt/QB7k98a/qL1ejzrB6Haed72V1SBYZU'//(String)—yourAWSsecretaccesskey.
    //region:'us-east-1'
});
// console.log(machinelearning);

// - Predict
exports.predict = function(data, callback) {
    var params={
        MLModelId:'ml-SxI4oUce22b',/*required*/
        PredictEndpoint:'https://realtime.machinelearning.us-east-1.amazonaws.com',/*required*/
        Record:data
    };
    machinelearning.predict(params,function(err,result){
        if(err)
            console.log(err,err.stack);//an error occurred
        else
            console.log(result);//successful response
            callback(result);
    });

};


// - Get Model information
// var params = {
//   MLModelId: 'STRING_VALUE', /* required */
//   Verbose: true
// };
// machinelearning.getMLModel(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });



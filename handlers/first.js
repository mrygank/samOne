const AWS = require("aws-sdk");
const YAML = require("yaml");

AWS.config.update({ region: "us-west-2" });

const s3 = new AWS.S3();
const cloudformation = new AWS.CloudFormation();

const stackName = "sam-infenion";
// const templatePath = "template.yml";
let customTableName = "thisIsSample";
let customStageName = "dev";

async function readTemplateFromS3() {
  const params = {
    Bucket: "sam-applciation-custom",
    Key: "template.yml",
  };

  try {
    const data = await s3.getObject(params).promise();
    console.log
    return data.Body.toString();
  } catch (err) {
    console.error("Error reading template from S3:", err);
    throw err;
  }
}

function modifyTemplate(templateBody) {
  const templateObj = YAML.parse(templateBody);

  templateObj.Resources.MyDynamoDBTable.Properties.TableName = customTableName;
  templateObj.Resources.MyApi.Properties.StageName = customStageName;

  return YAML.stringify(templateObj);
}

async function updateStack(modifiedTemplate) {
  const params = {
    StackName: stackName,
    TemplateBody: modifiedTemplate,
    Capabilities: ["CAPABILITY_AUTO_EXPAND","CAPABILITY_IAM"],
  };

  try {
    const data = await cloudformation.createStack(params).promise();
    // const data = await cloudformation.updateStack(params).promise();
    console.log("Stack update initiated:", data);
  } catch (err) {
    console.error("Error updating stack:", err);
    throw err;
  }
}

exports.handler = async (event) => {
  try {
    console.log(event);
    const parsedBody = JSON.parse(event.body);
    customTableName = parsedBody.customTableName;
    customStageName = parsedBody.customStageName;
    const templateBody = await readTemplateFromS3();
    const modifiedTemplate = modifyTemplate(templateBody);
    await updateStack(modifiedTemplate);
  } catch (err) {
    console.error("Error:", err);
  }
};

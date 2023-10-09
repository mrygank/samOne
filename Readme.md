upload the saamTwo files on an s3 bucket

update the values as required in template file and handler of samOne

run sam deploy command on first repository samONE
`sam deploy --guided --capabilities CAPABILITY_NAMED_IAM `


you should be able to have lambda resource for the samOne, use the URL in the triggers and send JSON with tqwo parameters
`{
    "customTableName":"testingdynamomg",
    "customStageName":"dev"

}`

you should be able to create new lambda function according to the yml in the samTwo repository

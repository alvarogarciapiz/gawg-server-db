import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://gawg.lvrpiz.com, https://www.gawg.lvrpiz.com',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: ''
    };
  }

  let formData;
  try {
    formData = JSON.parse(event.body);
  } catch (error) {
    console.error('Error parsing event body:', error);
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': 'https://gawg.lvrpiz.com, https://www.gawg.lvrpiz.com',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify({ message: 'Invalid request body' }),
    };
  }

  const params = {
    TableName: 'gawg',
    Item: {
      id: formData.repositoryFullName,
      ...formData
    }
  };

  try {
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://gawg.lvrpiz.com, https://www.gawg.lvrpiz.com',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify({ message: 'Data saved successfully' }),
    };
  } catch (error) {
    console.error('Error saving data:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://gawg.lvrpiz.com, https://www.gawg.lvrpiz.com',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      },
      body: JSON.stringify({ message: 'Error saving data' }),
    };
  }
};
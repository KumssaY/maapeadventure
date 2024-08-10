const axios = require('axios');
const configure = require('../config');

async function authenticate() {
  const data = JSON.stringify({
    consumer_key: configure.consumerKey,//'qkio1BGGYAXTu2JOfm7XSXNruoZsrqEW',
    consumer_secret: configure.consumerSecret,//'osGQ364R49cXKeOYSpaOnT++rHs='
  });
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken',
    headers: { 
      'Accept': 'application/json', 
      'Content-Type': 'application/json'
    },
    data: data
  };
  try {
    const response = await axios(config);
    console.log('Authentication Response:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Error authenticating:', error);
    throw error;
  }
}

async function registerIPNUrl(token, ipnUrl) {
  const data = JSON.stringify({
    url: ipnUrl,
    ipn_notification_type: "GET"
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://cybqa.pesapal.com/pesapalv3/api/URLSetup/RegisterIPN',
    headers: { 
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: data
  };

  try {
    const response = await axios(config);
    console.log('Register IPN URL Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error registering IPN URL:', error);
    throw error;
  }
}

async function getRegisteredIPNs(token) {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://cybqa.pesapal.com/pesapalv3/api/URLSetup/GetIpnList',
    headers: { 
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const response = await axios(config);
    console.log('Get Registered IPNs Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting registered IPNs:', error);
    throw error;
  }
};

async function submitOrderRequest(token, order) {
  const data = JSON.stringify(order);

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: data
  };

  try {
    const response = await axios(config);
    console.log('Submit Order Request Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting order request:', error);
    throw error;
  }
};

async function getTransactionStatus(token, orderTrackingId) {
  const config = {
    method: 'get',
    url: `https://cybqa.pesapal.com/pesapalv3/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
    headers: { 
      'Accept': 'application/json', 
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error getting transaction status:', error);
    throw error;
  }
}

async function refundOrder(token, confirmationCode, amount, username, remarks) {
  const data = JSON.stringify({
    confirmation_code: confirmationCode,
    amount: amount,
    username: username,
    remarks: remarks
  });

  const config = {
    method: 'post',
    url: 'https://cybqa.pesapal.com/pesapalv3/api/Transactions/RefundRequest',
    headers: { 
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: data
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error refunding order:', error);
    throw error;
  }
}

async function cancelOrder(token, orderTrackingId) {
  const data = JSON.stringify({
    order_tracking_id: orderTrackingId
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://cybqa.pesapal.com/pesapalv3/api/Transactions/CancelOrder',
    headers: { 
      'Accept': 'application/json', 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: data
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error canceling order:', error);
    throw error;
  }
}

module.exports = {
  authenticate,
  registerIPNUrl,
  getRegisteredIPNs,
  submitOrderRequest,
  getTransactionStatus,
  refundOrder,
  cancelOrder
};

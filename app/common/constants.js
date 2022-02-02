export const httpConstants = {
  METHOD_TYPE: {
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT'
  },
  HEADER_TYPE: {
    URL_ENCODED: 'application/x-www-form-urlencoded',
    APPLICATION_JSON: 'application/json'
  },
  HEADER_KEYS: {
    DEVICE_TYPE: 'device-type',
    DEVICE_ID: 'device-id',
    SESSION_TOKEN: 'session-token',
    PUSH_TOKEN: 'push-token'
  },
  DEVICE_TYPE: {
    ANDROID: 'android',
    IOS: 'ios',
    WEB: 'web'
  },
  CONTENT_TYPE: {
    URL_ENCODE: 'application/x-www-form-urlencoded'
  },
  WEBSERVICE_PATH: {
    SYNC_ATTENDANCE: 'sync-attendance/'
  },

  RESPONSE_STATUS: {
    SUCCESS: true,
    FAILURE: false
  },
  RESPONSE_CODES: {
    UNAUTHORIZED: 401,
    SERVER_ERROR: 500,
    NOT_FOUND: 404,
    OK: 200,
    NO_CONTENT_FOUND: 204,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    GONE: 410,
    UNSUPPORTED_MEDIA_TYPE: 415,
    TOO_MANY_REQUEST: 429
  },
  LOG_LEVEL_TYPE: {
    INFO: 'info',
    ERROR: 'error',
    WARN: 'warn',
    VERBOSE: 'verbose',
    DEBUG: 'debug',
    SILLY: 'silly',
    FUNCTIONAL: 'functional',
    HTTP_REQUEST: 'http request'
  }
}

export const stringConstants = {
  SERVICE_STATUS_HTML:
    '<body style="font-family: Helvetica !important; background-color: black">' +
    '<div style="display: flex; flex:1; height: 100% ; justify-content: center; align-items: center; min-height: 100vh !important; font-size: 24px !important; color: #605DFF !important;">' +
    '⚡ Template 🔋 MicroService is working fine</div></body>'
}

export const genericConstants = {
  DEVICE_TYPE: {}
}

export const apiSuccessMessage = {
  FETCH_SUCCESS: 'Information fetched successfully',
  SAVED_AS_DRAFT: 'Contract saved as draft successfully',
  TOKEN_DETAILS_UPDATED: 'Token details updated successfully',
  TOKEN_DETAILS_FETCHED: 'Token details fetched successfully',
  TOKEN_DELETED: 'Token deleted successfully'
}

export const apiEndpoints = {
  GET_METERS: '/get-meters'
}

export const apiFailureMessage = {
  INVALID_PARAMS: 'Invalid Parameters',
  INVALID_REQUEST: 'Invalid Request',
  INVALID_SESSION_TOKEN: 'Invalid session token',
  INTERNAL_SERVER_ERROR: 'Internal server Error',
  BAD_REQUEST: 'Bad Request!',
  DEVICE_ID_OR_SESSION_TOKEN_EMPTY: 'Device id or session token can\'t be empty or null',
  SESSION_GENERATION: 'Unable to generate session!',
  SESSION_EXPIRED: 'Session Expired!',
  TOKEN_NAME_EXISTS: 'Token with this name already exists!',
  TOKEN_SYMBOL_EXISTS: 'Token with this symbol already exists!',
  NO_SUCH_TOKEN: 'NO SUCH TOKEN EXISTS',
  COULD_NOT_VERIFY_TOKEN: 'COULD NOT VERIFY THE TOKEN',
  COULD_NOT_UPDATE_TOKEN_SOCIAL_MEDIA_URLS: 'COULD NOT UPDATE TOKEN SOCIAL MEDIA URLS'
}

export const contractConstants = {
  DUMMY_CONTRACT_ABI: [
    {
      "constant": true,
      "inputs": [
        {
          "name": "tweetId",
          "type": "uint256"
        }
      ],
      "name": "getTweetByTweetId",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "tweetId",
          "type": "uint256"
        },
        {
          "name": "tweet",
          "type": "string"
        }
      ],
      "name": "createTweet",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getCount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "tweets",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]
}

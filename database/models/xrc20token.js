'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const XRC20Token = sequelize.define('XRC20Token', {
    tokenOwner: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    smartContractAddress: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    tokenName: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    tokenSymbol: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    tokenImage: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    tokenInitialSupply: {
      type: DataTypes.DECIMAL,
      defaultValue: 0
    },
    tokenCurrentSupply: {
      type: DataTypes.DECIMAL,
      defaultValue: 0
    },
    mintedTokens: {
      type: DataTypes.DECIMAL,
      defaultValue: 0
    },
    burntTokens: {
      type: DataTypes.DECIMAL,
      defaultValue: 0
    },
    lastMinted: {
      type: DataTypes.DATE,
    },
    lastBurnt: {
      type: DataTypes.DATE,
    },
    website: {
      type: DataTypes.STRING,
      defaultValue:""
    },
    twitter: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    telegram: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    email: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    linkedIn: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    reddit: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    coinGecko: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    facebook: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    pausable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    mintable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    burnable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    tokenDecimals: {
      type: DataTypes.NUMERIC,
      defaultValue: 0
    },
    tokenDescription: {
      type: DataTypes.TEXT,
      defaultValue: ""
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "DRAFT"
    },
    contractAbiString: {
      type: DataTypes.TEXT,
      defaultValue: "[]"
    },
    network: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    tokenContractCode: {
      type: DataTypes.TEXT,
      defaultValue: ""
    },
    byteCode: {
      type: DataTypes.TEXT,
      defaultValue: ""
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isPaused: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue:DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue:DataTypes.NOW
    }
  }, {});
  XRC20Token.associate = function(models) {
    // associations can be defined here

  };
  return XRC20Token;
};

// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class XRC20Token extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   XRC20Token.init({
//     tokenOwner: DataTypes.STRING,
//     smartContractAddress: DataTypes.STRING,
//     tokenName: DataTypes.STRING,
//     tokenSymbol: DataTypes.STRING,
//     tokenImage: DataTypes.STRING,
//     tokenInitialSupply: DataTypes.NUMERIC,
//     tokenCurrentSupply: DataTypes.NUMERIC,
//     mintedTokens: DataTypes.NUMERIC,
//     burntTokens: DataTypes.NUMERIC,
//     lastMinted: DataTypes.DATE,
//     lastBurnt: DataTypes.DATE,
//     website: DataTypes.STRING,
//     twitter: DataTypes.STRING,
//     telegram: DataTypes.STRING,
//     email: DataTypes.STRING,
//     linkedIn: DataTypes.STRING,
//     reddit: DataTypes.STRING,
//     coinGecko: DataTypes.STRING,
//   }, {
//     sequelize,
//     modelName: 'XRC20Token',
//   });
//   return XRC20Token;
// };

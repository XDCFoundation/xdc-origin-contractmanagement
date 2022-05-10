'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const NFT = sequelize.define('NFT', {
        collectionId: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        nftOwner: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        txHash: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        nftTokenId: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        nftName: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        nftDescription: {
            type: DataTypes.TEXT,
            defaultValue: ""
        },
        ipfsUrl: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "DRAFT"
        },
        network: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        transfers: {
            type: DataTypes.ARRAY(DataTypes.JSON),
            defaultValue: []
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
    NFT.associate = function(models) {
        // associations can be defined here

    };
    return NFT;
};

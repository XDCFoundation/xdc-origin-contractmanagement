# XDC Origin Contractmanagement Microservice

### Usage

This microservice handle all API requests related to contract creation, deployment, and management.
like:

- Save XRC20 token as draft
- Update XRC20 token
- Get draft failed XRC20 token
- Delete XRC20 token
- Get XRC20 token by id
- Verify XRC20 token
- Get deployed XRC20 token
- Mint burn XRC20 token
- Pause resume XRC20 token
- Transfer ownership of XRC20 token
- Update social media urls
- Upload token image.

### Steps for local setup

- clone the repository in your local system
- run `npm install` : To install the dependencies
- run `npm run start` : It will start your server on your local machine
- Configuration : `config/env` directory contains files to define environment specific variables
- Dependencies : Defined under `package.json`
- Database configuration : Defined under `config/dbConnection`
- Deployment instructions : Docker based deployment, Dockerfile is there in parent directory

### About env folder

This folder is having different types of variables like DB url, PORT, microservice url etc.

- **development** : Variables which are used in development environment.
- **local** : Variables which are used for local system.
- **production** : Variables which are used for production environment.
- **test** : Variables which are used for testing purpose.


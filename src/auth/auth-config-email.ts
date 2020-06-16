import { emailAuthTypes, messages } from '../constants'
import mongodb, {MongoClient, MongoError} from 'mongodb';
import oracledb from 'oracledb';
import jwt from 'jsonwebtoken';

import {AuthOptions, OracleConfig} from '../interfaces'
import AuthConfig from "./auth-config";
import { getMongoUri, createHash, isValidPassword} from "../auth-utils"
class AuthConfigEmail extends AuthConfig{
    authType : emailAuthTypes;
    authOptions : AuthOptions;
    mongoClient : MongoClient;
    oracleClient : oracledb.Connection;

    constructor(authType : emailAuthTypes, authOptions : AuthOptions) {
        super();
        this.authType = authType;
        this.authOptions = authOptions;
    }

    configure = () : void => {
        if (!this.authType) return null;
        switch (this.authType) {
            case emailAuthTypes.MONGODB: {
                const { authOptions } = this;
                mongodb.MongoClient.connect( getMongoUri(authOptions), (error : MongoError, database : MongoClient) => {
                    if(error) throw messages.MONGO_CONNECTION_FAILURE;
                    else{
                        this.mongoClient = database;
                        console.log(messages.MONGO_CONNECTION_SUCCESS)
                    }
                });
            }
                break;
            case emailAuthTypes.ORACLE: {
                const { authOptions } = this;
                const dbConfig : OracleConfig = {
                    user : authOptions.username,
                    password : authOptions.password,
                    connectString : authOptions.host,
                    externalAuth : false,
                }
                oracledb.getConnection(dbConfig)
                    .then( (connection) => {
                        this.oracleClient = connection;
                        console.log(messages.ORACLE_CONNECTION_SUCCESS)
                    })
                    .catch((error) => {
                        console.log(messages.ORACLE_CONNECTION_FAILURE)
                        throw error;
                    });
            }
                break;
            default:
                break;
        }
    }

    login = (username : string, password : string): Promise<any> => {
        return new Promise((resolve, reject) => {
            try {
                this.mongoClient
                    .db(process.env.MONGO_SERVICE_NAME)
                    .collection(process.env.MONGO_COLLECTION_NAME)
                    .find({username: username})
                    .toArray((err, result) => {
                        if(result.length === 0){
                            reject(messages.LOGIN_ERROR_USER_DOESNT_EXIST);
                        }
                        else if(isValidPassword(password, result[0].password)){
                            const user = result[0];
                            const accessToken  = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                            resolve(Object.assign({}, user, {accessToken}));
                        }
                        else{
                            reject(messages.LOGIN_ERROR_PASSWORD_MISMATCH);
                        }
                    })
            } catch (e) {
                reject(e);
            }
        })
    }

    signup = (userDetails : any): Promise<any> => {
        return new Promise((resolve, reject) => {
            try {
                this.mongoClient
                    .db(process.env.MONGO_SERVICE_NAME)
                    .collection(process.env.MONGO_COLLECTION_NAME)
                    .find({username: userDetails.username})
                    .toArray((err, result) => {
                        if (result.length > 0){
                            reject(messages.SIGNUP_ERROR_USER_DOESNT_EXIST);
                        }
                        else {
                            const updatedUserDetails = {
                                ...userDetails,
                                password: createHash(userDetails.password),
                            }
                            this.mongoClient.db(process.env.MONGO_SERVICE_NAME)
                            .collection(process.env.MONGO_COLLECTION_NAME)
                            .insertOne(updatedUserDetails)
                            .then((insertedUser) => {
                                if (insertedUser.ops.length > 0){
                                    const accessToken  = jwt.sign(insertedUser.ops[0], process.env.ACCESS_TOKEN_SECRET);
                                    resolve(Object.assign({}, insertedUser.ops[0], {accessToken}));
                                }
                                else reject(messages.SIGNUP_ERROR_WHILE_SAVING_USER);
                            })
                            .catch((error) => {
                                console.log(error)
                                reject(messages.SIGNUP_ERROR_WHILE_SAVING_USER);
                            })
                        }
                    })
            } catch (e) {
                reject(e);
            }
        })
    }

}

export default AuthConfigEmail;

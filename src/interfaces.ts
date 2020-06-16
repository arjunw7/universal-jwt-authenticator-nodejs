export interface AuthOptions {
    username : string;
    password : string;
    host : string;
    port : string;
    serviceName : string;
}

export interface OracleConfig {
    user : string;
    password : string;
    connectString : string;
    externalAuth : boolean;
}

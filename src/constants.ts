export enum emailAuthTypes {
    'MONGODB' = 'MONGODB',
    'ORACLE' = 'ORACLE',
}

export enum messages {
    'MONGO_CONNECTION_FAILURE' = 'Error: Could not establish secure connection with mongodb instance.',
    'MONGO_CONNECTION_SUCCESS' = 'Success: Connection established with mongodb instance.',
    'ORACLE_CONNECTION_FAILURE' = 'Error: Could not establish secure connection with oracle instance.',
    'ORACLE_CONNECTION_SUCCESS' = 'Success: Connection established with oracle instance.',
    'LOGIN_ERROR_USER_DOESNT_EXIST' = 'Error: Username does not exist.',
    'LOGIN_ERROR_PASSWORD_MISMATCH' = 'Error: Incorrect password',
    'SIGNUP_ERROR_USER_DOESNT_EXIST' = 'Error: Username already exists.',
    'SIGNUP_ERROR_WHILE_SAVING_USER' = 'Error: User could not be created.',

}

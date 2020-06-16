/*
 *
 *@AuthConfig base class for authentication.
 *
*/

abstract class AuthConfig {

    abstract configure() : void;

    abstract login(username : string, password : string): Promise<any>;

    abstract signup (user : any): Promise<any>;
}

export default AuthConfig;

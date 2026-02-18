import { APIRequestResources } from "@/lib/api/class/enums";
import { APIRequest } from "@/lib/api/class/api-request";


export class ServerService extends APIRequest {
    constructor() {
        super(APIRequestResources.SERVER);
    }

    login(body: any) {
        return this.post(body, {
            endpoint: "login",
        });
    }

    logout() {
        return this.get({
            endpoint: "logout",
        });
    }
}

export const serverAPI = new ServerService();

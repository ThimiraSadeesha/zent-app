import {APIRequestResources} from "@/lib/api/class/enums";
import {APIRequest} from "@/lib/api/class/api-request";

export class DockerService extends APIRequest {
    constructor() {
        super(APIRequestResources.DOCKER);
    }

    getStats() {
        return this.get<any>({ endpoint: "stats" });
    }

    startContainer(containerName: string) {
        return this.post(
            {},
            {
                endpoint: "start",
                params: {
                    container_name: containerName,
                },
            }
        );
    }

    stopContainer(containerName: string) {
        return this.post(
            {},
            {
                endpoint: "stop",
                params: {
                    container_name: containerName,
                },
            }
        );
    }

    restartContainer(containerName: string) {
        return this.post(
            {},
            {
                endpoint: "restart",
                params: {
                    container_name: containerName,
                },
            }
        );
    }
}

export const dockerService = new DockerService();

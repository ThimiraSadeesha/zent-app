import { APIRequestResources } from "@/lib/api/class/enums";
import { APIRequest } from "@/lib/api/class/api-request";

export class DockerService extends APIRequest {
    constructor() {
        super(APIRequestResources.DOCKER);
    }

    getStats() {
        return this.get<any>({ endpoint: "stats" });
    }

    startContainer(containerName: string) {
        return this.post(
            { action: "start", containerId: containerName },
            { endpoint: "containers" }
        );
    }

    stopContainer(containerName: string) {
        return this.post(
            { action: "stop", containerId: containerName },
            { endpoint: "containers" }
        );
    }

    restartContainer(containerName: string) {
        return this.post(
            { action: "restart", containerId: containerName },
            { endpoint: "containers" }
        );
    }
}

export const dockerService = new DockerService();

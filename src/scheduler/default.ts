import {scheduled} from "../decorator/scheduled";
import {createLogger} from "../helper/logger";

const log = createLogger("scheduler", {
    module: "default",
});

export default class DefaultScheduler {
    @scheduled("0 * * * * *")
    public async defaultScheduler(): Promise<void> {
        log.info("You will see this message every hour");
    }
}

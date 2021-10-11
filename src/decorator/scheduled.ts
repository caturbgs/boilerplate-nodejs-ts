import {CronJob} from "cron";


export function scheduled(timeConfig: string) {
    return (target: unknown, propertyKey: string): void => {
        // eslint-disable-next-line security/detect-object-injection
        CronJob(timeConfig, target[propertyKey], null, true, "Asia/Jakarta");
    };
}

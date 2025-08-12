import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName?: string;
};

export function setUser(name: string) {
    const cfg = readConfig();
    cfg.currentUserName = name;
    writeConfig(cfg);
}

export function readConfig(): Config {
    const cfg = fs.readFileSync(getConfigFilePath(), { encoding: "utf-8" });
    return validateConfig(cfg);
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(config: Config): void {
    const newCfg = {
        db_url: config.dbUrl,
        current_user_name: config.currentUserName,
    }
    fs.writeFileSync(getConfigFilePath(), JSON.stringify(newCfg), {
        encoding: "utf-8",
    });
}

function validateConfig(rawConfig: any): Config {
    const parsedCfg = JSON.parse(rawConfig);
    if (parsedCfg.db_url !== undefined && typeof parsedCfg.db_url === 'string' && (parsedCfg.current_user_name === undefined || typeof parsedCfg.current_user_name === 'string')) {
        const newCfg: Config = {
            dbUrl: parsedCfg.db_url,
            currentUserName: parsedCfg.current_user_name
        };
        return newCfg;
    } else {
        throw new Error("invalid config");
    }
}

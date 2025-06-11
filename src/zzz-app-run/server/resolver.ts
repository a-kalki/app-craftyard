import { BotLogger, CompositeLogger, ConsoleLogger, getEnvLogMode } from "rilata/api-helper";
import {
  BunJwtDecoder, BunJwtVerifier, getJwtSecretKey, getRunMode,
  type JwtConfig, type ServerResolver
} from "rilata/api-server";

const logMode = getEnvLogMode() || 'all';

const runMode = getRunMode();

const logger = new CompositeLogger([
  new ConsoleLogger(logMode),
  new BotLogger(logMode, runMode, {
    token: process.env.DEDOK_LOG_BOT_TOKEN,
    name: process.env.DEDOK_LOG_BOT_NAME,
    managerIds: ['773084180'],
  })
])

const jwtDecoder = new BunJwtDecoder();
const jwtConfig: JwtConfig = {
  algorithm: 'HS512',
  jwtLifetimeAsHour: 24, // default 1 day (24)
  jwtRefreshLifetimeAsHour: 1
}

export const dedokServerResolver: ServerResolver = {
    logger,
    runMode,
    jwtDecoder: jwtDecoder,
    jwtVerifier: new BunJwtVerifier(getJwtSecretKey(), jwtConfig, jwtDecoder),
    jwtCreator: undefined
}

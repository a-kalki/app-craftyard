import type { DedokServerResolver } from "#app/api/server-resolver";
import { BotLogger, ConsoleLogger, getEnvLogMode } from "rilata/api-helper";
import {
  BunJwtCreator, BunJwtVerifier,
  getJwtSecretKey, getRunMode, type JwtConfig,
} from "rilata/api-server";
import { BaseJwtDecoder } from "rilata/core";

function getEnvVar(token: string): string {
  const value = process.env[token];
  if (!value) throw Error(`env variable "${token}" not found`);
  return value;
}

function findEnvVar(token: string): string | undefined {
  return process.env.DEDOK_LOG_BOT_TOKEN;
}

const logMode = getEnvLogMode() || 'all';

const runMode = getRunMode();

const logger = new ConsoleLogger(logMode);

const botLogger = new BotLogger(logMode, runMode, {
  token: getEnvVar('DEDOK_LOG_BOT_TOKEN'),
  name: getEnvVar('DEDOK_LOG_BOT_NAME'),
  managerIds: ['773084180'],
})

const jwtDecoder = new BaseJwtDecoder();

const jwtConfig: JwtConfig = {
  algorithm: 'HS512',
  jwtLifetimeAsHour: 24, // default 1 day (24)
  jwtRefreshLifetimeAsHour: 1
}

export const dedokServerResolver: DedokServerResolver = {
    logger,
    botLogger,
    runMode,
    appBotToken: getEnvVar('DEDOK_APP_BOT_TOKEN'),
    appBotName: getEnvVar('DEDOK_APP_BOT_NAME'),
    jwtDecoder: jwtDecoder,
    jwtVerifier: new BunJwtVerifier(getJwtSecretKey(), jwtConfig, jwtDecoder),
    jwtCreator: new BunJwtCreator(getJwtSecretKey(), jwtConfig, jwtDecoder),
}

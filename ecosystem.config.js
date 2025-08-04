module.exports = {
  apps: [{
    name: "app-cy",
    script: "./src/zzz-app-run/server/main.ts",
    interpreter: "bun",
    args: "--ts", // если Bun требует явного указания TS
    env: {
      NODE_ENV: "production"
    },
    instances: "max",
    exec_mode: "cluster",
    autorestart: true,
    watch: false,
    max_memory_restart: "1G"
  }]
}

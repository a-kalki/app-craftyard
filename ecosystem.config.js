module.exports = {
  apps: [{
    name: "app-cy",
    script: "./src/zzz-app-run/server/main.ts",
    interpreter: "bun",
    args: "start",
    env: {
      NODE_ENV: "production"
    },
    instances: 1,
    exec_mode: "fork",
    autorestart: true,
    watch: false,
    time: true,
    max_memory_restart: "1G"
  }]
}

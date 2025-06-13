module.exports = {
  apps: [{
    name: 'coursewind',
    script: './dist/index.js',
    instances: 1,
    max_memory_restart: '900M',
    node_args: '--max-old-space-size=896',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
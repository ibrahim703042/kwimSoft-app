#!/usr/bin/env node

/**
 * Script to run multiple module apps concurrently
 * Usage: node scripts/run-concurrent.js [app1] [app2] [app3] ...
 * Example: node scripts/run-concurrent.js admin transport hr finance
 * Or: node scripts/run-concurrent.js all (runs all apps)
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);

// Available apps
const availableApps = [
  'admin',
  'transport',
  'hr',
  'finance',
  'crm',
  'product',
  'sales',
  'procurement',
  'manufacturing',
  'inventory',
  'maintenance',
  'carwash',
];

// Determine which apps to run
let appsToRun = [];

if (args.length === 0 || args[0] === 'all') {
  appsToRun = availableApps;
} else {
  appsToRun = args.filter(app => availableApps.includes(app));
  
  if (appsToRun.length === 0) {
    console.error('No valid apps specified.');
    console.error('Available apps:', availableApps.join(', '));
    console.error('Usage: node scripts/run-concurrent.js [app1] [app2] ...');
    console.error('Or: node scripts/run-concurrent.js all');
    process.exit(1);
  }
}

console.log(`Starting ${appsToRun.length} apps: ${appsToRun.join(', ')}`);
console.log('Press Ctrl+C to stop all apps\n');

const processes = [];

// Start each app
appsToRun.forEach(app => {
  const proc = spawn('pnpm', ['--filter', `@kwim/${app}`, 'dev'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
  });

  proc.on('error', (err) => {
    console.error(`Error starting ${app}:`, err);
  });

  processes.push({ name: app, proc });
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\nStopping all apps...');
  processes.forEach(({ name, proc }) => {
    console.log(`Stopping ${name}...`);
    proc.kill();
  });
  process.exit(0);
});

// Handle process exit
process.on('exit', () => {
  processes.forEach(({ proc }) => {
    proc.kill();
  });
});

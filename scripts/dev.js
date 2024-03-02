import { execa } from 'execa';

const __dirname = new URL('.', import.meta.url).pathname;

// 全てのプロセスを終了する
// SIGINT以外の終了イベントも考慮する
const exitFunc = () => {
  global.ps1?.kill();
  global.ps2?.kill();
  global.ps3?.kill();
  global.ps4?.kill();
  global.ps5?.kill();

  // PORT3000をキルする
  execa('npx', ['kill-port', '3000'], {
    stdout: process.stdout,
    stderr: process.stderr,
  });

};
process.on('SIGINT', () => {
  exitFunc();
  process.exit();
});
process.on('exit', exitFunc);
process.on('uncaughtException', () => {
  exitFunc();
  process.exit();
});
process.on('unhandledRejection', () => {
  exitFunc();
  process.exit();
});
process.on('SIGTERM', () => {
  exitFunc();
  process.exit();
});

(async () => {

  // PORT3000をキルする
  await execa('npx', ['kill-port', '3000'], {
    stdout: process.stdout,
    stderr: process.stderr,
  });

  await execa('npm', ['run', 'clean'], {
    cwd: __dirname + '/../',
    stdout: process.stdout,
    stderr: process.stderr,
  });

  await execa('npm', ['run', 'build'], {
    cwd: __dirname + '/../packages/frontend',
    stdout: process.stdout,
    stderr: process.stderr,
  });

  global.ps1 = execa('npm', ['run', 'watch'], {
    cwd: __dirname + '/../packages/frontend',
    stdout: process.stdout,
    stderr: process.stderr,
  });

  global.ps2 = execa('npx', ['gulp', 'watch'], {
    cwd: __dirname + '/../',
    stdout: process.stdout,
    stderr: process.stderr,
  });

  global.ps3 = execa('npm', ['run', 'watch'], {
    cwd: __dirname + '/../packages/backend',
    stdout: process.stdout,
    stderr: process.stderr,
  });

  global.ps4 = execa('npm', ['run', 'watch'], {
    cwd: __dirname + '/../packages/sw',
    stdout: process.stdout,
    stderr: process.stderr,
  });


  const start = async () => {
    try {
      global.ps5 = await execa('npm', ['run', 'start'], {
        cwd: __dirname + '/../',
        stdout: process.stdout,
        stderr: process.stderr,
      });
    } catch (e) {
      console.error(e);
      await new Promise(resolve => setTimeout(resolve, 3000));
      start();
    }
  };

  start();
})();




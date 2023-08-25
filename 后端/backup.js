const cron = require('node-cron');
const { exec } = require('child_process');

// exec('mysqldump --defaults-extra-file=db/ChatManager.cnf -h 172.24.65.70 -u ChatManager Chat > backup/backup.sql', (error, stdout, stderr) => {
//     if (error) {
//       console.error('备份数据库时出错:', error);
//     } else {
//       console.log('数据库备份成功');
//     }
//   });

cron.schedule('0 4 * * *', () => {
    exec('mysqldump -h 172.24.65.70 -u ChatManager -p 123456 Chat > backup/backup.sql', (error, stdout, stderr) => {
      if (error) {
        console.error('备份数据库时出错:', error);
      } else {
        console.log('数据库备份成功');
      }
    });
  });
  
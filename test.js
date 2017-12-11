var path, node_ssh, ssh, fs
os = require('os')
fs = require('fs')
path = require('path')
node_ssh = require('node-ssh')
ssh = new node_ssh()
console.log(os.homedir())
  
//上传文件
// ssh.connect({
//     host: '10.11.16.112',
//     username: 'root',
//     privateKey: '/Users/pengxiang/.ssh/id_rsa'
// }).then(function() {
//     // Local, Remote
//     ssh.putFile('/Users/pengxiang/workspace/bank/test/test.js', '/root/test/test.js').then(function() {
//             console.log("The File thing is done")
//         }, function(error) {
//             console.log("Something's wrong")
//             console.log(error)
//         }
//     )
// })

// 上传目录
const failed = []
const successful = []
ssh.connect({
    host: '10.11.16.112',
    username: 'root',
    privateKey: `${os.homedir()}/.ssh/id_rsa`
}).then(function(){
    ssh.putDirectory('../ssh', '/root/test', {
        recursive: true,
        concurrency: 10,
        validate: function(itemPath) {
            const baseName = path.basename(itemPath)
            return baseName.substr(0, 1) !== '.' && // do not allow dot files
            baseName !== 'node_modules' // do not allow node_modules
        },
        tick: function(localPath, remotePath, error) {
            if (error) {
                failed.push(localPath)
            } else {
                successful.push(localPath)
            }
       }
    }).then(function(status) {
        console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
        console.log('failed transfers', failed.join(', '))
        console.log('successful transfers', successful.join(', '))
        ssh.dispose()
    })
})
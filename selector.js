var connection = null
const RPC = require('discord-rpc');
const Swal = require('sweetalert2')
const fs = require('fs')
const { shell } = require('electron')

async function select(name) {
    if (connection) if(connection.name === name){
        document.getElementById(connection.name).style.backgroundColor = 'transparent'
        connection = null
        return connection.destroy()
    }
    Swal.fire({
        title: 'Do you want to start ' + name.replace(".json", "").replace(".", "") + '?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `Cancel`,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            console.log(name)
        
            if(connection){
                document.getElementById(connection.name).style.backgroundColor = 'transparent'
                connection.destroy()
            }
        
            var data = await fs.readFileSync('./rpcs/'+name, 'utf8')
            data = JSON.parse(data)
        
            connection = new RPC.Client({ transport: 'ipc' });
            connection.login({ clientId: data.clientID });
            connection.on('ready', () => {
                const activity = {
                    startTimestamp: Date.now(),
                    instance: true
                }
                if(data.detail){
                    activity.details = data.detail
                }
                if(data.state){
                    activity.state = data.state
                }
        
                if(data.assets.large_image){
                    activity.largeImageKey = data.assets.large_image
                }
                if(data.assets.large_text){
                    activity.largeImageText = data.assets.large_text
                }
                if(data.assets.small_image){
                    activity.smallImageKey = data.assets.small_image
                }
                if(data.assets.small_text){
                    activity.smallImageText = data.assets.small_text
                }
        
                if(data.buttons[0]) {
                    activity.buttons = []
                    activity.buttons[0] = data.buttons[0]
                }
                if(data.buttons[1]) {
                    activity.buttons[1] = data.buttons[1]
                }
        
                connection.setActivity(activity);
                document.getElementById(name).style.backgroundColor = 'rgba(4, 0, 255, 0.295)'
                connection.name = name
            })
        } else if (result.isDenied) {
          Swal.fire('Canceled', '', 'info')
        }
      })
}

function openDir(){
    let spawn = require("child_process").spawn
    shell.openExternal('file://' + process.cwd()+'/rpcs')
}
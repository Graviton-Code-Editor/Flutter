
const flutter_dm = new dropMenu({
	id:"flutter_dm"
});

const flutter_plugin = new Plugin({
  name:'Flutter'
})

let selected_device = [null,null];

flutter_plugin.createData({
	device:selected_device
})

flutter_plugin.getData(function(data){
	selected_device = data.device;
	flutter_dm.setList({
		"button": "Flutter",
		"list":{
			"Run":{
				click:function(){
					const { exec } = require('child_process');
					exec(`flutter`,(err)=>{
						if(err){
							new Notification({
								title:'Flutter',
								content:'Flutter is not installed',
								buttons:{
									"Install":{
										click:function(){
											shell.openExternal("https://flutter.dev/docs/get-started/install")
											}
										}
									}
							})
							return;
						}
					})

					if(selected_device == [null,null]){
						new Notification({
							title:'Flutter',
							content:'Select a device before running the app.'
						})
						return;
					}



					if(graviton.getCurrentDirectory() == null){
						new Notification({
							title:'Flutter',
							content:"Open your app's folder before running the app"
						})
						return;
					}
					const command = exec(`cd ${graviton.getCurrentDirectory()} && flutter run -d ${selected_device[1]}`);

					let times = 0;

					command.stdout.on('data', (data) => {
						if(times == 0){
							new Notification({
							 	title:'Flutter',
							 	content:'Running...'
							 })

						}
						times ++
					  	console.log(`stdout: ${data}`);
					});

					command.on('close', (code) => {
						if(code==0) return;
					});

					command.on('exit', (code) => {
						if(code==0) return;
						 new Notification({
						 	title:'Flutter',
						 	content:'An error was detected.'
						 })
					});
				}
			},
			"Select device":{
				click:function(){
					const { exec } = require('child_process');
					const command = exec(`flutter devices`);

					let devices =[];
					let times = 0;

					function selectMe(me){
						const childrens = me.parentElement.children;
						for(let i = 0;i<childrens.length;i++){
							childrens[i].style = "";
						}
						me.style = "background:var(--accentColor); color:var(--black-white);";
						selected_device = JSON.parse(me.getAttribute("data"))
						console.log(selected_device)
						flutter_plugin.saveData({
							device:selected_device
						})
					}

					command.stdout.on('data', (data) => {
						console.log(data);
						if(data.match('^No')){
								document.getElementById("devices_list").innerHTML = "No devices has been found."	
								return;
						}
						times++;
						if(times==1) return;
						const parsed = data.split("•");
						const device_div = document.createElement("div");
						device_div.classList = "section-2";
						device_div.innerText = parsed[0];
						device_div.setAttribute("data",JSON.stringify(parsed))
						if(selected_device[1]==parsed[1]){
							device_div.style = "background:var(--accentColor);color:var(--black-white);";
						}
						device_div.onclick = function(){
							selectMe(this)
						}
						document.getElementById("devices_list").appendChild(device_div)
						devices.push(parsed)
						console.log(devices)
					})

					const devices_window = new Dialog({
						id:'devices_window',
						title:'Devices',
						content:`<div id=devices_list>

						</div>`,
						buttons:{
							Close:{
								click:{}
							}
						}
					})			
				}
			},
			"Information":{
				click:function(){
					new Dialog({
						title:'About Flutter plugin',
						content:"This plugin is not made by the team of Flutter, it's made by the creator of Graviton.",
						buttons:{
							Close:{
								click:{}
							}
						}
					})
				}
			}
		}
	})
})

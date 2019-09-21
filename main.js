
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
					const Flutter = require("flutter-node")
					const { exec } = require('child_process');
					let _times = 0;
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
					Flutter.run({
					    path:graviton.getCurrentDirectory(),
					    id:selected_device[1]
					},function(output,err){
						_times++;
					 	if(err){
							new Notification({
							 title:'Flutter',
							 content:'An error was detected.'
							})
							return;
						}
						if(_times == 0){
							new Notification({
								title:'Flutter',
								content:'Running...'
							 })
						}
						console.log(output)
					})
				}
			},
			"Select device":{
				click:function(){
					const Flutter = require("flutter-node")
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
					Flutter.getDevices(function(list,err){
						if(err){
							document.getElementById("devices_list").innerHTML = "No devices has been found."
							return;
						}
						list.forEach((dev)=>{
							const device_div = document.createElement("div");
							if(selected_device[0] == dev[0]) device_div.style = "background:var(--accentColor); color:var(--black-white);";
							device_div.classList = "section-2";
							device_div.innerText = dev[0];
							device_div.onclick = function(){
								const childrens = device_div.parentElement.children;
								for(let i = 0;i<childrens.length;i++){
									childrens[i].style = "";
								}
								device_div.style = "background:var(--accentColor); color:var(--black-white);";
								selected_device = dev;
								flutter_plugin.saveData({
									device:dev
								})
							}
							document.getElementById("devices_list").appendChild(device_div)
						})
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

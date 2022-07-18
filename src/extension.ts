/*
 * @Author: wuxz:
 * @Date: 2022-07-05 10:28:41
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-07-18 16:52:29
 * @FilePath: \test\src\extension.ts
 */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { time } from 'console';
import * as vscode from 'vscode';
import { workerData } from 'worker_threads';

//work time
var count:any = 0; 
var gid1:any = -1;

//warnning info
var WarningInfo = ["不喝电脑马上就关机", 
					"不喝老婆就跟别人跑了",
					"不喝一天都解不出bug",
					"不喝电脑马上就死机",
					"不喝今天写10个bug"];
var ResInfo = ["ok，那你电脑不关机了",
				"ok，那你老婆不跑了",
				"ok，那你秒解bug",
				"ok，那你电脑不死机了",
				"ok，那你今天都不会写bug"];
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//Date
	var config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('remind-drinking-water');
	var showtime:any = config.get('showTime');
	if(showtime === true)
	{
		vscode.window.showInformationMessage(Date());
	}
	showinfo();
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('remind.water', () => {
		vscode.window.showInformationMessage("插件启动成功");
		clearInterval(gid1);
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		showinfo();
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
function noticeInfo(par1:any, par2:any)
{
	count++;
	var Sentence =  par1 + "，你已经坐挺久了，站起来喝口水，休息会吧！";
	if(par2 === true)
	{
		Sentence = Sentence + "已经工作" + count + "小时。";
	}
	vscode.window.showInformationMessage(Sentence,'喝', '不喝').then(item=>{
		if(item === '不喝')
		{
			var NumId = Math.round(Math.random()*5);
			vscode.window.showErrorMessage(WarningInfo[NumId], '喝').then(item2=>{
				if(item2 === '喝')
				{
					return vscode.window.showInformationMessage(ResInfo[NumId]);
				}
			});
		}
		if(item === '喝')
		{	
			return vscode.window.showInformationMessage("万事大吉~");
		}
	});
}

function showinfo(inspect:any = true)
{
	var config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('remind-drinking-water');
	var remindtime:any = config.get('remindTime');
	var username = config.get('UserName');
	var showworktime = config.get('ShowWorkTime');
	//h ==> ms
	var tmp = remindtime * 3600 * 1000;
	gid1 = setInterval(noticeInfo, tmp, username, showworktime);
}

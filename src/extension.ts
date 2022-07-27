/*
 * @Author: wuxz:
 * @Date: 2022-07-05 10:28:41
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-07-27 14:34:20
 * @FilePath: \test\src\extension.ts
 */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { Console, time } from 'console';
import { config } from 'process';
import * as vscode from 'vscode';
import { workerData } from 'worker_threads';
import * as path from 'path';

//work time
var count:any = 0; 
var gid1:any = -1;
var gid2:any = -1;
var time_par:any = 1000 * 3600;
//panel auto-dispose time(s)
var panel_dispose_time = 5;
//picture path
var picture_path:string = 'panel_icon.png';
//warnning info
var warning_info = ["不喝电脑马上就关机", 
					"不喝老婆就跟别人跑了",
					"不喝一天都解不出bug",
					"不喝电脑马上就死机",
					"不喝今天写10个bug"];
var res_info = ["ok，那你电脑不关机了",
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
	var showid:any = config.get('showTime');
	var currentPanel:any = undefined;
	const onDiskPath = vscode.Uri.file(path.join(context.extensionPath, '.', picture_path));
    const pic_path_uri = onDiskPath.with({ scheme: 'vscode-resource' });
	console.log(pic_path_uri);
	if(showid === true)
	{
		vscode.window.showInformationMessage(Date());
	}
	var show_word_or_panel:any = config.get('ShowWordOrPanel');
	if(show_word_or_panel === 'word')
	{
		showinfo();
	}
	else
	{
		showpanel(currentPanel, context, pic_path_uri);
	}

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('remind.water', () => {
		var config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('remind-drinking-water');
		show_word_or_panel = config.get('ShowWordOrPanel');
		vscode.window.showInformationMessage("插件启动成功");
		clearInterval(gid1);
		clearInterval(gid2);
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		if(show_word_or_panel === 'word')
		{
			showinfo();
		}
		else
		{
			showpanel(currentPanel, context, pic_path_uri);
		}

	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
function noticeinfo(par1:any, par2:any)
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
			var numid = Math.round(Math.random()*5);
			vscode.window.showErrorMessage(warning_info[numid], '喝').then(item2=>{
				if(item2 === '喝')
				{
					return vscode.window.showInformationMessage(res_info[numid]);
				}
			});
		}
		if(item === '喝')
		{	
			return vscode.window.showInformationMessage("万事大吉~");
		}
	});
}

function showinfo()
{
	var config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('remind-drinking-water');
	var remindtime:any = config.get('remindTime');
	var username = config.get('UserName');
	var showworktime = config.get('ShowWorkTime');
	var tmp = remindtime * time_par;
	gid1 = setInterval(noticeinfo, tmp, username, showworktime);
}

function showpanel(currentPanel:any, context: vscode.ExtensionContext, pic_path: vscode.Uri)
{
	var config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('remind-drinking-water');
	var remindtime:any = config.get('remindTime');
	var username = config.get('UserName');
	var tmp = remindtime * time_par;
	gid2 = setInterval(createpanel, tmp, currentPanel,  context, username, pic_path);
}
function createpanel(currentPanel:any,  context: vscode.ExtensionContext, username:any, pic_path:vscode.Uri)
{	
	count++;
	const columnToShowIn = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
	if(currentPanel)
	{
		currentPanel.reveal(columnToShowIn);
	}
	else
	{
		currentPanel = vscode.window.createWebviewPanel
		(
			'remind-water',
			'remind-water',
			vscode.ViewColumn.One,
			{}
		);
		currentPanel.webview.html = getWebviewContent(pic_path, username);
		const timeout = setTimeout(()=>currentPanel.dispose(), panel_dispose_time * 1000);
		currentPanel.onDidDispose
		(
			()=>
			{
				clearTimeout(timeout);
				currentPanel = undefined;
			},
			null,
			context.subscriptions
		);
	}
}

function getWebviewContent(pic_path:vscode.Uri, name:any):string
{
	return`
	<!DOCTYPE html>

	<html lang = "en">
		<head>
			<meta charset="URF-8">
			<meta name="viewport" content = "width=device-width, initial-scale = 1.0">
			<title>wuxz</title>
			<style>
				html, body{
					padding:0px;
					height:100vh;
					position:relative;
					margin:0;
					padding:0;
					overflow:hidden;
				}
				#yoyo{
					position:absolute;
					bottom:50px;
					right:-90px;
					opacity:1;
				}
				#yoyo:hover{
					opacity:0;
				}
				#content{
					position:absolute;
					bottom:260px;
					right:0px;
					opacity:1;
					font-family: SimSun,"Times New Roman",Serif;
					font-weight: bold;
					color:orange;
				}
				#content:hover{
					opacity:0;
				}
			</style>
		</head>
		<body>
			<div id="content">${name}，该喝水啦！</div>
			<img id="yoyo" src="${pic_path}" width="200" />
		</body>
	</html>
	`;
}

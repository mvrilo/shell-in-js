/*
shell-in-js, unix-like shell built in javascript functions
Copyright (C) 2010, Murilo Santana

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

(function(){

var document = window.document,
echo = document.getElementById('echo'),
about = document.getElementById('about'),
field = document.getElementById('i');

function fval(f){
	echo.innerHTML += '>:' + field.value + '<br />' + f + '<br />';
	field.value = '';
}

var sh = {
	version : '1.0b',
	author : 'Murilo Santana',
	about : "shell-in-js was first intended to be a simple calculator app in command line, similar to unix' /usr/bin/bc from which came the inspiration at first place. After I got started with the project I started to study Goosh which was also the other major inspiration at the begining, but Goosh didn't give me what I needed, so to speak. shell-in-js is written via literal notation which gets easier to correct bugs and create extensions.",
	init : function(){
		field.focus();
		
		if (window.location.href.indexOf('?c'||'&c') !== -1){
			return sh.cmd.clear.run();
		}

		if (document.addEventListener) {
			document.addEventListener('click',sh.init,true);
			document.addEventListener('keydown',sh.key,true);
		}
		else {
			document.attachEvent('onclick',sh.init);
			field.attachEvent('onkeydown',sh.key);
		}
		return true;
	},
	args : function(){
		var k,
		regpow = /^([0-9]+)\^([0-9]+)$/;

		if (field.value.length !== 0){
			if (field.value.match(/^([\-]?[0-9]+[\-|?\-|\+|?\+|\/|\*|\%]*[0-9]*)*$/)){
				fval(eval(field.value));
			}
			else if (field.value.match(regpow)){
				fval(eval(field.value.replace(regpow,'Math.pow($1,$2)')));
			}
			else {
				for (k in sh.cmd){
					if (field.value == k || field.value == sh.cmd[k].alias){
						return sh.cmd[k].run();
					}
					else if (field.value == k + ' info'){
						return fval(sh.cmd[k].info);
					}
					else if (field.value == k + ' author'){
						return fval(sh.cmd[k].author);
					}
				}
			}
		}
		else {
			echo.innerHTML += '<br />';
			field.value = '';
		}
		return true;
	},
//	history : [],
	key : function(e){
		var evt = e.which || e.keyCode;
		if (evt === 13){
//			sh.history.push(field.value);
			return sh.args();
		}
		//38up:40down
		return true;
	},
	cmd : {
		example : {
			alias : "example's alias",
			author : "example's author",
			info : "example's info",
			run : function(){
				fval("example's");
			}
		},
		version : {
			alias : 'ver',
			info : "shell's version.",
			run : function(){
				fval(sh.version);
			}
		},
		author : {
			info : "about the developer",
			alias : '',
			run : function(){
				fval('<a href="mailto:mvrilo@gmail.com?subject=shell-in-js">'+sh.author+'</a>');
			}
		},
		about : {
			info : "about the shell",
			alias : '',
			run : function(){
				fval(sh.about);
			}
		},
		clear : {
			info : 'clear the shell screen',
			alias : '',
			run : function(){
				about.style.display = 'none';
				echo.innerHTML = '';
				field.value = '';
			}
		},
		reset : {
			info : 'reset the shell',
			alias : '',
			run : function(){
				about.style.display = 'block';
				echo.innerHTML = '';
				field.value = '';
			}
		},
		quit : {
			alias : 'exit',
			info : 'exit the shell',
			run : function(){
				window.close();
			}
		},
		man : {
			alias : 'help',
			info : 'list of commands available',
			run : function(){ 
				echo.innerHTML += '>:' + field.value + '<br />';

				var i;
				for (i in sh.cmd){
					if (i != 'undefined'){
						echo.innerHTML += i + ' - ' + sh.cmd[i].info + '<br />';
					}
				}
				field.value = '';
			}
		},
		alias : {
			alias : 'aliases',
			info : 'commands alias',
			run : function(){
				echo.innerHTML += '>:' + field.value + '<br />';
				
				var i;
				for (i in sh.cmd){
					if (sh.cmd[i].alias != 'undefined'){
						echo.innerHTML += i + ' - ' + sh.cmd[i].alias + '<br />';
					}
				}
				field.value = '';
			}
		},
		load : {
			info : 'load other scripts (extension for commands, for example)',
			alias : '',
			run : function(){
				/**/
			}
		},
		refresh : {
			info : 'refresh the page',
			alias : 'reload',
			run : function(){
				window.location.reload();
			}
		},
		screen : {
			info : 'display the screen resolution',
			alias : 'screenresolution',
			run : function(){
				fval(window.screen.availWidth + ' x ' + window.screen.availHeight);
			}
		},
		math : {
			info : 'about calculations in shell',
			alias : 'calc',
			run : function(){
				fval("to do Math in this shell just type in the numbers and operators without prefix, e.g. '3+3'");
			}
		}
	}
};
window.onload = sh.init;
})();

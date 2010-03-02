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
		regpow = /^([\d]+)\^([\d]+)$/;
		if (field.value.length !== 0){
			if (field.value.match(/^([\-]?[\d]+(\.[\d]+)?[\-|?\-|\+|?\+|\/|\*|\%]*[\d]*(\.[\d]+)?)*$/)){
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
/*						if (sh.cmd[k].author == 'undefined'){
							return author.run();
						}
						else{*/
							return fval(sh.cmd[k].author);
//						}
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
	history : [''],
	key : function(e){
		var evt = e.which || e.keyCode;
		if (evt === 13){
			sh.history.unshift(field.value);
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
				sh.history.length = 0;
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
					if (sh.cmd[i].info != 'undefined'){
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
		refresh : {
			info : 'reload the page',
			alias : 'reload',
			run : function(){
				window.location.reload();
			}
		},
		screen : {
			info : 'display the screen resolution',
			alias : 'resolution',
			run : function(){
				fval(window.screen.availWidth + ' x ' + window.screen.availHeight);
			}
		},
		history : {
			info : 'history list of commands',
			alias : 'hist',
			run : function(){
				sh.history.pop();
				sh.history.reverse();
				echo.innerHTML += '>:' + field.value + '<br />' + sh.history.join('<br />') + '<br />';
				field.value = '';
			}
		},
		math : {
			info : 'about calculations in shell',
			alias : 'calc',
			run : function(){
				fval("to use the shell as a calculator just type in the numbers and operators without any prefix or suffix, e.g. '3+3','4.3/777', et cetera");
			}
		}
	}
};
window.onload = sh.init;
})();

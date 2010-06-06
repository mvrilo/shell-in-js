/*
 * shell-in-js, unix-like shell built in javascript functions
 * Copyright © 2010, Murilo Santana <mvrilo@gmail.com>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

(function(){
	shell = {
		init : function(){
			field.focus();
			field.setAttribute('autocomplete','off');

			var a = document.getElementsByTagName('a');

			for (var i = 0; i<a.length; i++){
				a[i].setAttribute('target','_blank');
			}

			if (window.location.href.indexOf('?c') !== -1){
				shell.cmd.clear.run();
			}
		},
		exec : function(){
			if (field.value.length !== 0){
				var maths = /^([\-]?[\d]+(\.[\d]+)?[\-|?\-|\+|?\+|\/|\*|\%]*[\d]*(\.[\d]+)?)*$/,
				pows = /^([\d]+)\^([\d]+)$/;
				if (field.value.match(maths)){
					printf(eval(field.value)); // eval is still evil
				}
				else if (field.value.match(/^([\d]+)\^([\d]+)$/)){
					printf(field.value.replace(pows, function(a,b,c){
						Math.pow(b,c);
					}));
				}
				else {
					var reg = /^([a-z0-9\-\._]+)(\s([a-z0-9\-\._]+))?$/i,
					one = field.value.replace(reg,'$1'),
					sec = field.value.replace(reg,'$3');
					if (field.value.match(reg)){
						if (one in shell.cmd){
							if (sec.length === 0){
								shell.cmd[one].run();
							}
							else if (sec === 'info'){
								printf(shell.cmd[one].info);
							}
							else {
								if (shell.cmd[one].run.length === 0){
									printf(field.value);
								}
								else {
									shell.cmd[one].run(sec);
								}
							}
						}
						else {
							printf(field.value);
						}
					}
					else {
						printf(field.value);
					}
				}
			}
			else {
				echo.innerHTML += '>:' + field.value + '<br />';
				field.value = '';
			}
		},
		history : [''],
		key : function(e){
			var evt = e.which || e.keyCode;
			if (evt === 13){
				shell.history.unshift(field.value);
				shell.exec();
			}
		},
		cmd : {
			example : {
				info : "example's info",
				run : function(){
					printf("example's");
				}
			},
			author : {
				info : "about the developer",
				run : function(){
					printf("<a href='mailto:mvrilo@gmail.com?subject=shell-in-js'>Murilo Santana</a>");
				}
			},
			clear : {
				info : 'clear the shell screen',
				run : function(){
					about.style.display = 'none';
					echo.innerHTML = '';
					field.value = '';
				}
			},
			reset : {
				info : 'reset the shell',
				run : function(){
					shell.history = [''];
					about.style.display = 'block';
					echo.innerHTML = '';
					field.value = '';
				}
			},
			quit : {
				info : 'exit the shell',
				run : function(){
					window.self.close();
				}
			},
			man : {
				info : 'list of commands available',
				run : function(){ 
					echo.innerHTML += '>:' + field.value + '<br />';
					for (var i in shell.cmd){
						if (shell.cmd[i].info !== 'undefined'){
							echo.innerHTML += i + ' - ' + shell.cmd[i].info + '<br />';
						}
					}
					field.value = '';
				}
			},
			reload : {
				info : 'reload the page',
				run : function(){
					window.location.reload();
				}
			},
			screen : {
				info : 'display the screen resolution',
				run : function(){
					printf(window.screen.availWidth + ' x ' + window.screen.availHeight);
				}
			},
			history : {
				info : 'history list of commands',
				run : function(){
					shell.history.reverse();
					echo.innerHTML += '>:' + field.value + '<br />' + shell.history.join('<br />') + '<br />';
					field.value = '';
				}
			},
			math : {
				info : 'about calculations in shell',
				run : function(){
					printf("to use the shell as a calculator just type in the numbers and operators <br />without any prefix or suffix, e.g. '3+3','4.3/777', et cetera. for math functions type 'man' to see them.");
				}
			},
			pi : {
				info : 'returns the value of pi',
				run : function(){
					printf(Math.PI);
				}
			},
			random : {
				info : "returns a random number between 0 and X",
				run : function(x){
					if (arguments.length === 0){
						printf("error: missing the highest number in argument");
					}
					else {
						if (/[^\d]/g.test(x)){
							printf("error: not number");
						}
						else {
							printf(Math.round(Math.random()*x));
						}
					}
				}
			},
			sqrt : {
				info : 'returns the value of square root',
				run : function(x){
					if (arguments.length === 0){
						printf("error: missing the number in argument");
					}
					else {
						if (/[^\d\.]/g.test(x)){
							printf("error: not number");
						}
						else {
							printf(Math.sqrt(x));
						}
					}
				}
			}
		}
	};
	
	var echo = document.getElementById('echo'),
	about = document.getElementById('about'),
	form = document.getElementById('f'),
	field = document.getElementById('i'),
	printf = function(f){
		echo.innerHTML += '>:' + field.value + '<br />' + f + '<br />';
		field.value = '';
	},
	formsubmit = function(e){
		e.preventDefault();
		e.stopPropagation();
		return false;
	};

	if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', shell.init, false);
		document.addEventListener('click', shell.init, true);
		document.addEventListener('keydown',shell.key,true);
		form.addEventListener('submit', formsubmit, true);
	}
	else {
		document.attachEvent('onload', shell.init);
		document.attachEvent('onclick', shell.init);
		field.attachEvent('onkeydown', shell.key);
		form.attachEvent('onsubmit', formsubmit);
	}
})();

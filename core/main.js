window.onload = function(){

	main();
}

main = function(){


	console.log("Emperor.js");


	interpreter = new Interpreter();



		interpreter.tokenise(interpreter.testSyntax["OBS1"]);

}
Interpreter = function(){

	this.testSyntax = {
		
		IF1: "if((x>5)&&(x<10)){x++;continue;}else if(x<5){x++;continue;}else if(x==10){x++;}else{console.log(x);}",
		IF2: "if((x>5)&&(x<10)){x++;continue;}else{console.log(x);}",
		IF3: "if((x>5)&&(x<10)){x++;continue;}else if(x<5){x++;continue;}else if(x==10){x++;}",
		CASE1: "switch(n){case 5+5 : continue; break; case 1+1 : break; case 6 : continue; default : continue; return !true;}",
		CASE2: "switch(n){default : continue;}",
		ARRAY1: "b = [];",
		ARRAY2: "b = [a];",
		ARRAY3: "b = [a, 5, true, false, (a), (5), (true), (false), fun(), (fun())];",
		ARRAY4: "b = [a, 4, 2];",
		FOR1: "for(x in array){return 5;}",
		FOR2: "for(x=0; x<5; x++){return 5;}",
		OBS1: "a is b + c;",
		OBS2: "a++;",
		OBS3: "a = max(b,c);",
		INDENT: "if(a){continue; break; continue; x = 5; proc x(a, b, c){continue; break; if(a){return 8;}};}",
		DEFAULT: "default : continue; return !true;",
		PROC1: "proc agent(name1, name2, name3){if(name1==5){console.log(\"5\");}else{continue;}}",
		PROC2: "proc agent(name1, name2, name3){if(name1==5){console.log(5);}else{console.log(\"notfive\");}}",
		FUNC1: "func max(name1, name2, name3, name4){if(name1>name2){return name1;}else{return name2;}}",
		FUNC2: "func soddy(name1, name2){if(name1>name2){return x;}else{return y;}}",
		OBS4: "tech is max(arg1, arg2);",
		COND1: "tech is a.b == 3 ? 1 : 4;",
		DOTORDER1: "z = x.y()*5;",
		DOTORDER2: "z = x.y(y.z[3]);",
		DOTORDER3P5: "z = a.b.c;",
		DOTORDER3: "z = x.y[a.b.c(5.4)];",
		DOTORDER4: "z = z[1]+z[2]*a.b(z[3]);",
		DOTORDER5: "z = a.b.c[a*4.5+d.e(5.7)];",
	}

	var Token = window.token = function(value, type){

		this.value = value;
		this.type = type;

		return this;
	}
		Token.PrimitiveTokenError = function(badCode){

			this.message = "A primitive token can not be formed with the following code : '"+badCode+"'";
			this.name = "PrimitiveTokenError";

			return this;
		}
	
		Token.primitiveTokenType = {

			_whitespace : 		{regex : /^( )*$/, 							},
			_plus : 			{regex : /^(\+)$/,							isOperator: true},
			_minus : 			{regex : /^(\-)$/,							isOperator: true},
			_multiply : 		{regex : /^(\*)$/,							isOperator: true},
			_divide : 			{regex : /^(\/)$/,							isOperator: true},
			_mod : 				{regex : /^(\%)$/,							isOperator: true},
			_and : 				{regex : /^((\&\&)|(\&))$/,					isOperator: true},
			_or : 				{regex : /^((\|\|)|(\|))$/,					isOperator: true},
			_equals : 			{regex : /^(==)$/,							isOperator: true},
			_notEquals : 		{regex : /^(\!=)$/,							isOperator: true},
			_not : 				{regex : /^(\!)$/,							isOperator: true},
			_lessThanEq : 		{regex : /^(<=)$/,							isOperator: true},
			_lessThan : 		{regex : /^(<)$/,							isOperator: true},
			_moreThanEq : 		{regex : /^(>=)$/,							isOperator: true},
			_moreThan : 		{regex : /^(>)$/,							isOperator: true},
			_assign : 			{regex : /^(=)$/,							},
			_increment : 		{regex : /^(\+\+)$/,						},
			_decrement : 		{regex : /^(\-\-)$/,						},
			_comma : 			{regex : /^(,)$/,							},
			_dot : 				{regex : /^(\.)$/,							},
			_hash : 			{regex : /^(\#)$/,							},
			_semicolon : 		{regex : /^(;)$/,							},
			_colon : 			{regex : /^(:)$/,							qmarkOrColon: true},
			_question : 		{regex : /^(\\?)$/,							qmarkOrColon: true},
			_openBracket : 		{regex : /^(\()$/,							},
			_closeBracket : 	{regex : /^(\))$/,							},
			_openBrace : 		{regex : /^({)$/,							},
			_closeBrace : 		{regex : /^(})$/,							},
			_openArray : 		{regex : /^(\[)$/,							},
			_closeArray : 		{regex : /^(\])$/,							},
			_if : 				{regex : /^(if)$/,							},
			_else : 			{regex : /^(else)$/,						},
			_for : 				{regex : /^(for)$/,							},
			_while : 			{regex : /^(while)$/,						},
			_in : 				{regex : /^(in)$/,							},
			_break : 			{regex : /^(break)$/,						},
			_switch : 			{regex : /^(switch)$/,						},
			_case : 			{regex : /^(case)$/,						},
			_default : 			{regex : /^(default)$/,						},
			_continue : 		{regex : /^(continue)$/,					},
			_return : 			{regex : /^(return)$/,						},
			_is : 				{regex : /^(is)$/,							},
			_proc : 			{regex : /^(proc)$/,						},
			_func : 			{regex : /^(func)$/,						},
			_name : 			{regex : /^((([a-z])|([A-Z])|(_))+((([a-z])|([A-Z])|(_)|([0-9])))*)$/, isExpression: true, qualifiesAsName : true,},
			_true : 			{regex : /^(true)$/,						isExpression: true},
			_false : 			{regex : /^(false)$/,						isExpression: true},
			_constant : 		{regex : /^(([0-9])+)$/,					isExpression: true},
			_string : 			{regex : /^(\"(.*)\")$/,					isExpression: true},
			_comment : 			{regex : /^(\/\/.*)$/,						isAllowedInScript: 	true},
		}

		Token.reductionTokenType = {

			_obsIncDef : 				{rule : [Token.M.qualifiesAsName, "_increment", "_semicolon"],									isAllowedInScript: 	true, isObsAssignment: true,},
			_obsDecDef : 				{rule : [Token.M.qualifiesAsName, "_decrement", "_semicolon"],									isAllowedInScript: 	true, isObsAssignment: true,},
			_obsAssign : 				{rule : [Token.M.qualifiesAsName, "_assign", Token.M.isExpression, "_semicolon"],				isAllowedInScript: 	true, isObsAssignment: true,},
			_obsDefine : 				{rule : [Token.M.qualifiesAsName, "_is", Token.M.isExpression, "_semicolon"],					isAllowedInScript: 	true,},
			_funcDef : 					{rule : ["_func", "_functionPotDefCall", Token.M.isBraced],										isAllowedInScript: 	true,},
			_procDef : 					{rule : ["_proc", "_functionPotDefCall", Token.M.isBraced],										isAllowedInScript: 	true,},
			_compoundName : 			{rule : [Token.M.qualifiesAsName, "_dot", Token.M.qualifiesAsName],								isExpression: true, qualifiesAsName : true,},
			_compoundNumber : 			{rule : ["_constant", "_dot", "_constant"],														isExpression: true,},
			_emptyArray : 				{rule : ["_openArray", "_closeArray"],															isExpression: true, isArray: true,},
			_singleArray : 				{rule : ["_openArray", Token.M.isExpression, "_closeArray"],									isExpression: true, isArray: true,},
			_multipleArray : 			{rule : ["_openArray", Token.M.isCommaSeparated, "_closeArray"],								isExpression: true, isArray: true,},
			_indexAccess : 				{rule : [Token.M.qualifiesAsName, Token.M.isArray],												isExpression: true,},
			_return : 					{rule : ["_return", "_semicolon"],																isAllowedInScript: true,},
			_returnExp : 				{rule : ["_return", Token.M.isExpression, "_semicolon"],										isAllowedInScript: true,},
			_continueStatement : 		{rule : ["_continue", "_semicolon"],															isAllowedInScript: true,},
			_breakStatement : 			{rule : ["_break", "semicolon"],																isAllowedInScript: true,},
			_functionPotDefCall : 		{rule : [Token.M.qualifiesAsName, Token.M.isBracketedNameS],									isExpression: true, isFunctionCall : true,},
			_functionExpCall : 			{rule : [Token.M.qualifiesAsName, Token.M.isBracketedExpressionS],								isExpression: true, isFunctionCall : true,},
			_functionCallStatement : 	{rule : [Token.M.isFunctionCall, "_semicolon"],													isExpression: true, isAllowedInScript: true,}, //FunctionDefCall / FunctionExpCall?
			_emptyBraceBody : 			{rule : ["_openBrace", "_closeBrace"],															isBraced : true, isAllowedInScript: true,},
			_embracedScript : 			{rule : ["_openBrace", Token.M.isAllowedInScript, "_closeBrace"],								isBraced : true, isAllowedInScript: true,},
			_plusOp : 					{rule : [Token.M.isExpression, "_plus", Token.M.isExpression],									isExpression: true, isBinaryOp : true,},
			_minusOp : 					{rule : [Token.M.isExpression, "_minus", Token.M.isExpression],									isExpression: true, isBinaryOp : true,},
			_multiplyOp : 				{rule : [Token.M.isExpression, "_multiply", Token.M.isExpression],								isExpression: true, isBinaryOp : true,},
			_divOp : 					{rule : [Token.M.isExpression, "_divide", Token.M.isExpression],								isExpression: true, isBinaryOp : true,},
			_modOp : 					{rule : [Token.M.isExpression, "_mod", Token.M.isExpression],									isExpression: true, isBinaryOp : true,},
			_andOp : 					{rule : [Token.M.isExpression, "_and", Token.M.isExpression],									isExpression: true, isBinaryOp : true,},
			_orOp : 					{rule : [Token.M.isExpression, "_or", Token.M.isExpression],									isExpression: true, isBinaryOp : true,},
			_eqOp : 					{rule : [Token.M.isExpression, "_equals", Token.M.isExpression],								isExpression: true, isBinaryOp : true,},
			_notEqOp : 					{rule : [Token.M.isExpression, "_notEquals", Token.M.isExpression],								isExpression: true, isBinaryOp : true,},
			_lessThanOp : 				{rule : [Token.M.isExpression, "_lessThan", Token.M.isExpression],								isExpression: true, isBinaryOp : true,},
			_lessThanEqOp : 			{rule : [Token.M.isExpression, "_lessThanEq", Token.M.isExpression],							isExpression: true, isBinaryOp : true,},
			_moreThanOp : 				{rule : [Token.M.isExpression, "_moreThan", Token.M.isExpression],								isExpression: true, isBinaryOp : true,},
			_moreThanEqOp : 			{rule : [Token.M.isExpression, "_moreThanEq", Token.M.isExpression],							isExpression: true, isBinaryOp : true,},
			_negativeOp : 				{rule : ["_minus", Token.M.isExpression],														isExpression: true, isUniaryOp : true,},
			_notOp : 					{rule : ["_not", Token.M.isExpression],															isExpression: true, isUniaryOp : true,},
			_incompleteConDef : 		{rule : [Token.M.isExpression, "_question", Token.M.isExpression],								},
			_completeConDefHead : 		{rule : ["_incompleteConDef", "_colon", Token.M.isCompleteConDef],								isExpression: true, isCompleteConDef: true,},
			_completeConDefTail : 		{rule : ["_incompleteConDef", "_colon", Token.M.isExpression],									isExpression: true, isCompleteConDef: true,},
			_elseIf : 					{rule : ["_else", "_if"],																		},
			_ifBranch : 				{rule : ["_if", Token.M.isExpression, Token.M.isBraced],										isAllowedInScript: true, isStartIf : true,}, // Trying something new here, removed the need for brackets on if branch condition
			_elseIfBranch : 			{rule : ["_elseIf", Token.M.isExpression, Token.M.isBraced],									},
			_elseBranch : 				{rule : ["_else", Token.M.isBraced],															},
			_startIfConstruct : 		{rule : [Token.M.isStartIf, "_elseIfBranch"],													isAllowedInScript: true, isStartIf : true,},
			_completeIfConstruct : 		{rule : [Token.M.isStartIf, "_elseBranch"],														isAllowedInScript: true,},
			_forNameInName : 			{rule : ["_for", "_openBracket", Token.M.qualifiesAsName, "_in", Token.M.qualifiesAsName, "_closeBracket", Token.M.isBraced], isAllowedInScript: true,},
			_forInc : 					{rule : ["_for", "_openBracket", Token.M.isObsAssignment, Token.M.isExpression, "_semicolon", Token.M.qualifiesAsName, "_increment", "_closeBracket", Token.M.isBraced], isAllowedInScript: true,},
			_forDec : 					{rule : ["_for", "_openBracket", Token.M.isObsAssignment, Token.M.isExpression, "_semicolon", Token.M.qualifiesAsName, "_decrement", "_closeBracket", Token.M.isBraced], isAllowedInScript: true,},
			_forAssign : 				{rule : ["_for", "_openBracket", Token.M.isObsAssignment, Token.M.isExpression, "_semicolon", Token.M.qualifiesAsName, "_assign", Token.M.isExpression, "_closeBracket", Token.M.isBraced], isAllowedInScript: true,},
			_whileLoop : 				{rule : ["_while", "_brExp", Token.M.isBraced],													isAllowedInScript: true,},
			_caseStatement : 			{rule : ["_case", Token.M.isExpression, "_colon", Token.M.isAllowedInScript],					qualifiesAsInnerSwitch:	true,},
			_defaultStatement : 		{rule : ["_default", "_colon", Token.M.isAllowedInScript],										qualifiesAsInnerSwitch:	true,},
			_multipleCaseHead : 		{rule : [Token.M.isMultipleCaseStatement, "_caseStatement"],									isAllowedInScript: true, qualifiesAsInnerSwitch: true, isMultipleCaseStatement: true,},//multiple, single
			_multipleCaseTail : 		{rule : ["_caseStatement", "_caseStatement"],													isAllowedInScript: true, qualifiesAsInnerSwitch: true, isMultipleCaseStatement: true,},
			_completedCaseHead : 		{rule : ["_caseStatement", "_defaultStatement"],												isAllowedInScript: true, qualifiesAsInnerSwitch: true,}, //multiple, default
			_completedCaseTail : 		{rule : [Token.M.isMultipleCaseStatement, _defaultStatement],									isAllowedInScript: true, qualifiesAsInnerSwitch: true,},
			_switchConstruct : 			{rule : ["_switch", "_brName", "_openBrace", Token.M.qualifiesAsInnerSwitch, "_closeBrace"],	isAllowedInScript: true,},
			_nameCommaName : 			{rule : [Token.M.qualifiesAsName, "_comma", Token.M.qualifiesAsName],							isCommaSeparated: true, isCommaSeparatedNames: true,},
			_csnCommaName : 			{rule : [Token.M.isCommaSeparatedNames, "_comma", Token.M.qualifiesAsName],						isCommaSeparated: true, isCommaSeparatedNames: true,},
			_expCommaExp : 				{rule : [Token.M.isExpression, "_comma", Token.M.isExpression],									isCommaSeparated: true,},
			_cseCommaExp : 				{rule : [Token.M.isCommaSeparated, "_comma", Token.M.isExpression],								isCommaSeparated: true,},
			_brCsn : 					{rule : ["_openBracket", Token.M.isCommaSeparatedNames, "_closeBracket"],						isBracketedNameS: true, isBracketedExpressionS: true,},
			_brCse : 					{rule : ["_openBracket", Token.M.isCommaSeparated, "_closeBracket"],							isBracketedExpressionS: true,},
			_brName : 					{rule : ["_openBracket", Token.M.qualifiesAsName, "_closeBracket"],								isExpression: true, isBracketedNameS: true, isBracketedExpressionS: true,},
			_brExp : 					{rule : ["_openBracket", Token.M.isExpression, "_closeBracket"],								isExpression: true, isBracketedExpressionS: true,},
			_brEmpty : 					{rule : ["_openBracket", "_closeBracket"],														isBracketedNameS: true,},
			_length : 					{rule : ["_hash", Token.M.isExpression],														isExpression: true,},
			_multipleScript : 			{rule : [Token.M.isAllowedInScript, Token.M.isAllowedInScript],									isAllowedInScript: true,},
//UP TO HERE
			_redundantSemi : 			{rule : [],																						isAllowedInScript: true,},
		}

		Token.matchesProperties = Token.M = {

			isExpression : function(token){ return Token.primitiveTokenType[token.type].isExpression || Token.reductionTokenType[token.type].isExpression; }
			isFunctionCall : function(token){ return Token.primitiveTokenType[token.type].isFunctionCall || Token.reductionTokenType[token.type].isFunctionCall; }
			isObsAssignment : function(token){ return Token.primitiveTokenType[token.type].isObsAssignment || Token.reductionTokenType[token.type].isObsAssignment; }
			isBraced : function(token){ return Token.primitiveTokenType[token.type].isBraced || Token.reductionTokenType[token.type].isBraced; }
			isArray : function(token){ return Token.primitiveTokenType[token.type].isArray || Token.reductionTokenType[token.type].isArray; }
			isAllowedInScript : function(token){ return Token.primitiveTokenType[token.type].isAllowedInScript || Token.reductionTokenType[token.type].isAllowedInScript; }
			isCommaSeparated : function(token){ return Token.primitiveTokenType[token.type].isCommaSeparated || Token.reductionTokenType[token.type].isCommaSeparated; }
			isCommaSeparatedNames : function(token){ return Token.primitiveTokenType[token.type].isCommaSeparatedNames || Token.reductionTokenType[token.type].isCommaSeparatedNames; }
			isBracketedNameS : function(token){ return Token.primitiveTokenType[token.type].isBracketedNameS || Token.reductionTokenType[token.type].isBracketedNameS; }
			isBracketedExpressionS : function(token){ return Token.primitiveTokenType[token.type].isBracketedExpressionS || Token.reductionTokenType[token.type].isBracketedExpressionS; }
			qualifiesAsName : function(token){ return Token.primitiveTokenType[token.type].qualifiesAsName || Token.reductionTokenType[token.type].qualifiesAsName; }
			qualifiesAsInnerSwitch : function(token){ return Token.primitiveTokenType[token.type].qualifiesAsInnerSwitch || Token.reductionTokenType[token.type].qualifiesAsInnerSwitch; }
			isOperator : function(token){ return Token.primitiveTokenType[token.type].isOperator || Token.reductionTokenType[token.type].isOperator; }
			isStartIf : function(token){ return Token.primitiveTokenType[token.type].isStartIf || Token.reductionTokenType[token.type].isStartIf; }
			qmarkOrColon : function(token){ return Token.primitiveTokenType[token.type].qmarkOrColon || Token.reductionTokenType[token.type].qmarkOrColon; }
			isCompleteConDef : function(token){ return Token.primitiveTokenType[token.type].isCompleteConDef || Token.reductionTokenType[token.type].isCompleteConDef; }
		}


	this.tokenise = function(input){

		var tokens = [];

		input = input.replace(/\t/g, " ");	//Remove tabs
		var lines = input.split(/\/\/.*(\r\n|\n|\r)/g); //Split into lines

		const canItMakeToken = function(word){

			for(var i in Token.primitiveTokenType){

				if(Token.primitiveTokenType[i].regex.test(word)){

					return new Token(word, i);
				}
			}

			return false;
		}

		for (var l in lines){

			var letters = lines[l].split("");
			var build = [];
			var flag = false;

			while(letters.length != 0){

				build.push(letters.shift());
				var token = canItMakeToken(build.join(""))

				if(flag){

					if(!token){
						letters.unshift(build.pop());
						tokens.push(canItMakeToken(build.join("")));
						flag = false;
						build = [];
					}
				}
				else{
					console.log(token)
					if(token){
						flag = true;
					}
				}

				if(letters.length == 0){

					if(token){
						tokens.push(token);
					}
					else{

						throw new Token.PrimitiveTokenError(build.join(""));
					}
				}
			}
		}

		return tokens;
	}

	this.Reduce = function(tokens){

		var stack = [];
		var reduced = false;

		while((tokens.length != 0) || (reduced)){

			if(!reduced){

				stack.push(tokens.shift());
			}

			reduced = false;

			//DO PRELIM REDUCTION HERE

			//Major Reduction
			for(var i in Token.reductionTokenType){
			
				//Store the token type temporarilly
				var tokenType = i;
//HAPPY UP TO HERE			
				//Iterate through the rules in the given order
				for(var j in tokenType.reductionRules){
				
					var rule = tokenType.reductionRules[j];
					var ruleMatches = false;
					
					//As long as the stack is longer than or equal to the rule
					if(stack.length >= rule.length){
					
						//Store a backward count for matching up with the conditions 'k'
						var backCount = stack.length;
					
						//Go through each condition in the rule backwards to see if it matches
						for(var k = rule.length-1; k>=0; k--){
						
							//Decrement the backCount
							backCount--;
						
							var condition = rule[k];
							
							//For function conditions
							if(typeof(condition) == "function"){
								if(! (condition(stack[backCount].type))){
								
									//A single condition has been broken
									break;
								}
								else if(k == 0){
									//The entire rule matches.
									ruleMatches = true;
								}
								else{
									//Check the next condition
									continue;
								}
							}
							//For type conditions
							else{
								if(! (condition == stack[backCount].type)){
								
									//A single condition has been broken
									break;
								}
								else if(k == 0){
									//The entire rule matches.
									ruleMatches = true;
								}
								else{
									//Check the next condition
									continue;
								}
							}
							
						}
						
						//Check the flag to see if the entire rule has matched
						if(ruleMatches){
							
							//Reduce the tokens into a new
							var reducedToken = new me.Token(stack.splice(stack.length-rule.length), tokenType.type);
							
							//Push the reduced token onto the stack
							stack.push(reducedToken);
							
							//Set the flag to true
							reduced = true;
							
							break;
						}
					}
					
				}
				
				//If we have reduced, go round from the beginning
				if(reduced){
					break;
				}
			}
			if(!reduced){
				//console.log("No Reduction rules match.")
			}
		}

		return
	}

	return this;
}

try{

	module.exports = Interpreter;

}catch(error){}
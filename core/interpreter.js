Interpreter = function(){

	this.testSyntaxS = {
		
		a: "",
	}

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

		this.test = function(test){

			if(typeof test === "function"){

				return test(this);
			}
			else{

				return this.type.name === test;
			}
		}

		this.printTree = function(tab){

			if(!tab){
				tab = "";
			}

			if (this.value instanceof Array){
				for(var i=0; i<this.value.length; i++){
					this.value[i].printTree(tab+"\t")
				}
			}
			else{

				console.log(tab + this.value);
			}
		}

		return this;
	}
		Token.PrimitiveTokenError = function(badCode){

			this.message = "A primitive token can not be formed with the following code : '"+badCode+"'";
			this.name = "PrimitiveTokenError";

			return this;
		}
		Token.ReductionCountingError = function(tokens){

			this.message = "Close (bracket/brace/array) encountered without a paired open.";
			this.tokens = tokens;
			this.name = "ReductionCountingError";

			return this;
		}

		Token.matchesProperties = Token.M = {

			isOpenLevel : function(token){ 				return token.type.isOpenLevel; },
			isCloseLevel : function(token){ 			return token.type.isCloseLevel; },
			isExpression : function(token){ 			return token.type.isExpression; },
			isFunctionCall : function(token){ 			return token.type.isFunctionCall; },
			isObsAssignment : function(token){ 			return token.type.isObsAssignment; },
			isBraced : function(token){ 				return token.type.isBraced; },
			isArray : function(token){ 					return token.type.isArray; },
			isAllowedInScript : function(token){ 		return token.type.isAllowedInScript; },
			isCommaSeparated : function(token){ 		return token.type.isCommaSeparated; },
			isCommaSeparatedNames : function(token){ 	return token.type.isCommaSeparatedNames; },
			isBracketedNameS : function(token){ 		return token.type.isBracketedNameS; },
			isBracketedExpressionS : function(token){ 	return token.type.isBracketedExpressionS; },
			qualifiesAsName : function(token){ 			return token.type.qualifiesAsName; },
			qualifiesAsInnerSwitch : function(token){ 	return token.type.qualifiesAsInnerSwitch; },
			isOperator : function(token){ 				return token.type.isOperator; },
			isStartIf : function(token){ 				return token.type.isStartIf; },
			qmarkOrColon : function(token){ 			return token.type.qmarkOrColon; },
			isCompleteConDef : function(token){ 		return token.type.isCompleteConDef; },
		}
	
		Token.primitiveTokenType = Token.PTT = {

			_whitespace : 		{name : "_whitespace", 		regex : /^( )*$/, 						},
			_plus : 			{name : "_plus", 			regex : /^(\+)$/,						isOperator: true},
			_minus : 			{name : "_minus", 			regex : /^(\-)$/,						isOperator: true},
			_multiply : 		{name : "_multiply", 		regex : /^(\*)$/,						isOperator: true},
			_divide : 			{name : "_divide", 			regex : /^(\/)$/,						isOperator: true},
			_mod : 				{name : "_mod", 			regex : /^(\%)$/,						isOperator: true},
			_and : 				{name : "_and", 			regex : /^((\&\&)|(\&))$/,				isOperator: true},
			_or : 				{name : "_or", 				regex : /^((\|\|)|(\|))$/,				isOperator: true},
			_equals : 			{name : "_equals", 			regex : /^(==)$/,						isOperator: true},
			_notEquals : 		{name : "_notEquals", 		regex : /^(\!=)$/,						isOperator: true},
			_not : 				{name : "_not", 			regex : /^(\!)$/,						isOperator: true},
			_lessThanEq : 		{name : "_lessThanEq", 		regex : /^(<=)$/,						isOperator: true},
			_lessThan : 		{name : "_lessThan", 		regex : /^(<)$/,						isOperator: true},
			_moreThanEq : 		{name : "_moreThanEq", 		regex : /^(>=)$/,						isOperator: true},
			_moreThan : 		{name : "_moreThan", 		regex : /^(>)$/,						isOperator: true},
			_assign : 			{name : "_assign", 			regex : /^(=)$/,						},
			_increment : 		{name : "_increment", 		regex : /^(\+\+)$/,						},
			_decrement : 		{name : "_decrement", 		regex : /^(\-\-)$/,						},
			_comma : 			{name : "_comma", 			regex : /^(,)$/,						},
			_dot : 				{name : "_dot", 			regex : /^(\.)$/,						},
			_hash : 			{name : "_hash", 			regex : /^(\#)$/,						},
			_semicolon : 		{name : "_semicolon", 		regex : /^(;)$/,						},
			_colon : 			{name : "_colon", 			regex : /^(:)$/,						qmarkOrColon: true},
			_question : 		{name : "_question", 		regex : /^(\\?)$/,						qmarkOrColon: true},
			_openBracket : 		{name : "_openBracket", 	regex : /^(\()$/,						isOpenLevel: true},
			_closeBracket : 	{name : "_closeBracket", 	regex : /^(\))$/,						isCloseLevel: true},
			_openBrace : 		{name : "_openBrace", 		regex : /^({)$/,						isOpenLevel: true},
			_closeBrace : 		{name : "_closeBrace", 		regex : /^(})$/,						isCloseLevel: true},
			_openArray : 		{name : "_openArray", 		regex : /^(\[)$/,						isOpenLevel: true},
			_closeArray : 		{name : "_closeArray", 		regex : /^(\])$/,						isCloseLevel: true},
			_if : 				{name : "_if", 				regex : /^(if)$/,						},
			_else : 			{name : "_else", 			regex : /^(else)$/,						},
			_for : 				{name : "_for", 			regex : /^(for)$/,						},
			_while : 			{name : "_while", 			regex : /^(while)$/,					},
			_in : 				{name : "_in", 				regex : /^(in)$/,						},
			_break : 			{name : "_break", 			regex : /^(break)$/,					},
			_switch : 			{name : "_switch", 			regex : /^(switch)$/,					},
			_case : 			{name : "_case", 			regex : /^(case)$/,						},
			_default : 			{name : "_default", 		regex : /^(default)$/,					},
			_continue : 		{name : "_continue", 		regex : /^(continue)$/,					},
			_return : 			{name : "_return", 			regex : /^(return)$/,					},
			_is : 				{name : "_is", 				regex : /^(is)$/,						},
			_proc : 			{name : "_proc", 			regex : /^(proc)$/,						},
			_func : 			{name : "_func", 			regex : /^(func)$/,						},
			_name : 			{name : "_name", 			regex : /^((([a-z])|([A-Z])|(_))+((([a-z])|([A-Z])|(_)|([0-9])))*)$/, isExpression: true, qualifiesAsName : true,},
			_true : 			{name : "_true", 			regex : /^(true)$/,						isExpression: true},
			_false : 			{name : "_false", 			regex : /^(false)$/,					isExpression: true},
			_constant : 		{name : "_constant", 		regex : /^(([0-9])+)$/,					isExpression: true},
			_string : 			{name : "_string", 			regex : /^(\"(.*)\")$/,					isExpression: true},
			_comment : 			{name : "_comment", 		regex : /^(\/\/.*)$/,					isAllowedInScript: 	true},
		}

		Token.reductionTokenType = Token.RTT = {

			_compoundName : 			{name : "_compoundName", 			rule : [Token.M.qualifiesAsName, "_dot", Token.M.qualifiesAsName],								isExpression: true, qualifiesAsName : true,},
			_compoundNumber : 			{name : "_compoundNumber", 			rule : ["_constant", "_dot", "_constant"],														isExpression: true,},
			_plusOp : 					{name : "_plusOp", 					rule : [Token.M.isExpression, "_plus", Token.M.isExpression],									isExpression: true, isBinaryOp : true,},
			_minusOp : 					{name : "_minusOp", 				rule : [Token.M.isExpression, "_minus", Token.M.isExpression],									isExpression: true, isBinaryOp : true,},
			_multiplyOp : 				{name : "_multiplyOp", 				rule : [Token.M.isExpression, "_multiply", Token.M.isExpression],								isExpression: true, isBinaryOp : true,},
			_divOp : 					{name : "_divOp", 					rule : [Token.M.isExpression, "_divide", Token.M.isExpression],									isExpression: true, isBinaryOp : true,},
			_modOp : 					{name : "_modOp", 					rule : [Token.M.isExpression, "_mod", Token.M.isExpression],									isExpression: true, isBinaryOp : true,},
			_andOp : 					{name : "_andOp", 					rule : [Token.M.isExpression, "_and", Token.M.isExpression],									isExpression: true, isBinaryOp : true,},
			_orOp : 					{name : "_orOp", 					rule : [Token.M.isExpression, "_or", Token.M.isExpression],										isExpression: true, isBinaryOp : true,},
			_eqOp : 					{name : "_eqOp", 					rule : [Token.M.isExpression, "_equals", Token.M.isExpression],									isExpression: true, isBinaryOp : true,},
			_notEqOp : 					{name : "_notEqOp", 				rule : [Token.M.isExpression, "_notEquals", Token.M.isExpression],								isExpression: true, isBinaryOp : true,},
			_lessThanOp : 				{name : "_lessThanOp", 				rule : [Token.M.isExpression, "_lessThan", Token.M.isExpression],								isExpression: true, isBinaryOp : true,},
			_lessThanEqOp : 			{name : "_lessThanEqOp", 			rule : [Token.M.isExpression, "_lessThanEq", Token.M.isExpression],								isExpression: true, isBinaryOp : true,},
			_moreThanOp : 				{name : "_moreThanOp", 				rule : [Token.M.isExpression, "_moreThan", Token.M.isExpression],								isExpression: true, isBinaryOp : true,},
			_moreThanEqOp : 			{name : "_moreThanEqOp", 			rule : [Token.M.isExpression, "_moreThanEq", Token.M.isExpression],								isExpression: true, isBinaryOp : true,},
			_obsIncDef : 				{name : "_obsIncDef", 				rule : [Token.M.qualifiesAsName, "_increment", "_semicolon"],									isAllowedInScript: 	true, isObsAssignment: true,},

			_obsDecDef : 				{name : "_obsDecDef", 				rule : [Token.M.qualifiesAsName, "_decrement", "_semicolon"],									isAllowedInScript: 	true, isObsAssignment: true,},
			_obsAssign : 				{name : "_obsAssign", 				rule : [Token.M.qualifiesAsName, "_assign", Token.M.isExpression, "_semicolon"],				isAllowedInScript: 	true, isObsAssignment: true,},
			_funcDef : 					{name : "_funcDef", 				rule : ["_func", "_functionPotDefCall", Token.M.isBraced],										isAllowedInScript: 	true,},
			_procDef : 					{name : "_procDef", 				rule : ["_proc", "_functionPotDefCall", Token.M.isBraced],										isAllowedInScript: 	true,},
			_emptyArray : 				{name : "_emptyArray", 				rule : ["_openArray", "_closeArray"],															isExpression: true, isArray: true,},
			_singleArray : 				{name : "_singleArray", 			rule : ["_openArray", Token.M.isExpression, "_closeArray"],										isExpression: true, isArray: true,},
			_multipleArray : 			{name : "_multipleArray", 			rule : ["_openArray", Token.M.isCommaSeparated, "_closeArray"],									isExpression: true, isArray: true,},
			_indexAccess : 				{name : "_indexAccess", 			rule : [Token.M.qualifiesAsName, Token.M.isArray],												isExpression: true,},
			_return : 					{name : "_return", 					rule : ["_return", "_semicolon"],																isAllowedInScript: true,},
			_returnExp : 				{name : "_returnExp", 				rule : ["_return", Token.M.isExpression, "_semicolon"],											isAllowedInScript: true,},
			_continueStatement : 		{name : "_continueStatement", 		rule : ["_continue", "_semicolon"],																isAllowedInScript: true,},
			_breakStatement : 			{name : "_breakStatement", 			rule : ["_break", "semicolon"],																	isAllowedInScript: true,},
			_functionPotDefCall : 		{name : "_functionPotDefCall", 		rule : [Token.M.qualifiesAsName, Token.M.isBracketedNameS],										isExpression: true, isFunctionCall : true,},
			_functionExpCall : 			{name : "_functionExpCall", 		rule : [Token.M.qualifiesAsName, Token.M.isBracketedExpressionS],								isExpression: true, isFunctionCall : true,},
			_functionCallStatement : 	{name : "_functionCallStatement", 	rule : [Token.M.isFunctionCall, "_semicolon"],													isExpression: true, isAllowedInScript: true,}, //FunctionDefCall / FunctionExpCall?
			_emptyBraceBody : 			{name : "_emptyBraceBody", 			rule : ["_openBrace", "_closeBrace"],															isBraced : true, isAllowedInScript: true,},
			_embracedScript : 			{name : "_embracedScript", 			rule : ["_openBrace", Token.M.isAllowedInScript, "_closeBrace"],								isBraced : true, isAllowedInScript: true,},
			_obsDefine : 				{name : "_obsDefine", 				rule : [Token.M.qualifiesAsName, "_is", Token.M.isExpression, "_semicolon"],					isAllowedInScript: 	true,},
			_negativeOp : 				{name : "_negativeOp", 				rule : ["_minus", Token.M.isExpression],														isExpression: true, isUniaryOp : true,},
			_notOp : 					{name : "_notOp", 					rule : ["_not", Token.M.isExpression],															isExpression: true, isUniaryOp : true,},
			_incompleteConDef : 		{name : "_incompleteConDef", 		rule : [Token.M.isExpression, "_question", Token.M.isExpression],								},
			_completeConDefHead : 		{name : "_completeConDefHead", 		rule : ["_incompleteConDef", "_colon", Token.M.isCompleteConDef],								isExpression: true, isCompleteConDef: true,},
			_completeConDefTail : 		{name : "_completeConDefTail", 		rule : ["_incompleteConDef", "_colon", Token.M.isExpression],									isExpression: true, isCompleteConDef: true,},
			_elseIf : 					{name : "_elseIf", 					rule : ["_else", "_if"],																		},
			_ifBranch : 				{name : "_ifBranch", 				rule : ["_if", Token.M.isExpression, Token.M.isBraced],											isAllowedInScript: true, isStartIf : true,}, // Trying something new here, removed the need for brackets on if branch condition
			_elseIfBranch : 			{name : "_elseIfBranch", 			rule : ["_elseIf", Token.M.isExpression, Token.M.isBraced],										},
			_elseBranch : 				{name : "_elseBranch", 				rule : ["_else", Token.M.isBraced],																},
			_startIfConstruct : 		{name : "_startIfConstruct", 		rule : [Token.M.isStartIf, "_elseIfBranch"],													isAllowedInScript: true, isStartIf : true,},
			_completeIfConstruct : 		{name : "_completeIfConstruct", 	rule : [Token.M.isStartIf, "_elseBranch"],														isAllowedInScript: true,},
			_forNameInName : 			{name : "_forNameInName", 			rule : ["_for", "_openBracket", Token.M.qualifiesAsName, "_in", Token.M.qualifiesAsName, "_closeBracket", Token.M.isBraced], 														isAllowedInScript: true,},
			_forInc : 					{name : "_forInc", 					rule : ["_for", "_openBracket", Token.M.isObsAssignment, Token.M.isExpression, "_semicolon", Token.M.qualifiesAsName, "_increment", "_closeBracket", Token.M.isBraced], 					isAllowedInScript: true,},
			_forDec : 					{name : "_forDec", 					rule : ["_for", "_openBracket", Token.M.isObsAssignment, Token.M.isExpression, "_semicolon", Token.M.qualifiesAsName, "_decrement", "_closeBracket", Token.M.isBraced], 					isAllowedInScript: true,},
			_forAssign : 				{name : "_forAssign", 				rule : ["_for", "_openBracket", Token.M.isObsAssignment, Token.M.isExpression, "_semicolon", Token.M.qualifiesAsName, "_assign", Token.M.isExpression, "_closeBracket", Token.M.isBraced], isAllowedInScript: true,},
			_whileLoop : 				{name : "_whileLoop", 				rule : ["_while", "_brExp", Token.M.isBraced],													isAllowedInScript: true,},
			_caseStatement : 			{name : "_caseStatement", 			rule : ["_case", Token.M.isExpression, "_colon", Token.M.isAllowedInScript],					qualifiesAsInnerSwitch:	true,},
			_defaultStatement : 		{name : "_defaultStatement", 		rule : ["_default", "_colon", Token.M.isAllowedInScript],										qualifiesAsInnerSwitch:	true,},
			_multipleCaseHead : 		{name : "_multipleCaseHead", 		rule : [Token.M.isMultipleCaseStatement, "_caseStatement"],										isAllowedInScript: true, qualifiesAsInnerSwitch: true, isMultipleCaseStatement: true,},//multiple, single
			_multipleCaseTail : 		{name : "_multipleCaseTail", 		rule : ["_caseStatement", "_caseStatement"],													isAllowedInScript: true, qualifiesAsInnerSwitch: true, isMultipleCaseStatement: true,},
			_completedCaseHead : 		{name : "_completedCaseHead", 		rule : ["_caseStatement", "_defaultStatement"],													isAllowedInScript: true, qualifiesAsInnerSwitch: true,}, //multiple, default
			_completedCaseTail : 		{name : "_completedCaseTail", 		rule : [Token.M.isMultipleCaseStatement, "_defaultStatement"],									isAllowedInScript: true, qualifiesAsInnerSwitch: true,},
			_switchConstruct : 			{name : "_switchConstruct", 		rule : ["_switch", "_brName", "_openBrace", Token.M.qualifiesAsInnerSwitch, "_closeBrace"],		isAllowedInScript: true,},
			_nameCommaName : 			{name : "_nameCommaName", 			rule : [Token.M.qualifiesAsName, "_comma", Token.M.qualifiesAsName],							isCommaSeparated: true, isCommaSeparatedNames: true,},
			_csnCommaName : 			{name : "_csnCommaName", 			rule : [Token.M.isCommaSeparatedNames, "_comma", Token.M.qualifiesAsName],						isCommaSeparated: true, isCommaSeparatedNames: true,},
			_expCommaExp : 				{name : "_expCommaExp", 			rule : [Token.M.isExpression, "_comma", Token.M.isExpression],									isCommaSeparated: true,},
			_cseCommaExp : 				{name : "_cseCommaExp", 			rule : [Token.M.isCommaSeparated, "_comma", Token.M.isExpression],								isCommaSeparated: true,},
			_brCsn : 					{name : "_brCsn", 					rule : ["_openBracket", Token.M.isCommaSeparatedNames, "_closeBracket"],						isBracketedNameS: true, isBracketedExpressionS: true,},
			_brCse : 					{name : "_brCse", 					rule : ["_openBracket", Token.M.isCommaSeparated, "_closeBracket"],								isBracketedExpressionS: true,},
			_brName : 					{name : "_brName", 					rule : ["_openBracket", Token.M.qualifiesAsName, "_closeBracket"],								isExpression: true, isBracketedNameS: true, isBracketedExpressionS: true,},
			_brExp : 					{name : "_brExp", 					rule : ["_openBracket", Token.M.isExpression, "_closeBracket"],									isExpression: true, isBracketedExpressionS: true,},
			_brEmpty : 					{name : "_brEmpty", 				rule : ["_openBracket", "_closeBracket"],														isBracketedNameS: true,},
			_length : 					{name : "_length", 					rule : ["_hash", Token.M.isExpression],															isExpression: true,},
			_multipleScript : 			{name : "_multipleScript", 			rule : [Token.M.isAllowedInScript, Token.M.isAllowedInScript],									isAllowedInScript: true,},
			_redundantSemi : 			{name : "_redundantSemi", 			rule : [Token.M.isAllowedInScript, "_semicolon"],												isAllowedInScript: true,},
		}

	this.upToReduce = function(input){

		var tokens = this.tokenise(input);
		var reduced = this.reduce(tokens);

		return reduced;
	}

	this.tokenise = function(input){

		var tokens = [];

		input = input.replace(/\t/g, " ");	//Remove tabs
		var lines = input.split(/\/\/.*(\r\n|\n|\r)/g); //Split into lines

		var canItMakeToken = function(word){

			for(var i in Token.primitiveTokenType){

				if(Token.primitiveTokenType[i].regex.test(word)){

					return new Token(word, Token.primitiveTokenType[i]);
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

	this.reduce = function(tokens){

		var removeWhitespace = function(tokens){

			for(var i=0; i<tokens.length; i++){

				if(tokens[i].type === Token.primitiveTokenType._whitespace){

					tokens.splice(i, 1);
					i--;
				}
			}

			return tokens;
		}

		tokens = removeWhitespace(tokens);

		//Recursively call this function to level the brackets
		var recursiveLevelling = function(tokens){

			var openIndex;
			var stack = [];
			var counting = false;
			var countType;

			//First of all, find the first bracket, brace, or array bracket, and recursively call the method on the paired bracket.
			for(var i=0; i<tokens.length; i++){

				if(tokens[i].test(Token.M.isOpenLevel)){

					if(counting){

						if(countType === tokens[i].type.name){

							stack.push(tokens[i]);
						}
					}
					else{
						
						counting = true;
						openIndex = i;
						countType = tokens[i].type.name;
					}
				}
				else if(tokens[i].test(Token.M.isCloseLevel)){

					if(counting){

						if(countType === tokens[i].type.name){

							if(stack.length == 0){

								var left = tokens.splice(0, openIndex);
								var middle = tokens.splice(0, (i - openIndex) + 1);

								return left.concat(reduce(middle), tokens);
							}
							else{

								stack.pop();
							}
						}
					}
					else{
						
						throw new Token.ReductionCountingError(tokens);
					}
				}
			}

			return tokens;	
		}

//console.log("a")
//console.log(tokens)
		tokens = recursiveLevelling(tokens);

		//Function to call all of the rules in order to reduce
		var reductioning = function(tokens){

			for(var i in Token.reductionTokenType){

				//console.log("Reducing using rule: "+ i)

				var rule = Token.reductionTokenType[i].rule;

				//Loop for the starting point 't' to check whether the rule overlays at a point in the tokens
				for(var t=0; t <= (tokens.length - rule.length); t++){

					//If the rule finishes after the tokens length, given its current starting point, the rule cannot be met.
					if((t + rule.length) > tokens.length){

						//Will check the next rule entirely
						break;
					}

					//Loop for evaluating each rule component in the overlay
					for(var j=0; j<rule.length; j++){

						if(!tokens[t+j].test(rule[j])){
							//Break as soon as we know the rule is not met.
							break;
						}
						//If we manage to get to this point, the rule is met.
						if(j == (rule.length - 1)){
//console.log("rule met")
							//Physically extract the tokens that match the rule, and cast them to a new token
							var reductionToken = new Token(tokens.splice(t, rule.length), Token.reductionTokenType[i]);

							//Physically insert the new token, back into where it was taken out.
							tokens.splice(t, 0, reductionToken);

							//If a reduction is made, go back to the beginning
							t = -1; //This shouldnt be necessary...
						}
					}
				}
			}

			return tokens;
		}

//console.log("b")
//console.log(tokens)
		tokens = reductioning(tokens);

//console.log("c")
//console.log(tokens)
		return tokens;
	}











	return this;
}

try{

	module.exports = Interpreter;

}catch(error){}
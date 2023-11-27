class CustomTemplateEngine {
    constructor() {
      this.variableRegex = /21297\{(\w+)\}/g; // Regex to match the variable pattern
      this.innerVariableRegex = /21297\{(\w+)\}/g; // Regex to match the inner variable pattern within loops
      this.ifRegex = /21297\{if (\w+) \}([\s\S]*?){else}([\s\S]*?){\/if}/g; // Regex to match if-else blocks
      this.loopRegex = /21297\{for (\w+) in (\w+) \}([\s\S]*?){\/for}/g; // Regex to match for loop blocks
      this.expressionRegex = /21297\{([^}]+)\}/g;
      this.variables = {}; // Object to store variables and their values
    }
  
    // Set variable and its value
    setVariable(name, value) {
      this.variables[name] = value;
    }
  
    evaluateExpressions(template) {
        let evaluated = template;

        // Replace expressions in the template
        evaluated = evaluated.replace(this.expressionRegex, (match, expression) => {
            try {
                // Function constructor to evaluate the expression
                const evaluatedExpression = new Function('variables', `return (${expression})`)(this.variables);
                return evaluatedExpression;
            } catch (error) {
                // If evaluation fails, return the original expression
                return match;
            }
        });

        return evaluated;
    }

    // Render the template with substituted variables and conditions
    render(template) {
        let rendered = template;
  
        rendered = this.evaluateExpressions(rendered);
        // Replace variables
        rendered = rendered.replace(this.variableRegex, (match, variable) => {
            return this.variables[variable] || match;
        });
  
        // Replace if-else blocks
        rendered = rendered.replace(this.ifRegex, (match, variable, ifCode, elseCode) => {
            const condition = this.variables[variable]; 
            return condition ? ifCode : elseCode;
        });
  
        // Replace for loop blocks
        rendered = rendered.replace(this.loopRegex, (match, item, arrayName, loopCode) => {
            const array = this.variables[arrayName] || [];
            let loopRender = '';
    
            for (const element of array) {
                this.variables[item] = element;
    
                // Update regex to handle nested object properties
                let innerLoopRender = loopCode.replace(this.innerVariableRegex, (match, variable) => {
                    const props = variable.split('.'); 
                    let value = this.variables;
                    for (const prop of props) {
                        value = value[prop];
                    }
                    return value || match;
                });
                loopRender += innerLoopRender;
            }
    
            return loopRender;
        });

      return rendered;
    }
  }
  
  // Example usage:
  const engine = new CustomTemplateEngine();
  
  // Set variables
  engine.setVariable('loggedIn', true);
  engine.setVariable('isAdmin', false);
  engine.setVariable('name', 'Ngoc');
  engine.setVariable('users', [
    { name: 'Ngoc', age: 25 },
    { name: 'Nam', age: 30 },
    { name: 'Nga', age: 28 }
  ]);
  engine.setVariable('x', false);
  engine.setVariable('a', 2);
  engine.setVariable('b', 3);
  
  const template = 
  `
    Welcome! 21297{name}
    21297{if loggedIn }
        You are logged in.
    {else}
        Please log in.
    {/if}
    
    21297{if isAdmin }
        You have admin privileges.
    {else}
        You do not have admin privileges.
    {/if}

    User list:
    21297{for user in users }
    Name: 21297{user.name}, Age: 21297{user.age}
    {/for}

    21297{if x === true}

    21297{a + b} 

    21297{a * 5}

    21297{b / 2}

    21297{a - b} 

    21297{b % 2}
  `;
  
  // Render the template
  const rendered = engine.render(template);
  console.log(rendered);
  
  
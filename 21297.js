// function renderTemplate(template, data) {
//     const regexVar = /21297{([^}]*)}/g;
//     const regexIf = /21297{if ([^}]*)}([^]*){\/if}/g;
  
//     // Replace variables
//     template = template.replace(regexVar, (match, varName) => {
//       return data[varName.trim()];
//     });
  
//     // Replace if conditions
//     template = template.replace(regexIf, (match, condition, content) => {
//       condition = condition.trim();
//       if (data[condition]) {
//         return content.trim().replace('{/if}', '');
//       } else {
//         return content.substring(content.indexOf('{else}') + 6, content.indexOf('{/if}')).trim();
//       }
//     });
  
//     return template;
//   }
  
//   // Example usage
//   const template = '21297{if x } <p>TRUE</p> {else} <p>FALSE</p> {/if}';
//   const data = { x: true };
  
//   const result = renderTemplate(template, data);
//   console.log(result); // Output: '<p>TRUE</p>'
  
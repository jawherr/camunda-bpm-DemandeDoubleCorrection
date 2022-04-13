const { Client, logger } = require("camunda-external-task-client-js");
const { Variables } = require("camunda-external-task-client-js");

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

// susbscribe to the topic: 'creditScoreChecker'
client.subscribe("EnvoyerUneDemande", async function({ task, taskService }) {
  // Put your business logic
  const objetTitre = task.variables.get("objet")
  console.log("** Rappel à lire: "+ objetTitre + "**");

  const agentResponse = "Desole votre demande n'est pas accepter. ET, l'enseignant peut parler avec vous..."
  const processVariables = new Variables();
  processVariables.set("agentResponse", agentResponse);

  
  if(objetTitre.includes("agent")){
    // complete the taskREFUSE_HELP
    await taskService.complete(task, processVariables);
  }else{
    // throw a BPMN error
    await taskService.handleBpmnError(task, "DEMANDE_REJETER", "Desole votre demande n'est pas accepter", processVariables);
  }

});
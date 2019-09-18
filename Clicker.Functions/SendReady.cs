using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using Clicker.Functions.Entities;

namespace Clicker.Functions
{
    public static class SendReady
    {
        [FunctionName("SendReady")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            [CosmosDB("game", "players", ConnectionStringSetting = "CosmosDBConnection",
                SqlQuery = "SELECT * FROM c ORDER BY c.clicks DESC, c.name ASC")] IEnumerable<Player> players,
            ILogger log)
        {
            // TODO:
            // this function should
            // - check if there are sufficient players (CosmosDB)
            // - if there are, check if all are ready
            // - if there aren't, or not all are ready - nothing happens
            // - if there are, clock should be set (or reset) to 30 seconds to start (SignalR)

            log.LogInformation("C# HTTP trigger function processed a request.");

            string name = req.Query["name"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            name = name ?? data?.name;

            return name != null
                ? (ActionResult)new OkObjectResult($"Hello, {name}")
                : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
        }
    }
}

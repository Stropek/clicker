using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Clicker.Functions.Entities;
using System.Collections.Generic;

namespace Clicker.Functions
{
    public static class GetGame
    {
        [FunctionName("GetGame")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
            [CosmosDB("game", "players", ConnectionStringSetting = "CosmosDBConnection",
                SqlQuery = "SELECT c.publicId, c.name, c.clicks FROM c ORDER BY c.clicks DESC")] IEnumerable<Player> players,
            ILogger log)
        {
            log.LogInformation("Getting players.");

            return new JsonResult(players)
            {
                Value = new { players }
            };
        }
    }
}

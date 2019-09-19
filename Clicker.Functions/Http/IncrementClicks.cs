using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Clicker.Functions.Entities;
using System.Collections.Generic;
using System.Linq;

namespace Clicker.Functions.Http
{
    public static class IncrementClicks
    {
        [FunctionName("IncrementClicks")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] Player playerData,
            [CosmosDB("game", "players", SqlQuery = "SELECT * FROM c WHERE c.id = {id}", ConnectionStringSetting = "CosmosDBConnection")] IEnumerable<Player> players,
            [CosmosDB("game", "players", ConnectionStringSetting = "CosmosDBConnection")] out Player updatedPlayer,
            ILogger log)
        {
            log.LogInformation($"Incrementing clicks count");

            updatedPlayer = null;

            if (players != null && players.Count() == 1)
            {
                players.First().Clicks++;
                updatedPlayer = players.First();
            }

            return new OkResult();
        }
    }
}

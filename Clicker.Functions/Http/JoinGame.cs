using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Clicker.Functions.Entities;

namespace Clicker.Functions.Http
{
    public static class JoinGame
    {
        [FunctionName("JoinGame")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] Player player,
            [CosmosDB("game", "players", ConnectionStringSetting = "CosmosDBConnection")] out Player newPlayer,
            ILogger log)
        {
            log.LogInformation($"{player.Name} joined the game.");

            player.Id = Guid.NewGuid().GetHashCode().ToString();
            player.PublicId = Guid.NewGuid().GetHashCode().ToString();
            newPlayer = player;

            return new JsonResult(newPlayer);
        }
    }
}

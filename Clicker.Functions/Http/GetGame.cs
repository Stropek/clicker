using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Clicker.Functions.Entities;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using System.Linq;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

namespace Clicker.Functions.Http
{
    public static class GetGame
    {
        [FunctionName("GetGame")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
            [CosmosDB("game", "players", ConnectionStringSetting = "CosmosDBConnection",
                SqlQuery = "SELECT c.publicId, c.name, c.clicks FROM c ORDER BY c.clicks DESC")] IEnumerable<Player> players,
            [SignalR(HubName = "clicker")] IAsyncCollector<SignalRMessage> messages,
            ILogger log,
            ExecutionContext context)
        {
            log.LogInformation("Getting players.");
            var config = new ConfigurationBuilder().SetBasePath(context.FunctionAppDirectory)
                .AddJsonFile("local.settings.json", true, true)
                .AddEnvironmentVariables().Build();

            int.TryParse(config["MinPlayers"], out int minPlayers);

            var game = new Game
            {
                MinPlayers = minPlayers,
                NumberOfPlayers = players.Count()
            };

            return new JsonResult(players)
            {
                Value = new { players, game }
            };
        }
    }
}

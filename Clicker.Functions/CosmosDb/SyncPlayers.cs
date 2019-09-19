using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Clicker.Functions.Entities;
using Microsoft.Azure.Documents;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Clicker.Functions.CosmosDb
{
    public static class SyncPlayers
    {
        [FunctionName("SyncPlayers")]
        public static async Task Run(
            [CosmosDBTrigger("game", "players", ConnectionStringSetting = "CosmosDBConnection", LeaseCollectionName = "leases", CreateLeaseCollectionIfNotExists = true)] IReadOnlyList<Document> modifiedPlayers,
            [CosmosDB("game", "players", ConnectionStringSetting = "CosmosDBConnection",
                SqlQuery = "SELECT * FROM c ORDER BY c.clicks DESC")] IEnumerable<Player> players,
            [SignalR(HubName = "clicker")] IAsyncCollector<SignalRMessage> messages,
            ILogger log,
            ExecutionContext context)
        {
            log.LogInformation($"Syncing players data");

            var config = new ConfigurationBuilder().SetBasePath(context.FunctionAppDirectory)
                .AddJsonFile("local.settings.json", true, true)
                .AddEnvironmentVariables().Build();

            int.TryParse(config["MinPlayers"], out int minPlayers);
            int.TryParse(config["ClicksGoal"], out int clicksGoal);

            var game = new Game
            {
                MinPlayers = minPlayers,
                NumberOfPlayers = players.Count()
            };

            if (modifiedPlayers != null && modifiedPlayers.Count() > 0)
            {
                log.LogInformation($"{modifiedPlayers.Count()} players updated");

                foreach (var player in modifiedPlayers)
                {
                    var clicks = player.GetPropertyValue<int>("clicks");

                    if (clicks == 0)
                    {
                        await messages.AddAsync(
                            new SignalRMessage
                            {
                                Target = "playerJoined",
                                Arguments = new[] { (object)player, game }
                            });
                    }
                    else if (clicks > clicksGoal)
                    {
                        await messages.AddAsync(
                            new SignalRMessage
                            {
                                Target = "announceWinner",
                                Arguments = new[] { player }
                            });
                    }
                    else
                    {
                        await messages.AddAsync(
                            new SignalRMessage
                            {
                                Target = "updateScore",
                                Arguments = new[] { player }
                            });
                    }
                }
            }
        }
    }
}

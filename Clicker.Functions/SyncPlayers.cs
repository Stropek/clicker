using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Clicker.Functions.Entities;
using Clicker.Functions.Enums;
using Microsoft.Azure.Documents;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Logging;

namespace Clicker.Functions
{
    public static class SyncPlayers
    {
        [FunctionName("SyncPlayers")]
        public static Task Run(
            [CosmosDBTrigger("game", "players", ConnectionStringSetting = "CosmosDBConnection", LeaseCollectionName = "leases", CreateLeaseCollectionIfNotExists = true)] IReadOnlyList<Document> modifiedPlayers,
            [CosmosDB("game", "players", ConnectionStringSetting = "CosmosDBConnection",
                SqlQuery = "SELECT * FROM c ORDER BY c.clicks DESC")] IEnumerable<Player> players,
            [SignalR(HubName = "clicker")] IAsyncCollector<SignalRMessage> messages,
            ILogger log)
        {
            if (modifiedPlayers != null && modifiedPlayers.Count > 0)
            {
                //log.LogInformation($"{modifiedPlayers.Where(p => p.Status == PlayerStatus.Joined).Count()} players joined");
                //log.LogInformation($"{modifiedPlayers.Where(p => p.Status == PlayerStatus.Ready).Count()} players changed status to ready");

                return messages.AddAsync(
                    new SignalRMessage
                    {
                        Target = "playersJoined",
                        Arguments = new[] { modifiedPlayers }
                    });

                // TODO:
                // this function should
                // - check if there are sufficient players (CosmosDB)
                // - if there are, check if all are ready
                // - if there aren't, or not all are ready - nothing happens
                // - if there are, clock should be set (or reset) to 30 seconds to start (SignalR)
            }

            return null;
        }
    }
}

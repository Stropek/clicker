using System.Collections.Generic;
using System.Threading.Tasks;
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
            [CosmosDBTrigger("game", "players", ConnectionStringSetting = "CosmosDBConnection", LeaseCollectionName = "leases", CreateLeaseCollectionIfNotExists = true)] IReadOnlyList<Document> players,
            [SignalR(HubName = "clicker")] IAsyncCollector<SignalRMessage> messages,
            ILogger log)
        {
            if (players != null && players.Count > 0)
            {
                log.LogInformation($"Players modified {players.Count}");

                return messages.AddAsync(
                    new SignalRMessage
                    {
                        Target = "playersUpdated",
                        Arguments = new[] { players }
                    });
            }

            return null;
        }
    }
}

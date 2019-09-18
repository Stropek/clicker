using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Clicker.Functions.Entities;
using Clicker.Functions.Enums;

namespace Clicker.Functions
{
    public static class SendReady
    {
        [FunctionName("SendReady")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] Player player,
            [CosmosDB("game", "players", ConnectionStringSetting = "CosmosDBConnection")] out Player updatedPlayer,
            ILogger log)
        {
            log.LogInformation($"{player.Name} is ready.");

            player.Status = PlayerStatus.Ready;
            updatedPlayer = player;

            return new JsonResult(updatedPlayer);
        }
    }
}

using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

namespace Clicker.Functions
{
    public static class Negotiate
    {
        [FunctionName("Negotiate")]
        public static SignalRConnectionInfo GetSignalRInfo(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req,
            [SignalRConnectionInfo(HubName = "players")] SignalRConnectionInfo connectionInfo)
        {
            return connectionInfo;
        }

        //[FunctionName("messages")]
        //public static Task SendMessage(
        //    [HttpTrigger(AuthorizationLevel.Anonymous, "post")] object message,
        //    [SignalR(HubName = "chat")] IAsyncCollector<SignalRMessage> signalRMessages)
        //{
        //    return signalRMessages.AddAsync(
        //        new SignalRMessage
        //        {
        //            Target = "newMessage",
        //            Arguments = new[] { message }
        //        });
        //}
    }
}
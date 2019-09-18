using System;
using Newtonsoft.Json;

namespace Clicker.Functions.Entities
{
    [JsonObject("Player")]
    public class Player
    {
        [JsonProperty]
        public Guid Id { get; set; }

        [JsonProperty]
        public string Name { get; set; }

        [JsonProperty]
        public int Clicks { get; set; }
    }
}

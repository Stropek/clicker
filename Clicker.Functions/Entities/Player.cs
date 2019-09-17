using System;
using Newtonsoft.Json;

namespace Clicker.Functions.Entities
{
    public class Player
    {
        [JsonProperty]
        public Guid Id { get; set; }

        [JsonProperty]
        public string Name { get; set; }
    }
}

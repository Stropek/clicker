﻿using Newtonsoft.Json;

namespace Clicker.Functions.Entities
{
    [JsonObject("Player")]
    public class Player
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("publicId")]
        public string PublicId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("clicks")]
        public int Clicks { get; set; }
    }
}

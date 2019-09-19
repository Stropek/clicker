using Newtonsoft.Json;

namespace Clicker.Functions.Entities
{
    public class Game
    {
        [JsonProperty("numberOfPlayers")]
        public int NumberOfPlayers { get; set; }

        [JsonProperty("minPlayers")]
        public int MinPlayers { get; set; }

        [JsonProperty("countdownTime")]
        public int CountdownTime { get; set; }
    }
}

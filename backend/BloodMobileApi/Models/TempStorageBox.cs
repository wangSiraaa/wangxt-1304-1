namespace BloodMobileApi.Models;

public class TempStorageBox
{
    public Guid Id { get; set; }
    public string BoxCode { get; set; } = string.Empty;
    public string VehicleId { get; set; } = string.Empty;
    public Guid CollectionPointId { get; set; }
    public double MinTempCelsius { get; set; } = 2.0;
    public double MaxTempCelsius { get; set; } = 6.0;
    public string Status { get; set; } = "Normal";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Vehicle? Vehicle { get; set; }
    public ExternalCollectionPoint? CollectionPoint { get; set; }
    public ICollection<TemperatureRecord> TemperatureRecords { get; set; } = new List<TemperatureRecord>();
    public ICollection<BloodBag> BloodBags { get; set; } = new List<BloodBag>();
}

namespace BloodMobileApi.Models;

public class ReturnHandover
{
    public Guid Id { get; set; }
    public Guid CollectionPointId { get; set; }
    public string HandoverBy { get; set; } = string.Empty;
    public string HandoverTo { get; set; } = string.Empty;
    public string VehicleId { get; set; } = string.Empty;
    public int ExpectedBagCount { get; set; }
    public int ActualBagCount { get; set; }
    public double ExpectedTotalVolumeMl { get; set; }
    public double ActualTotalVolumeMl { get; set; }
    public string Status { get; set; } = "Pending";
    public string? DiscrepancyNote { get; set; }
    public DateTime HandoverAt { get; set; } = DateTime.UtcNow;
    public ExternalCollectionPoint? CollectionPoint { get; set; }
    public Vehicle? Vehicle { get; set; }
    public ICollection<HandoverDetail> Details { get; set; } = new List<HandoverDetail>();
}

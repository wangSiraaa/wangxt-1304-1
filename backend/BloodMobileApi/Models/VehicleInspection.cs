namespace BloodMobileApi.Models;

public class VehicleInspection
{
    public Guid Id { get; set; }
    public string VehicleId { get; set; } = string.Empty;
    public Guid CollectionPointId { get; set; }
    public string InspectorId { get; set; } = string.Empty;
    public string InspectorName { get; set; } = string.Empty;
    public bool VehicleChecked { get; set; }
    public bool EquipmentChecked { get; set; }
    public bool ColdChainChecked { get; set; }
    public string? Remarks { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime InspectedAt { get; set; } = DateTime.UtcNow;
    public Vehicle? Vehicle { get; set; }
    public ExternalCollectionPoint? CollectionPoint { get; set; }
}

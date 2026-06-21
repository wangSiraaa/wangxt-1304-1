namespace BloodMobileApi.Models;

public class BloodBag
{
    public Guid Id { get; set; }
    public string BagCode { get; set; } = string.Empty;
    public string BloodType { get; set; } = string.Empty;
    public string BloodProduct { get; set; } = string.Empty;
    public double VolumeMl { get; set; }
    public Guid CollectionPointId { get; set; }
    public string DonorIdNumber { get; set; } = string.Empty;
    public string NurseId { get; set; } = string.Empty;
    public string NurseName { get; set; } = string.Empty;
    public Guid? TempStorageBoxId { get; set; }
    public string Status { get; set; } = "Collected";
    public bool IsLocked { get; set; }
    public string? LockReason { get; set; }
    public DateTime CollectedAt { get; set; } = DateTime.UtcNow;
    public ExternalCollectionPoint? CollectionPoint { get; set; }
    public TempStorageBox? TempStorageBox { get; set; }
}

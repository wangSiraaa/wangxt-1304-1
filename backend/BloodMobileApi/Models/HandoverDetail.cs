namespace BloodMobileApi.Models;

public class HandoverDetail
{
    public Guid Id { get; set; }
    public Guid ReturnHandoverId { get; set; }
    public Guid BloodBagId { get; set; }
    public string BagCode { get; set; } = string.Empty;
    public string BloodType { get; set; } = string.Empty;
    public double VolumeMl { get; set; }
    public bool IsReceived { get; set; }
    public string? Remark { get; set; }
    public ReturnHandover? ReturnHandover { get; set; }
    public BloodBag? BloodBag { get; set; }
}

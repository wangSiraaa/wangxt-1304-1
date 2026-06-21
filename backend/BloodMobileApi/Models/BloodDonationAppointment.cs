namespace BloodMobileApi.Models;

public class BloodDonationAppointment
{
    public Guid Id { get; set; }
    public string DonorName { get; set; } = string.Empty;
    public string DonorIdNumber { get; set; } = string.Empty;
    public string DonorPhone { get; set; } = string.Empty;
    public string BloodType { get; set; } = string.Empty;
    public Guid CollectionPointId { get; set; }
    public DateTime AppointmentTime { get; set; }
    public string Status { get; set; } = "Scheduled";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ExternalCollectionPoint? CollectionPoint { get; set; }
}

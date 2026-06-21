namespace BloodMobileApi.Models;

public class Vehicle
{
    public string Id { get; set; } = string.Empty;
    public string LicensePlate { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Status { get; set; } = "Available";
    public string? AssignedDriverId { get; set; }
    public string? AssignedDriverName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

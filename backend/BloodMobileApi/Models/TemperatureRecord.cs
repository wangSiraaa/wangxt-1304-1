namespace BloodMobileApi.Models;

public class TemperatureRecord
{
    public Guid Id { get; set; }
    public Guid TempStorageBoxId { get; set; }
    public double TemperatureCelsius { get; set; }
    public bool IsAlarm { get; set; }
    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
    public TempStorageBox? TempStorageBox { get; set; }
}

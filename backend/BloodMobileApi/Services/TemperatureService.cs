using BloodMobileApi.Data;
using BloodMobileApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BloodMobileApi.Services;

public interface ITemperatureService
{
    Task<IEnumerable<TemperatureRecord>> GetByStorageBoxAsync(Guid boxId);
    Task<TemperatureRecord> RecordAsync(TemperatureRecord record);
    Task CheckAndAlarmAsync(Guid boxId);
}

public class TemperatureService : ITemperatureService
{
    private readonly IBloodBagService _bloodBagService;
    private readonly AppDbContext _db;

    public TemperatureService(AppDbContext db, IBloodBagService bloodBagService)
    {
        _db = db;
        _bloodBagService = bloodBagService;
    }

    public async Task<IEnumerable<TemperatureRecord>> GetByStorageBoxAsync(Guid boxId) =>
        await _db.TemperatureRecords
            .Where(r => r.TempStorageBoxId == boxId)
            .OrderByDescending(r => r.RecordedAt)
            .ToListAsync();

    public async Task<TemperatureRecord> RecordAsync(TemperatureRecord record)
    {
        record.Id = Guid.NewGuid();
        record.RecordedAt = DateTime.UtcNow;

        var box = await _db.TempStorageBoxes.FindAsync(record.TempStorageBoxId)
            ?? throw new KeyNotFoundException("暂存箱不存在");

        record.IsAlarm = record.TemperatureCelsius < box.MinTempCelsius
                         || record.TemperatureCelsius > box.MaxTempCelsius;

        _db.TemperatureRecords.Add(record);
        await _db.SaveChangesAsync();

        if (record.IsAlarm)
            await _bloodBagService.LockByTemperatureAlarmAsync(box.Id);

        return record;
    }

    public async Task CheckAndAlarmAsync(Guid boxId)
    {
        var box = await _db.TempStorageBoxes.FindAsync(boxId)
            ?? throw new KeyNotFoundException("暂存箱不存在");

        var latestRecord = await _db.TemperatureRecords
            .Where(r => r.TempStorageBoxId == boxId)
            .OrderByDescending(r => r.RecordedAt)
            .FirstOrDefaultAsync();

        if (latestRecord != null &&
            (latestRecord.TemperatureCelsius < box.MinTempCelsius ||
             latestRecord.TemperatureCelsius > box.MaxTempCelsius))
        {
            await _bloodBagService.LockByTemperatureAlarmAsync(boxId);
        }
    }
}

using BloodMobileApi.Data;
using BloodMobileApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BloodMobileApi.Services;

public interface IBloodBagService
{
    Task<IEnumerable<BloodBag>> GetByCollectionPointAsync(Guid cpId);
    Task<BloodBag> RegisterAsync(BloodBag bag);
    Task<BloodBag> AssignToStorageBoxAsync(Guid bagId, Guid boxId);
    Task LockByTemperatureAlarmAsync(Guid boxId);
    Task<BloodBag> UnlockAsync(Guid bagId);
}

public class BloodBagService : IBloodBagService
{
    private readonly AppDbContext _db;

    public BloodBagService(AppDbContext db) => _db = db;

    public async Task<IEnumerable<BloodBag>> GetByCollectionPointAsync(Guid cpId) =>
        await _db.BloodBags
            .Include(b => b.TempStorageBox)
            .Where(b => b.CollectionPointId == cpId)
            .OrderByDescending(b => b.CollectedAt)
            .ToListAsync();

    public async Task<BloodBag> RegisterAsync(BloodBag bag)
    {
        bag.Id = Guid.NewGuid();
        bag.CollectedAt = DateTime.UtcNow;
        bag.Status = "Collected";
        bag.IsLocked = false;
        _db.BloodBags.Add(bag);
        await _db.SaveChangesAsync();
        return bag;
    }

    public async Task<BloodBag> AssignToStorageBoxAsync(Guid bagId, Guid boxId)
    {
        var bag = await _db.BloodBags.FindAsync(bagId)
            ?? throw new KeyNotFoundException("血袋不存在");
        bag.TempStorageBoxId = boxId;
        await _db.SaveChangesAsync();
        return bag;
    }

    public async Task LockByTemperatureAlarmAsync(Guid boxId)
    {
        var bags = await _db.BloodBags
            .Where(b => b.TempStorageBoxId == boxId && !b.IsLocked)
            .ToListAsync();

        foreach (var bag in bags)
        {
            bag.IsLocked = true;
            bag.LockReason = "暂存温度超限自动锁定";
            bag.Status = "Locked";
        }

        var box = await _db.TempStorageBoxes.FindAsync(boxId);
        if (box != null)
            box.Status = "Alarm";

        await _db.SaveChangesAsync();
    }

    public async Task<BloodBag> UnlockAsync(Guid bagId)
    {
        var bag = await _db.BloodBags.FindAsync(bagId)
            ?? throw new KeyNotFoundException("血袋不存在");
        bag.IsLocked = false;
        bag.LockReason = null;
        bag.Status = "Collected";
        await _db.SaveChangesAsync();
        return bag;
    }
}

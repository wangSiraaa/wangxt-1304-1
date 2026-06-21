using BloodMobileApi.Data;
using BloodMobileApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BloodMobileApi.Services;

public interface IReturnHandoverService
{
    Task<IEnumerable<ReturnHandover>> GetByCollectionPointAsync(Guid cpId);
    Task<ReturnHandover> CreateAsync(ReturnHandover handover);
    Task<ReturnHandover> ConfirmAsync(Guid id);
    Task<ReturnHandover> RejectAsync(Guid id, string reason);
}

public class ReturnHandoverService : IReturnHandoverService
{
    private readonly AppDbContext _db;

    public ReturnHandoverService(AppDbContext db) => _db = db;

    public async Task<IEnumerable<ReturnHandover>> GetByCollectionPointAsync(Guid cpId) =>
        await _db.ReturnHandovers
            .Include(h => h.Details)
            .Include(h => h.Vehicle)
            .Where(h => h.CollectionPointId == cpId)
            .OrderByDescending(h => h.HandoverAt)
            .ToListAsync();

    public async Task<ReturnHandover> CreateAsync(ReturnHandover handover)
    {
        handover.Id = Guid.NewGuid();
        handover.HandoverAt = DateTime.UtcNow;

        var bags = await _db.BloodBags
            .Where(b => b.CollectionPointId == handover.CollectionPointId && !b.IsLocked)
            .ToListAsync();

        handover.ExpectedBagCount = bags.Count;
        handover.ExpectedTotalVolumeMl = bags.Sum(b => b.VolumeMl);

        foreach (var bag in bags)
        {
            handover.Details.Add(new HandoverDetail
            {
                Id = Guid.NewGuid(),
                BloodBagId = bag.Id,
                BagCode = bag.BagCode,
                BloodType = bag.BloodType,
                VolumeMl = bag.VolumeMl,
                IsReceived = false
            });
        }

        _db.ReturnHandovers.Add(handover);
        await _db.SaveChangesAsync();
        return handover;
    }

    public async Task<ReturnHandover> ConfirmAsync(Guid id)
    {
        var handover = await _db.ReturnHandovers
            .Include(h => h.Details)
            .FirstOrDefaultAsync(h => h.Id == id)
            ?? throw new KeyNotFoundException("交接记录不存在");

        var receivedCount = handover.Details.Count(d => d.IsReceived);
        handover.ActualBagCount = receivedCount;
        handover.ActualTotalVolumeMl = handover.Details
            .Where(d => d.IsReceived).Sum(d => d.VolumeMl);

        if (handover.ActualBagCount != handover.ExpectedBagCount)
        {
            handover.Status = "Discrepancy";
            handover.DiscrepancyNote =
                $"数量不一致：预期 {handover.ExpectedBagCount} 袋，实际 {handover.ActualBagCount} 袋";
            await _db.SaveChangesAsync();
            throw new InvalidOperationException(
                $"交接数量不一致，不能入库。预期 {handover.ExpectedBagCount} 袋，实际 {handover.ActualBagCount} 袋");
        }

        handover.Status = "Confirmed";
        await _db.SaveChangesAsync();
        return handover;
    }

    public async Task<ReturnHandover> RejectAsync(Guid id, string reason)
    {
        var handover = await _db.ReturnHandovers.FindAsync(id)
            ?? throw new KeyNotFoundException("交接记录不存在");
        handover.Status = "Rejected";
        handover.DiscrepancyNote = reason;
        await _db.SaveChangesAsync();
        return handover;
    }
}

using BloodMobileApi.Data;
using BloodMobileApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BloodMobileApi.Services;

public interface ICollectionPointService
{
    Task<IEnumerable<ExternalCollectionPoint>> GetAllAsync();
    Task<ExternalCollectionPoint?> GetByIdAsync(Guid id);
    Task<ExternalCollectionPoint> CreateAsync(ExternalCollectionPoint point);
    Task<ExternalCollectionPoint> PublishAsync(Guid id);
    Task<ExternalCollectionPoint> AssignVehicleAsync(Guid id, string vehicleId, string driverId);
    Task<ExternalCollectionPoint> DispatchAsync(Guid id);
}

public class CollectionPointService : ICollectionPointService
{
    private readonly AppDbContext _db;

    public CollectionPointService(AppDbContext db) => _db = db;

    public async Task<IEnumerable<ExternalCollectionPoint>> GetAllAsync() =>
        await _db.CollectionPoints.OrderByDescending(p => p.PlanDate).ToListAsync();

    public async Task<ExternalCollectionPoint?> GetByIdAsync(Guid id) =>
        await _db.CollectionPoints.FindAsync(id);

    public async Task<ExternalCollectionPoint> CreateAsync(ExternalCollectionPoint point)
    {
        point.Id = Guid.NewGuid();
        point.Status = "Planned";
        point.CreatedAt = DateTime.UtcNow;
        _db.CollectionPoints.Add(point);
        await _db.SaveChangesAsync();
        return point;
    }

    public async Task<ExternalCollectionPoint> PublishAsync(Guid id)
    {
        var point = await _db.CollectionPoints.FindAsync(id)
            ?? throw new KeyNotFoundException("外采点不存在");
        point.Status = "Published";
        await _db.SaveChangesAsync();
        return point;
    }

    public async Task<ExternalCollectionPoint> AssignVehicleAsync(Guid id, string vehicleId, string driverId)
    {
        var point = await _db.CollectionPoints.FindAsync(id)
            ?? throw new KeyNotFoundException("外采点不存在");
        point.AssignedVehicleId = vehicleId;
        point.AssignedDriverId = driverId;
        point.Status = "VehicleAssigned";
        await _db.SaveChangesAsync();
        return point;
    }

    public async Task<ExternalCollectionPoint> DispatchAsync(Guid id)
    {
        var point = await _db.CollectionPoints.FindAsync(id)
            ?? throw new KeyNotFoundException("外采点不存在");

        if (string.IsNullOrEmpty(point.AssignedVehicleId))
            throw new InvalidOperationException("未分配车辆，不能出车");

        var inspection = await _db.VehicleInspections
            .Where(i => i.CollectionPointId == id && i.VehicleId == point.AssignedVehicleId)
            .FirstOrDefaultAsync();

        if (inspection == null || inspection.Status != "Passed")
            throw new InvalidOperationException("车辆设备未点检通过，不能出车");

        point.Status = "Dispatched";
        await _db.SaveChangesAsync();
        return point;
    }
}

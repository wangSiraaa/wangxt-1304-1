using BloodMobileApi.Data;
using BloodMobileApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BloodMobileApi.Services;

public interface IVehicleInspectionService
{
    Task<IEnumerable<VehicleInspection>> GetByCollectionPointAsync(Guid cpId);
    Task<VehicleInspection> SubmitInspectionAsync(VehicleInspection inspection);
    Task<VehicleInspection> PassInspectionAsync(Guid id);
    Task<VehicleInspection> FailInspectionAsync(Guid id, string reason);
}

public class VehicleInspectionService : IVehicleInspectionService
{
    private readonly AppDbContext _db;

    public VehicleInspectionService(AppDbContext db) => _db = db;

    public async Task<IEnumerable<VehicleInspection>> GetByCollectionPointAsync(Guid cpId) =>
        await _db.VehicleInspections
            .Include(i => i.Vehicle)
            .Where(i => i.CollectionPointId == cpId)
            .ToListAsync();

    public async Task<VehicleInspection> SubmitInspectionAsync(VehicleInspection inspection)
    {
        inspection.Id = Guid.NewGuid();
        inspection.InspectedAt = DateTime.UtcNow;

        if (inspection.VehicleChecked && inspection.EquipmentChecked && inspection.ColdChainChecked)
            inspection.Status = "Passed";
        else
            inspection.Status = "Failed";

        _db.VehicleInspections.Add(inspection);
        await _db.SaveChangesAsync();
        return inspection;
    }

    public async Task<VehicleInspection> PassInspectionAsync(Guid id)
    {
        var insp = await _db.VehicleInspections.FindAsync(id)
            ?? throw new KeyNotFoundException("点检记录不存在");
        insp.VehicleChecked = true;
        insp.EquipmentChecked = true;
        insp.ColdChainChecked = true;
        insp.Status = "Passed";
        insp.InspectedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return insp;
    }

    public async Task<VehicleInspection> FailInspectionAsync(Guid id, string reason)
    {
        var insp = await _db.VehicleInspections.FindAsync(id)
            ?? throw new KeyNotFoundException("点检记录不存在");
        insp.Status = "Failed";
        insp.Remarks = reason;
        insp.InspectedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return insp;
    }
}

using BloodMobileApi.Data;
using BloodMobileApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BloodMobileApi.Services;

public interface IVehicleService
{
    Task<IEnumerable<Vehicle>> GetAllAsync();
    Task<Vehicle?> GetByIdAsync(string id);
    Task<Vehicle> CreateAsync(Vehicle vehicle);
    Task<Vehicle> UpdateStatusAsync(string id, string status);
}

public class VehicleService : IVehicleService
{
    private readonly AppDbContext _db;

    public VehicleService(AppDbContext db) => _db = db;

    public async Task<IEnumerable<Vehicle>> GetAllAsync() =>
        await _db.Vehicles.OrderBy(v => v.LicensePlate).ToListAsync();

    public async Task<Vehicle?> GetByIdAsync(string id) =>
        await _db.Vehicles.FindAsync(id);

    public async Task<Vehicle> CreateAsync(Vehicle vehicle)
    {
        vehicle.CreatedAt = DateTime.UtcNow;
        _db.Vehicles.Add(vehicle);
        await _db.SaveChangesAsync();
        return vehicle;
    }

    public async Task<Vehicle> UpdateStatusAsync(string id, string status)
    {
        var vehicle = await _db.Vehicles.FindAsync(id)
            ?? throw new KeyNotFoundException("车辆不存在");
        vehicle.Status = status;
        await _db.SaveChangesAsync();
        return vehicle;
    }
}

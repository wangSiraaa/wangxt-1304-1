using BloodMobileApi.Data;
using BloodMobileApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BloodMobileApi.Services;

public interface IAppointmentService
{
    Task<IEnumerable<BloodDonationAppointment>> GetByCollectionPointAsync(Guid cpId);
    Task<BloodDonationAppointment> CreateAsync(BloodDonationAppointment appointment);
    Task<BloodDonationAppointment> UpdateStatusAsync(Guid id, string status);
}

public class AppointmentService : IAppointmentService
{
    private readonly AppDbContext _db;

    public AppointmentService(AppDbContext db) => _db = db;

    public async Task<IEnumerable<BloodDonationAppointment>> GetByCollectionPointAsync(Guid cpId) =>
        await _db.Appointments
            .Include(a => a.CollectionPoint)
            .Where(a => a.CollectionPointId == cpId)
            .OrderBy(a => a.AppointmentTime)
            .ToListAsync();

    public async Task<BloodDonationAppointment> CreateAsync(BloodDonationAppointment appointment)
    {
        appointment.Id = Guid.NewGuid();
        appointment.CreatedAt = DateTime.UtcNow;
        appointment.Status = "Scheduled";
        _db.Appointments.Add(appointment);
        await _db.SaveChangesAsync();
        return appointment;
    }

    public async Task<BloodDonationAppointment> UpdateStatusAsync(Guid id, string status)
    {
        var appt = await _db.Appointments.FindAsync(id)
            ?? throw new KeyNotFoundException("预约不存在");
        appt.Status = status;
        await _db.SaveChangesAsync();
        return appt;
    }
}

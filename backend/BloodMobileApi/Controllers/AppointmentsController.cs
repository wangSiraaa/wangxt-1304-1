using BloodMobileApi.Models;
using BloodMobileApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BloodMobileApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _svc;

    public AppointmentsController(IAppointmentService svc) => _svc = svc;

    [HttpGet("collection-point/{cpId:guid}")]
    public async Task<ActionResult<IEnumerable<BloodDonationAppointment>>> GetByCp(Guid cpId) =>
        Ok(await _svc.GetByCollectionPointAsync(cpId));

    [HttpPost]
    public async Task<ActionResult<BloodDonationAppointment>> Create(BloodDonationAppointment appt) =>
        CreatedAtAction(nameof(GetByCp), new { cpId = appt.CollectionPointId }, await _svc.CreateAsync(appt));

    [HttpPut("{id:guid}/status")]
    public async Task<ActionResult<BloodDonationAppointment>> UpdateStatus(Guid id, [FromBody] string status) =>
        Ok(await _svc.UpdateStatusAsync(id, status));
}

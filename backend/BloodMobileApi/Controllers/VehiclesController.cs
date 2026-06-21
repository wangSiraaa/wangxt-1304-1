using BloodMobileApi.Models;
using BloodMobileApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BloodMobileApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _svc;

    public VehiclesController(IVehicleService svc) => _svc = svc;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Vehicle>>> GetAll() =>
        Ok(await _svc.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<ActionResult<Vehicle>> Get(string id) =>
        await _svc.GetByIdAsync(id) is { } v ? Ok(v) : NotFound();

    [HttpPost]
    public async Task<ActionResult<Vehicle>> Create(Vehicle vehicle) =>
        CreatedAtAction(nameof(Get), new { id = vehicle.Id }, await _svc.CreateAsync(vehicle));

    [HttpPut("{id}/status")]
    public async Task<ActionResult<Vehicle>> UpdateStatus(string id, [FromBody] string status) =>
        Ok(await _svc.UpdateStatusAsync(id, status));
}

using BloodMobileApi.Models;
using BloodMobileApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BloodMobileApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CollectionPointsController : ControllerBase
{
    private readonly ICollectionPointService _svc;

    public CollectionPointsController(ICollectionPointService svc) => _svc = svc;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExternalCollectionPoint>>> GetAll() =>
        Ok(await _svc.GetAllAsync());

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExternalCollectionPoint>> Get(Guid id) =>
        await _svc.GetByIdAsync(id) is { } p ? Ok(p) : NotFound();

    [HttpPost]
    public async Task<ActionResult<ExternalCollectionPoint>> Create(ExternalCollectionPoint point) =>
        CreatedAtAction(nameof(Get), new { id = point.Id }, await _svc.CreateAsync(point));

    [HttpPut("{id:guid}/publish")]
    public async Task<ActionResult<ExternalCollectionPoint>> Publish(Guid id) =>
        Ok(await _svc.PublishAsync(id));

    [HttpPut("{id:guid}/assign-vehicle")]
    public async Task<ActionResult<ExternalCollectionPoint>> AssignVehicle(Guid id, [FromBody] AssignVehicleRequest req) =>
        Ok(await _svc.AssignVehicleAsync(id, req.VehicleId, req.DriverId));

    [HttpPut("{id:guid}/dispatch")]
    public async Task<ActionResult<ExternalCollectionPoint>> Dispatch(Guid id) =>
        Ok(await _svc.DispatchAsync(id));
}

public record AssignVehicleRequest(string VehicleId, string DriverId);

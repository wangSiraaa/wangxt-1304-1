using BloodMobileApi.Models;
using BloodMobileApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BloodMobileApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehicleInspectionsController : ControllerBase
{
    private readonly IVehicleInspectionService _svc;

    public VehicleInspectionsController(IVehicleInspectionService svc) => _svc = svc;

    [HttpGet("collection-point/{cpId:guid}")]
    public async Task<ActionResult<IEnumerable<VehicleInspection>>> GetByCp(Guid cpId) =>
        Ok(await _svc.GetByCollectionPointAsync(cpId));

    [HttpPost]
    public async Task<ActionResult<VehicleInspection>> Submit(VehicleInspection inspection) =>
        CreatedAtAction(nameof(GetByCp), new { cpId = inspection.CollectionPointId }, await _svc.SubmitInspectionAsync(inspection));

    [HttpPut("{id:guid}/pass")]
    public async Task<ActionResult<VehicleInspection>> Pass(Guid id) =>
        Ok(await _svc.PassInspectionAsync(id));

    [HttpPut("{id:guid}/fail")]
    public async Task<ActionResult<VehicleInspection>> Fail(Guid id, [FromBody] string reason) =>
        Ok(await _svc.FailInspectionAsync(id, reason));
}

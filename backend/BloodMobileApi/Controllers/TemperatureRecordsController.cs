using BloodMobileApi.Models;
using BloodMobileApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BloodMobileApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TemperatureRecordsController : ControllerBase
{
    private readonly ITemperatureService _svc;

    public TemperatureRecordsController(ITemperatureService svc) => _svc = svc;

    [HttpGet("storage-box/{boxId:guid}")]
    public async Task<ActionResult<IEnumerable<TemperatureRecord>>> GetByBox(Guid boxId) =>
        Ok(await _svc.GetByStorageBoxAsync(boxId));

    [HttpPost]
    public async Task<ActionResult<TemperatureRecord>> Record(TemperatureRecord record) =>
        Ok(await _svc.RecordAsync(record));

    [HttpPost("storage-box/{boxId:guid}/check-alarm")]
    public async Task<IActionResult> CheckAlarm(Guid boxId)
    {
        await _svc.CheckAndAlarmAsync(boxId);
        return Ok();
    }
}

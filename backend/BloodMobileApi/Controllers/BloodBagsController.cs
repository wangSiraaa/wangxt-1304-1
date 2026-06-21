using BloodMobileApi.Models;
using BloodMobileApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BloodMobileApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BloodBagsController : ControllerBase
{
    private readonly IBloodBagService _svc;

    public BloodBagsController(IBloodBagService svc) => _svc = svc;

    [HttpGet("collection-point/{cpId:guid}")]
    public async Task<ActionResult<IEnumerable<BloodBag>>> GetByCp(Guid cpId) =>
        Ok(await _svc.GetByCollectionPointAsync(cpId));

    [HttpPost]
    public async Task<ActionResult<BloodBag>> Register(BloodBag bag) =>
        CreatedAtAction(nameof(GetByCp), new { cpId = bag.CollectionPointId }, await _svc.RegisterAsync(bag));

    [HttpPut("{bagId:guid}/assign-box/{boxId:guid}")]
    public async Task<ActionResult<BloodBag>> AssignToBox(Guid bagId, Guid boxId) =>
        Ok(await _svc.AssignToStorageBoxAsync(bagId, boxId));

    [HttpPut("{bagId:guid}/unlock")]
    public async Task<ActionResult<BloodBag>> Unlock(Guid bagId) =>
        Ok(await _svc.UnlockAsync(bagId));
}

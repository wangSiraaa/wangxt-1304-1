using BloodMobileApi.Models;
using BloodMobileApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BloodMobileApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReturnHandoversController : ControllerBase
{
    private readonly IReturnHandoverService _svc;

    public ReturnHandoversController(IReturnHandoverService svc) => _svc = svc;

    [HttpGet("collection-point/{cpId:guid}")]
    public async Task<ActionResult<IEnumerable<ReturnHandover>>> GetByCp(Guid cpId) =>
        Ok(await _svc.GetByCollectionPointAsync(cpId));

    [HttpPost]
    public async Task<ActionResult<ReturnHandover>> Create(ReturnHandover handover) =>
        Ok(await _svc.CreateAsync(handover));

    [HttpPut("{id:guid}/confirm")]
    public async Task<ActionResult<ReturnHandover>> Confirm(Guid id) =>
        Ok(await _svc.ConfirmAsync(id));

    [HttpPut("{id:guid}/reject")]
    public async Task<ActionResult<ReturnHandover>> Reject(Guid id, [FromBody] string reason) =>
        Ok(await _svc.RejectAsync(id, reason));
}

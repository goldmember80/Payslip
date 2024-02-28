using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    //[Route("/")]
    [ApiController]
    public class CalculatorController : ControllerBase
    {
        private readonly CalculatorContext _context;
        public CalculatorController(CalculatorContext context)
        {
            _context = context;
        }
        // GET: api/Calculator
        [HttpGet]
        public async Task<IActionResult> Output()
        {
            var results = await _context.PaySlips.ToListAsync();
            return Ok(results);
        }
        // POST: api/Calculator
        [HttpPost]
        public async Task<IActionResult> Input(Employee ee)
        {
            if (ee.Annual < 0)
            {
                return BadRequest("Annual income must be positive");
            }
            if (string.IsNullOrEmpty(ee.PayPeriod))
            {
                return BadRequest("Pay period is empty");
            }
            CalItem item = new CalItem();
            EmployeePaySlip eepay;
            item.PaySlip(ee, out eepay);
            _context.PaySlips.Add(eepay);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Output), ee);
        }
        // DELETE: api/Calculator
        [HttpDelete]
        public async Task<IActionResult> Delete()
        {
            if (_context.PaySlips.Count() == 0) // The list is empty
            {
                return Ok();
            }
            var list = await _context.PaySlips.ToListAsync();
            _context.PaySlips.RemoveRange(list);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}

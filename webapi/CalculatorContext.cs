using Microsoft.EntityFrameworkCore;

//DBContext class to save calculation results
namespace webapi
{
    public class CalculatorContext : DbContext
    {
        public CalculatorContext(DbContextOptions<CalculatorContext> options)
            : base(options)
        {
        }
        public DbSet<EmployeePaySlip> PaySlips { get; set; }
    }
}

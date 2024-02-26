using System.Globalization;

namespace webapi
{
    public class Employee
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Annual { get; set; }
        public double SuperRate { get; set; }
        public string PayPeriod { get; set; }
    }
    public class EmployeePaySlip
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string PayPeriod { get; set; }
        public string GrossIncome { get; set; }
        public string IncomeTax { get; set; }
        public string NetIncome { get; set; }
        public string Super { get; set; }
    }
    public class CalItem
    {
        private TaxCalculator? _taxCalculator;
        private MonthConverter? _month;

        public CalItem()
        {
            _taxCalculator = TaxCalculator.GetInstance();
            _month = MonthConverter.GetInstance();
        }
        public int PaySlip(Employee ee, out EmployeePaySlip eepay)
        {
            eepay = new EmployeePaySlip();
            eepay.Id = Guid.NewGuid();
            eepay.FullName = $"{ee.FirstName} {ee.LastName}";
            eepay.PayPeriod = $"{_month?.GetStartDate(ee.PayPeriod)} - {_month?.GetEndDate(ee.PayPeriod)}";
            double grossIncome = Util.Round2dp((double)ee.Annual / 12);
            double? incomeTax = _taxCalculator?.Calculate(ee.Annual);
            eepay.GrossIncome = $"{grossIncome:F2}";
            eepay.IncomeTax = $"{incomeTax:F2}";
            eepay.NetIncome = $"{(grossIncome - incomeTax):F2}";
            eepay.Super = $"{(grossIncome * ee.SuperRate / 100):F2}";
            return 0;
        }
    }

    public class MonthConverter
    {
        private static MonthConverter? _instance;
        private DateTimeFormatInfo _dtfi;
        public MonthConverter() { _dtfi = new DateTimeFormatInfo(); }

        // Public static method to get the singleton instance
        public static MonthConverter GetInstance()
        {
            // Lazy initialization: Create the instance only when it's accessed for the first time
            if (_instance == null)
            {
                _instance = new MonthConverter();
            }
            return _instance;
        }
        public int GetMonthNumber(string month)
        {
            string[] abbMonthNames = _dtfi.AbbreviatedMonthNames;

            month = month.Substring(0, 3);
            int index = Array.FindIndex(abbMonthNames, m => string.Equals(m, month, StringComparison.OrdinalIgnoreCase));
            return index != -1 ? index + 1 : -1;
        }
        public int GetDaysInMonth(string month) => DateTime.DaysInMonth(DateTime.Now.Year, GetMonthNumber(month));
        public string GetStartDate(string month) => $"01 {month}";
        public string GetEndDate(string month) => $"{GetDaysInMonth(month)} {month}";
    }

    public class TaxCalculator
    {
        private static TaxCalculator? _instance;
        private Dictionary<int, double> _taxRates;

        public TaxCalculator(int income = 0)
        {
            _taxRates = new Dictionary<int, double>()
            {
                { 14000, 0.105 },
                { 48000 - 14000, 0.175 },
                { 70000 - 48000, 0.3 },
                { 180000 - 70000, 0.33 },
                { int.MaxValue, 0.39 }  // The highest tax rate applies to all income above 180000
            };
        }
        // Public static method to get the singleton instance
        public static TaxCalculator GetInstance()
        {
            // Lazy initialization: Create the instance only when it's accessed for the first time
            if (_instance == null)
            {
                _instance = new TaxCalculator();
            }
            return _instance;
        }
        public double Calculate(int income)
        {
            double tax = 0;

            foreach (var thres in _taxRates)
            {
                if (income <= thres.Key)
                {
                    tax += Util.Round2dp(income * thres.Value);
                    break;
                }
                else
                {
                    tax += Util.Round2dp(thres.Key * thres.Value);
                    income -= thres.Key;
                }
            }

            return Util.Round2dp(tax / 12);
        }
    }

    public static class Util
    {
        public static int _count = 0;
        public static double Round2dp(double input) => Math.Round(input, 2);
    }
}

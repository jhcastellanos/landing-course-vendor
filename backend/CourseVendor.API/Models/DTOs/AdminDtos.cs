namespace CourseVendor.API.Models.DTOs;

public class AdminLoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AdminLoginResponse
{
    public bool Success { get; set; }
    public string Token { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class CreateCourseRequest
{
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal FullPrice { get; set; }
    public decimal DiscountPercentage { get; set; }
    public DateTime? StartDate { get; set; }
}

public class UpdateCourseRequest
{
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal FullPrice { get; set; }
    public decimal DiscountPercentage { get; set; }
    public bool IsActive { get; set; }
    public DateTime? StartDate { get; set; }
}

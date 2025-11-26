using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseVendor.API.Data;
using CourseVendor.API.Models.DTOs;
using CourseVendor.API.Services;

namespace CourseVendor.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly IPurchaseService _purchaseService;
    private readonly ILogger<PaymentController> _logger;
    private readonly AppDbContext _context;

    public PaymentController(
        IPaymentService paymentService,
        IPurchaseService purchaseService,
        ILogger<PaymentController> logger,
        AppDbContext context)
    {
        _paymentService = paymentService;
        _purchaseService = purchaseService;
        _logger = logger;
        _context = context;
    }

    [HttpPost("create-order")]
    public async Task<ActionResult<CreateOrderResponse>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        try
        {
            // Get course to get amount
            var course = await _context.Courses.FindAsync(request.CourseId);
            if (course == null)
            {
                return NotFound(new { message = "Course not found" });
            }

            // Create PayPal order first
            var order = await _paymentService.CreateOrderAsync(
                request.CourseId,
                course.FinalPrice
            );

            // Create purchase record with PayPal order ID
            await _purchaseService.CreatePurchaseAsync(
                request.CourseId,
                request.CustomerEmail,
                request.CustomerName,
                order.OrderId
            );

            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order");
            return StatusCode(500, new { message = "Failed to create order" });
        }
    }

    [HttpPost("capture-order")]
    public async Task<ActionResult<CapturePaymentResponse>> CaptureOrder([FromBody] CapturePaymentRequest request)
    {
        try
        {
            // Capture PayPal order
            var (success, transactionId) = await _paymentService.CaptureOrderAsync(request.OrderId);

            if (!success)
            {
                return BadRequest(new CapturePaymentResponse
                {
                    Success = false,
                    Message = "Payment capture failed"
                });
            }

            // Complete purchase and send emails
            var purchase = await _purchaseService.CompletePurchaseAsync(request.OrderId, transactionId);

            if (purchase == null)
            {
                return NotFound(new CapturePaymentResponse
                {
                    Success = false,
                    Message = "Purchase not found"
                });
            }

            return Ok(new CapturePaymentResponse
            {
                Success = true,
                PurchaseCode = purchase.PurchaseCode,
                TransactionId = transactionId,
                Message = "Payment completed successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error capturing order");
            return StatusCode(500, new CapturePaymentResponse
            {
                Success = false,
                Message = "Failed to process payment"
            });
        }
    }
}

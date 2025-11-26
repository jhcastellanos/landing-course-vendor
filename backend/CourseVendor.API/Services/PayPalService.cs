using PayPalCheckoutSdk.Core;
using PayPalCheckoutSdk.Orders;
using PayPalHttp;
using CourseVendor.API.Models.DTOs;

namespace CourseVendor.API.Services;

public class PayPalService : IPaymentService
{
    private readonly PayPalHttpClient _client;
    private readonly IConfiguration _configuration;

    public PayPalService(IConfiguration configuration)
    {
        _configuration = configuration;
        var environment = GetEnvironment();
        _client = new PayPalHttpClient(environment);
    }

    private PayPalEnvironment GetEnvironment()
    {
        var mode = _configuration["PayPal:Mode"];
        var clientId = _configuration["PayPal:ClientId"];
        var clientSecret = _configuration["PayPal:ClientSecret"];

        if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
        {
            throw new InvalidOperationException("PayPal credentials are not configured");
        }

        return mode?.ToLower() == "live"
            ? new LiveEnvironment(clientId, clientSecret)
            : new SandboxEnvironment(clientId, clientSecret);
    }

    public async Task<CreateOrderResponse> CreateOrderAsync(int courseId, decimal amount)
    {
        var request = new OrdersCreateRequest();
        request.Prefer("return=representation");
        request.RequestBody(BuildRequestBody(courseId, amount));

        try
        {
            var response = await _client.Execute(request);
            var result = response.Result<Order>();

            var approvalUrl = result.Links
                .FirstOrDefault(link => link.Rel == "approve")?.Href ?? string.Empty;

            return new CreateOrderResponse
            {
                OrderId = result.Id,
                ApprovalUrl = approvalUrl
            };
        }
        catch (HttpException ex)
        {
            throw new InvalidOperationException($"PayPal error: {ex.Message}", ex);
        }
    }

    public async Task<(bool success, string transactionId)> CaptureOrderAsync(string orderId)
    {
        var request = new OrdersCaptureRequest(orderId);
        request.RequestBody(new OrderActionRequest());

        try
        {
            var response = await _client.Execute(request);
            var result = response.Result<Order>();

            var captureId = result.PurchaseUnits[0]
                .Payments?.Captures?[0]?.Id ?? string.Empty;

            return (result.Status == "COMPLETED", captureId);
        }
        catch (HttpException ex)
        {
            return (false, string.Empty);
        }
    }

    private OrderRequest BuildRequestBody(int courseId, decimal amount)
    {
        return new OrderRequest()
        {
            CheckoutPaymentIntent = "CAPTURE",
            PurchaseUnits = new List<PurchaseUnitRequest>
            {
                new PurchaseUnitRequest
                {
                    Description = $"Course #{courseId}",
                    AmountWithBreakdown = new AmountWithBreakdown
                    {
                        CurrencyCode = "USD",
                        Value = amount.ToString("F2")
                    }
                }
            },
            ApplicationContext = new ApplicationContext
            {
                BrandName = "Course Vendor",
                LandingPage = "BILLING",
                UserAction = "PAY_NOW",
                ReturnUrl = $"{_configuration["Frontend:Url"]}/checkout/success",
                CancelUrl = $"{_configuration["Frontend:Url"]}/checkout/cancel"
            }
        };
    }
}

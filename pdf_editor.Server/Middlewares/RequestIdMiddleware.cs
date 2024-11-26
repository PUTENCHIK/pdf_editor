using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;

public class RequestIdMiddleware {
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestIdMiddleware> _logger;

    public RequestIdMiddleware(RequestDelegate next, ILogger<RequestIdMiddleware> logger) {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context) {
        string requestId = Guid.NewGuid().ToString();
        context.Items["RequestId"] = requestId;
        _logger.LogInformation($"Обработка запроса начата. RequestId: {requestId}");

        try {
            await _next(context);
        }
        catch (Exception ex) {
            _logger.LogError(ex, $"Ошибка обработки запроса. RequestId: {requestId}");
            throw;
        }
        finally {
            _logger.LogInformation($"Обработка запроса завершена. RequestId: {requestId}");
        }
    }
}
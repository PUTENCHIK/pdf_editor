

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddLogging();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddFilter("Microsoft", LogLevel.Warning);
builder.Logging.AddFilter("System", LogLevel.Warning);

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAllOrigins", policyBuilder => {
        policyBuilder.WithOrigins("http://localhost:44318", "http://localhost:11271", "http://localhost:3000", "http://localhost:5221", "https://localhost:7282");
        policyBuilder.AllowAnyHeader();
        policyBuilder.AllowAnyMethod();
        policyBuilder.AllowCredentials();
    });
});


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseMiddleware<RequestIdMiddleware>();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAllOrigins");

app.UseAuthorization();



app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

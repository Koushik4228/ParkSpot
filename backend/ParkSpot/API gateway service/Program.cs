using Ocelot.DependencyInjection;
using Ocelot.Middleware;

namespace API_gateway_service
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Configuration.SetBasePath(builder.Environment.ContentRootPath).AddJsonFile("API-gateway-config.json", false, reloadOnChange:true);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
                 builder.Services.AddCors(options =>
                 {
                     options.AddPolicy("AllowAllOrigins",
                         builder =>
                         {
                             builder.WithOrigins("http://localhost:5173")

                             .AllowAnyMethod()
                             .AllowAnyHeader()
                             .AllowCredentials();
                         });
                 });
            builder.Services.AddOcelot();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowAllOrigins");

            app.UseAuthorization();
            app.UseOcelot().Wait();


            app.MapControllers();
            app.MapGet("/Hello", () => "welcome to gateway");
            app.Run();
        }
    }
}

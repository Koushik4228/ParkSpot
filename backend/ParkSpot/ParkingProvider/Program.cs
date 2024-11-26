
using Microsoft.EntityFrameworkCore;
using ParkingProvider.Data_Context;
using ParkingProvider.IRepository;
using ParkingProvider.Services;

namespace ParkingProvider
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);


            //Add a DB context
            builder.Services.AddDbContext<ParkingSlotDbContext>(option => option.UseSqlServer(builder.Configuration.GetConnectionString("ParkingProviderSlots")));



            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddScoped<ISlotRepository, SlotService>();




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


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseCors("AllowAllOrigins");


            app.MapControllers();

            app.Run();
        }
    }
}

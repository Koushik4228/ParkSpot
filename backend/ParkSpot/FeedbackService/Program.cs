
using FeedbackService.DataAccess;
using FeedbackService.IRepository;
using FeedbackService.Repository;
using Microsoft.EntityFrameworkCore;

namespace FeedbackService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<FeedbackDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("FeedbackServiceDatabase")));

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            //Repo and IRepo
            builder.Services.AddScoped<IFeedbackRepository, UserFeedback>();




            // Configure the HTTP request pipeline.
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

                app.UseCors("AllowAllOrigins");

            app.UseAuthorization();


                app.MapControllers();

                app.Run();

            
            }
    }

}

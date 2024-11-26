
using AccountService.AccountMapperProfile;
using AccountService.DBContext;
using AccountService.Modal;
using AccountService.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using JWT;

namespace AccountService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.


            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddJwtAuthentication();

            builder.Services.AddHttpClient("EmailServiceClient", client =>
            {
                client.BaseAddress = new Uri("https://localhost:7154/api/Email/send");
            });

            builder.Services.AddDbContext<AccountDBContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("AccountDBConnection")));

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



            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()

            .AddEntityFrameworkStores<AccountDBContext>()

            .AddDefaultTokenProviders();

            builder.Services.AddControllers();

            builder.Services.AddScoped<IAccountRepository, AccountRepository>();



            builder.Services.AddAutoMapper(typeof(AccountProfile).Assembly);


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthentication();

            app.UseCors("AllowAllOrigins");


            app.UseAuthorization();

            app.MapControllers();

            app.Run();


        }
    }
}

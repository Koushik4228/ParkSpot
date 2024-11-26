using AccountService.DTO;
using AccountService.Modal;
using AutoMapper;

namespace AccountService.AccountMapperProfile
{
    public class AccountProfile : Profile
    {
        public AccountProfile()
        {


            CreateMap<User, UserDTO>();
            CreateMap<UserDTO, User>()
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => "service"));
        }
    }
}

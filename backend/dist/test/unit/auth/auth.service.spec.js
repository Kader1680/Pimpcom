"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("../../../src/auth/auth.service");
const users_service_1 = require("../../../src/users/users.service");
const jwt_1 = require("@nestjs/jwt");
describe('AuthService', () => {
    let authService;
    const mockUsersService = {
        create: jest.fn(),
        findByEmail: jest.fn(),
    };
    const mockJwtService = {
        sign: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: users_service_1.UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();
        authService = module.get(auth_service_1.AuthService);
    });
    it('should be defined', () => {
        expect(authService).toBeDefined();
    });
});
//# sourceMappingURL=auth.service.spec.js.map
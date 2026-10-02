"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
describe('AuthService', () => {
    let service;
    let usersService;
    let jwtService;
    const mockUsersService = {
        findByEmail: jest.fn(),
    };
    const mockJwtService = {
        signAsync: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: users_service_1.UsersService, useValue: mockUsersService },
                { provide: jwt_1.JwtService, useValue: mockJwtService },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        usersService = module.get(users_service_1.UsersService);
        jwtService = module.get(jwt_1.JwtService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('login', () => {
        it('should return an access token if credentials are valid', async () => {
            const email = 'test@test.com';
            const password = 'password123';
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = { id: 1, email, password: hashedPassword };
            mockUsersService.findByEmail.mockResolvedValue(user);
            mockJwtService.signAsync.mockResolvedValue('fake-jwt-token');
            const result = await service.login(email, password);
            expect(result).toEqual({ accessToken: 'fake-jwt-token' });
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
        });
        it('should throw UnauthorizedException if user not found', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            await expect(service.login('wrong@test.com', 'password123')).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map
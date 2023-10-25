"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadsRoute = void 0;
const leads_1 = __importDefault(require("../models/leads"));
const register_1 = require("../validation/leads/register");
const register_2 = require("../swagger/leads/register");
const options = { abortEarly: false, stripUnknown: true };
exports.leadsRoute = [
    {
        method: "POST",
        path: "/register",
        options: {
            description: "Register Leads",
            plugins: register_2.leadsRegisterSwagger,
            tags: ["api", "leads"],
            validate: {
                payload: register_1.createLeadsSchema,
                options,
                failAction: (request, h, error) => {
                    const details = error.details.map((d) => {
                        return {
                            message: d.message,
                            path: d.path,
                        };
                    });
                    return h.response(details).code(400).takeover();
                },
            },
        },
        handler: (request, response) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const email = request.payload["email"];
                const user = yield leads_1.default.findOne({ email });
                if (user) {
                    return response.response([{ message: "User already exists.", code: 409 }]).code(409);
                }
                // get leads data from request data
                const newLeadsData = {
                    name: request.payload['name'],
                    email: request.payload['email'],
                    phone: request.payload['phone'],
                    car: request.payload['car'],
                    year: request.payload['year'],
                    fipe: request.payload['fipe'],
                    mileage: request.payload['mileage'],
                    entry: request.payload['entry'],
                    installment: request.payload['installment'],
                    paid: request.payload['paid'],
                    times: request.payload['times'],
                };
                const newLeads = new leads_1.default(newLeadsData);
                // save leads in db
                const leadsResult = yield newLeads.save();
                return response.response([{ leadsResult, code: 201 }]).code(201);
            }
            catch (error) {
                return response.response(error).code(500);
            }
        })
    }
];
//# sourceMappingURL=leads.js.map
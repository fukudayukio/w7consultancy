import { Request, ResponseToolkit } from "@hapi/hapi";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";

import Leads from "../models/leads";

import { createLeadsSchema } from "../validation/leads/register";

import { leadsRegisterSwagger } from "../swagger/leads/register";

const options = { abortEarly: false, stripUnknown: true };
export let leadsRoute = [
    {
        method: "POST",
        path: "/register",
        options: {
            description: "Register Leads",
            plugins: leadsRegisterSwagger,
            tags: ["api", "leads"],
            validate: {
                payload: createLeadsSchema,
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
        handler: async (request: Request, response: ResponseToolkit) => {
            try {
                const email = request.payload["email"];
                const user = await Leads.findOne({ email });
                if (user) {
                    return response.response([{ message: "Leads already exists.", code: 409, color: "error" }]).code(409);
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
                }
                const newLeads: any = new Leads(newLeadsData);

                // save leads in db
                const leadsResult = await newLeads.save();
                return response.response([{ leadsResult, message: "Leads added successfully", code:201, color: "success" }]).code(201);
            } catch (error) {
                return response.response(error).code(500);
            }
        }
    }
]